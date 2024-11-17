import { LOCATION } from '$env/static/private';
import { Admin } from '$lib/classes/Admin.js';
import { Service } from '$lib/classes/Service.js';
import { Student } from '$lib/classes/Student.js';
import { UsageLog, type UsageLogDBObj } from '$lib/classes/UsageLog.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	/* Handles Avail Service requests for service and usage log records. */
	const { studentNumber, serviceType, updateStudent } = await request.json();

	//----------------------------------------------------SELECTS

	const serviceSelectResponse = await Service.selectServices({
		serviceID: 0,
		serviceName: '',
		serviceType: serviceType,
		inUse: false,
		isAdmin: true
	});

	if (!serviceSelectResponse.success) {
		return json(serviceSelectResponse);
	} else if (serviceSelectResponse.serviceRaws?.length == 0) {
		return json({
			success: false,
			serviceRaws: null,
			availableServices: null,
			error: `Error: No available service of type ${serviceType}`
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

export async function PATCH({ request }) {
	/* Handles End Service requests for service and usage log records. */
	const { studentNumber, usageLogID, updateStudent } = await request.json();

	//----------------------------------------------------SELECTS

	const usageLogSelectResponse = await UsageLog.selectUsageLogs({
		usageLogID: usageLogID,
		studentNumber: 0,
        serviceType: [],
		minDate: '',
		maxDate: ''
	});

	if (!usageLogSelectResponse.success) {
		return json(usageLogSelectResponse);
	} else if (usageLogSelectResponse.usageLogRaws?.length == 0) {
		return json({
			success: false,
			usageLogRaws: null,
			error: 'Error: Usage Log does not exist.'
		});
	}

	const serviceID = usageLogSelectResponse.usageLogRaws?.[0].service_id;

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
			is_active: false
		});

		if (!studentUpdateResponse.success) {
			return json(studentUpdateResponse);
		}
	}

	const dateToday = new Date().toISOString();

	const usageLog = {
		ul_id: usageLogID,
		sn_id: 0,
		admin_id: 0,
		service_id: 0,
		service_type: '',
		datetime_start: '',
		datetime_end: dateToday,
        location: ''
	};

	delete (usageLog as { sn_id?: number }).sn_id;
	delete (usageLog as { admin_id?: number }).admin_id;
	delete (usageLog as { service_id?: number }).service_id;
	delete (usageLog as { service_type?: string }).service_type;
	delete (usageLog as { datetime_start?: string }).datetime_start;

	const usageLogUpdateResponse = await UsageLog.updateUsageLog(usageLog);

	if (!usageLogUpdateResponse.success) {
		return json(usageLogUpdateResponse);
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
