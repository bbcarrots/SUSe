import { Service } from '$lib/classes/Service';
import { UsageLog, type UsageLogDBObj } from '$lib/classes/UsageLog';

export async function load({ params }) {
	/* Loads student records from the DB when page is created. */
	const studentNumber = Number(params.studentNumber);
	const today = new Date();
	const dayStart = today.getMonth() + 1 + ' ' + today.getDate() + ' ' + today.getFullYear();

	const usageLogResponse = await UsageLog.selectUsageLogs({
		usageLogID: 0,
		studentNumber: studentNumber,
        serviceType: [],
		minDate: new Date(dayStart).toISOString(), // need to convert to ISOString to filter DB
		maxDate: null
	});

	const serviceResponse = await Service.selectServices({
		serviceID: 0,
		serviceName: '',
		serviceType: [],
		inUse: null,
		isAdmin: false
	});

	if (!serviceResponse.success) {
		return serviceResponse;
	} else if (!usageLogResponse.success) {
		return usageLogResponse;
	}

    const activeUsageLogs: { [key: string]: UsageLogDBObj } = {};

    if (usageLogResponse.usageLogRaws != null) {
        for (const usageLog of usageLogResponse.usageLogRaws) {
            activeUsageLogs[usageLog.service_type] = usageLog
        }
    }

	return {
		success: true,
		activeUsageLogs: activeUsageLogs,
		availableServices: serviceResponse.availableServices,
		error: ''
	};
}
