import { type ServiceDBObj, type ServiceResponse } from '$lib/classes/Service';
import { type ServiceFilter } from '$lib/utils/types';
import { supabase } from './SupabaseClient';

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
		.select('service_id, service_type_id, service_name, in_use, service_type (service_type)');

	// if user is an admin, selects service_id, service_name, service_type, in_use
	if (filter.isAdmin) {
		if (filter.inUse != null) {
			query = query.eq('in_use', filter.inUse);
		}

		if (filter.serviceID) {
			query = query.eq('service_id', filter.serviceID);
		}

		if (filter.serviceName) {
			query = query.like('service_name', '%' + filter.serviceName + '%');
		}
	} else {
		// if user is a student, selects all services which are not in_use
		if (filter.inUse != null) {
			query = query.eq('in_use', filter.inUse);
		}
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
				if (filter.serviceType.length && filter.serviceType.includes(row.service_type.service_type)) {
					formattedData.push({
						service_id: row.service_id,
						service_type_id: row.service_type_id,
						service_name: row.service_name,
						service_type: row.service_type.service_type, // we assume each service only has one service_type
						in_use: row.in_use
					});
				} else if (filter.serviceType.length == 0) {
					formattedData.push({
						service_id: row.service_id,
						service_type_id: row.service_type_id,
						service_name: row.service_name,
						service_type: row.service_type.service_type, // we assume each service only has one service_type
						in_use: row.in_use
					});
				}
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
				if (!row.in_use) {
					serviceTypeCount[row.service_type.service_type] += 1;
				}
			} else {
				if (row.in_use) {
					serviceTypeCount[row.service_type.service_type] = 0;
				} else {
					serviceTypeCount[row.service_type.service_type] = 1;
				}
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
		if (serviceDB.serviceRaws[0].in_use) {
			return {
				success: true,
				serviceRaws: null,
				availableServices: null,
				error: 'Warning: Service is in use.'
			};
		}

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
		serviceType: [],
		inUse: null,
		isAdmin: true
	});

	if (!serviceCheck.success) {
		return serviceCheck;
	}

	const updateObj: { [key: string]: string | boolean } = {};

	for (const [key, value] of Object.entries(service)) {
		if (
			((value && typeof value == 'string') || typeof value == 'boolean') &&
			key != 'service_id' &&
			key != 'service_type_id' &&
			key != 'service_type'
		) {
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
		serviceType: [],
		inUse: null,
		isAdmin: true
	});

	if (!serviceCheck.success) {
		return serviceCheck;
	} else if (serviceCheck.error == 'Warning: Service is in use.') {
        return {
			success: false,
			serviceRaws: null,
			availableServices: null,
			error: serviceCheck.error
		};
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
