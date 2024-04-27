import { createClient } from '@supabase/supabase-js';
// import { env } from '$env/dynamic/public';
import { type ServiceDBObj, type ServiceFilter, type ServiceResponse } from '$lib/classes/Service';

// creates the connection to SUSe supabase
export const supabase = createClient(
	'https://yfhwfzwacdlqmyunladz.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaHdmendhY2RscW15dW5sYWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MDIyNjEsImV4cCI6MjAyNTQ3ODI2MX0.gzr5edDIVJXS1YYsQSyuZhc3oHGQYuVDtVfH4_2d30A'
);

const success: ServiceResponse = {
	success: true,
	serviceRaws: null,
	availableServices: null,
	error: null
};

export async function selectServiceDB(filter: ServiceFilter): Promise<ServiceResponse> {
	/* Selects the service record/s from the database using a filter.
    Filter contains option for service ID, type, name, if in use, and if is admin. */
	let query = supabase
		.from('service')
		.select('service_id, service_name, in_use, service_type (service_type)');

	// if user is an admin, selects service_id, service_name, service_type, in_use
	if (filter.isAdmin) {
		query = query.eq('in_use', filter.inUse);

		if (filter.serviceID) {
			query = query.eq('service_id', filter.serviceID);
		}

		if (filter.serviceName) {
			query = query.like('service_name', '%' + filter.serviceName + '%');
		}

		if (filter.serviceType) {
			query = query.eq('service_type', filter.serviceType);
		}
	} else {
		// if user is a student, selects all services which are not in_use
		query = query.eq('in_use', false);
	}

	const { data, error } = await query;

	if (error) {
		return {
			success: false,
			serviceRaws: null,
			availableServices: null,
			error: error.message
		};
	}

	// formats query return value into ServiceDBObj
	if (filter.isAdmin) {
		const formattedData: ServiceDBObj[] = [];
		if (data != null) {
			for (const row of data) {
				formattedData.push({
					service_id: row.service_id,
					service_name: row.service_name,
					service_type: row.service_type.service_type, // we assume each service only has one service_type
					in_use: row.in_use
				});
			}
			return {
				success: true,
				serviceRaws: formattedData,
				availableServices: null,
				error: null
			};
		}
	}

	const serviceTypeCount: { [key: string]: number } = {};

	if (data != null) {
		// counts number of times a particular service_type appears
		for (const row of data) {
			if (row.service_type.service_type in serviceTypeCount) {
				serviceTypeCount[row.service_type.service_type] += 1;
			} else {
				serviceTypeCount[row.service_type.service_type] = 1;
			}
		}
	}

	return {
		success: true,
		serviceRaws: null,
		availableServices: serviceTypeCount,
		error: null
	};
}

export async function insertServiceDB(service: ServiceDBObj): Promise<ServiceResponse> {
	/* Inserts a non-existing service record into the database. */
	delete (service as { service_type?: string }).service_type; // deletes the service_type property to properly insert a service

	const { error } = await supabase.from('service').insert(service);

	if (error) {
		return {
			success: false,
			serviceRaws: null,
			availableServices: null,
			error: error.message
		};
	}

	return success;
}

async function checkServiceExistsDB(filter: ServiceFilter): Promise<ServiceResponse> {
	/* Checks if there is a single existing record of a service with the given service number and username. */
	const serviceDB = await selectServiceDB(filter);

	if (serviceDB.success && serviceDB.serviceRaws?.length == 1) {
		return success;
	}

	return {
		success: false,
		serviceRaws: null,
		availableServices: null,
		error: 'Error: Service does not exist'
	};
}

export async function updateServiceDB(service: ServiceDBObj): Promise<ServiceResponse> {
	/* Updates a service record based using their service ID.
    NOTE: Cannot update the service id, service type, or if in use. Need to delete and insert again. */
	const serviceCheck = await checkServiceExistsDB({
		serviceID: service.service_id,
		serviceName: '',
		serviceType: '',
		inUse: service.in_use,
		isAdmin: true
	});

	if (!serviceCheck.success) {
		return serviceCheck;
	}

	const updateObj: { [key: string]: string | boolean } = {};

	for (const [key, value] of Object.entries(service)) {
		if (value && (typeof value == 'string' || typeof value == 'boolean')) {
			updateObj[key] = value;
		}
	}

	const { error } = await supabase
		.from('service')
		.update(updateObj)
		.eq('service_id', service.service_id);

	if (error) {
		return {
			success: false,
			serviceRaws: null,
			availableServices: null,
			error: error.message
		};
	}

	return success;
}

export async function deleteServiceDB(serviceID: number): Promise<ServiceResponse> {
	/* Deletes an existing service record. */
	const serviceCheck = await checkServiceExistsDB({
		serviceID: serviceID,
		serviceName: '',
		serviceType: '',
		inUse: false, // service has to be not in use to be deleted
		isAdmin: true
	});

	if (!serviceCheck.success) {
		return serviceCheck;
	}

	const { error } = await supabase.from('service').delete().eq('service_id', serviceID);

	if (error) {
		return {
			success: false,
			serviceRaws: null,
			availableServices: null,
			error: error.message
		};
	}

	return success;
}
