import { LOCATION } from '$env/static/private';
import { Admin } from '$lib/classes/Admin.js';
import { Service } from '$lib/classes/Service.js';
import { Student, type StudentResponse } from '$lib/classes/Student.js';
import { UsageLog, type UsageLogDBObj, type UsageLogResponse } from '$lib/classes/UsageLog.js';
import type { UsageLogFilter } from '$lib/utils/types.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	/* Handles Avail Service requests for service and usage log records. */
	const { studentNumber, serviceID, serviceType, updateStudent } = await request.json();

	//----------------------------------------------------SELECTS

	const serviceSelectResponse = await Service.selectServices({
		serviceID: serviceID,
		serviceName: '',
		serviceType: serviceType,
		inUse: null,
		isAdmin: true
	});

	if (!serviceSelectResponse.success) {
		return json(serviceSelectResponse);
	} else if (serviceSelectResponse.serviceRaws?.length == 0) {
		return json({
			success: false,
			serviceRaws: null,
			availableServices: null,
			error: `Error: No available service with ID ${serviceID} of type ${serviceType}`
		});
	}

	const service = serviceSelectResponse.serviceRaws?.[0];

	const adminSelectResponse = await Admin.selectAdmins({
		adminID: 0,
		rfid: 0,
		nickname: '',
		isActive: true
	});

	if (!adminSelectResponse.success) {
		return json(adminSelectResponse);
	} else if (adminSelectResponse.adminRaws?.length == 0) {
		return json({
			success: false,
			adminRaws: null,
			error: 'Error: No active Admin.'
		});
	}

	const admin = adminSelectResponse.adminRaws?.[0];

	//----------------------------------------------------UPDATES&INSERTS

	if (updateStudent) {
		const studentUpdateResponse = await Student.updateStudent({
			sn_id: studentNumber,
			rfid: 0,
			username: '',
			first_name: '',
			middle_initial: '',
			last_name: '',
			college: '',
			program: '',
			phone_number: '',
			is_enrolled: true,
			is_active: true
		});

		if (!studentUpdateResponse.success) {
			return json(studentUpdateResponse);
		}
	}

	const serviceUpdateResponse = await Service.updateService({
		service_id: service!.service_id,
		service_type_id: 0,
		service_name: '',
		service_type: '',
		in_use: true
	});

	if (!serviceUpdateResponse.success) {
		return json(serviceUpdateResponse);
	}

	const dateToday = new Date().toISOString();

	const usageLog = {
		ul_id: 0,
		sn_id: studentNumber,
		admin_id: admin!.admin_id,
		service_id: service!.service_id,
		service_type: service!.service_type,
		datetime_start: dateToday,
		datetime_end: '',
		location: LOCATION
	};

	delete (usageLog as { ul_id?: number }).ul_id;
	delete (usageLog as { datetime_end?: string }).datetime_end;

	const usageLogInsertResponse = await UsageLog.insertUsageLog(usageLog);

	if (!usageLogInsertResponse.success) {
		return json(usageLogInsertResponse);
	}

	const usageLogSelectResponse = await UsageLog.selectUsageLogs({
		usageLogID: 0,
		studentNumber: studentNumber,
		serviceType: [serviceType],
		minDate: dateToday,
		maxDate: null
	});

	if (!usageLogSelectResponse.success) {
		return json(usageLogSelectResponse);
	}

	const activeUL: { [key: string]: UsageLogDBObj | undefined } = {};
	activeUL[serviceType] = usageLogSelectResponse.usageLogRaws?.[0];

	return json({
		success: true,
		activeUsageLogs: activeUL,
		availableServices: {},
		error: ''
	});
}

async function updateStudent(sn: number) {
	const studentUpdateResponse = await Student.updateStudent({
		sn_id: sn,
		rfid: 0,
		username: '',
		first_name: '',
		middle_initial: '',
		last_name: '',
		college: '',
		program: '',
		phone_number: '',
		is_enrolled: true,
		is_active: false
	});

	return studentUpdateResponse
}

export async function PATCH({ request }) {
	/* Handles End Service requests for service and usage log records. */
	const { studentNumber, usageLogID, serviceType, serviceID, isStudentUpdate } = await request.json();

	//----------------------------------------------------SELECTS

	let usageLogFilter: UsageLogFilter = serviceType == "Discussion Room" ? {
		usageLogID: 0,
		studentNumber: 0,
		serviceType: ["Discussion Room"],
		minDate: '',
		maxDate: null
	} : {
		usageLogID: usageLogID,
		studentNumber: 0,
		serviceType: [],
		minDate: '',
		maxDate: ''
	}

	const usageLogSelectResponse = await UsageLog.selectUsageLogs(usageLogFilter);

	if (!usageLogSelectResponse.success) {
		return json(usageLogSelectResponse);
	} else if (usageLogSelectResponse.usageLogRaws?.length == 0) {
		return json({
			success: false,
			usageLogRaws: null,
			error: 'Error: Usage Log/s does not exist.'
		});
	}

	const serviceSelectServiceResponse = await Service.selectServices({
		serviceID: serviceID != undefined ? serviceID : 0,
		serviceName: '',
		serviceType: [],
		inUse: true,
		isAdmin: true
	});

	if (!serviceSelectServiceResponse.success) {
		return json(serviceSelectServiceResponse);
	} else if (serviceSelectServiceResponse.serviceRaws?.length == 0) {
		return json({
			success: false,
			serviceRaws: null,
			availableServices: null,
			error: 'Error: Service cannot be found.'
		});
	}

	//----------------------------------------------------UPDATES

	const dateToday = new Date().toISOString();
	let usageLogUpdateResponse: UsageLogResponse;
	let studentUpdateResponse: StudentResponse

	for (let usageLog of usageLogSelectResponse.usageLogRaws!) {
		console.log(usageLog)

		const newUsageLog = {
			ul_id: usageLog.ul_id,
			sn_id: 0,
			admin_id: 0,
			service_id: 0,
			service_type: '',
			datetime_start: '',
			datetime_end: dateToday,
			location: ''
		};

		usageLogUpdateResponse = await UsageLog.updateUsageLog(newUsageLog)

		if (!usageLogUpdateResponse.success) {
			return json(usageLogUpdateResponse);
		}

		// if not discussion room, update sole student
		if (isStudentUpdate && serviceType != "Discussion Room") {
			studentUpdateResponse = await updateStudent(studentNumber);

			if (!studentUpdateResponse.success) {
				return json(studentUpdateResponse);
			}
		} else if (serviceType == "Discussion Room") { // discussion end service must check if other students should also be inactive
			const studentActiveResponse = await (UsageLog.selectUsageLogs({
				usageLogID: 0,
				studentNumber: usageLog.sn_id,
				serviceType: [],
				minDate: "",
				maxDate: null
			}))

			if (!studentActiveResponse.usageLogRaws?.length) {
				studentUpdateResponse = await updateStudent(usageLog.sn_id);
	
				if (!studentUpdateResponse.success) {
					return json(studentUpdateResponse);
				}
			}
		}
	}

	const serviceUpdateResponse = await Service.updateService({
		service_id: serviceID != undefined ? serviceID : 0,
		service_type_id: 0,
		service_name: '',
		service_type: '',
		in_use: false
	});

	if (!serviceUpdateResponse.success) {
		return json(serviceUpdateResponse);
	}

	//----------------------------------------------------SELECT

	const serviceSelectStudentResponse = await Service.selectServices({
		serviceID: serviceID != undefined ? serviceID : 0,
		serviceName: '',
		serviceType: [],
		inUse: false,
		isAdmin: false
	});

	if (!serviceSelectStudentResponse.success) {
		return json(serviceSelectStudentResponse);
	}

	return json({
		success: true,
		activeUsageLogs: {},
		availableServices: serviceSelectStudentResponse.availableServices,
		error: ''
	});
}
