import { Service } from '$lib/classes/Service';
import { UsageLog } from '$lib/classes/UsageLog';

export async function load() {
// export async function load({ params }) {  
	/* Loads student records from the DB when page is created. */
	const studentNumber = 202021211; // placeholder
    // const studentNumber = params.sn
	const today = new Date();
	const dayStart = today.getMonth() + 1 + ' ' + today.getDate() + ' ' + today.getFullYear();

	const usageLogResponse = await UsageLog.selectUsageLogs({
		usageLogID: 0,
		studentNumber: studentNumber,
		minDate: new Date(dayStart).toISOString(), // need to convert to ISOString to filter DB
		maxDate: new Date().toISOString() // gets date today
	});

	const serviceResponse = await Service.selectServices({
		serviceID: 0,
		serviceName: '',
		serviceType: '',
		inUse: false,
		isAdmin: false
	});

	if (!serviceResponse.success) {
		return serviceResponse;
	} else if (!usageLogResponse.success) {
		return usageLogResponse;
	}

	return {
		success: true,
		activeUsageLogs: usageLogResponse.usageLogRaws,
		availableServices: serviceResponse.availableServices,
		error: ''
	};
}
