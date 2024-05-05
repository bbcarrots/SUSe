import {
	insertServiceDB,
	selectServiceDB,
	updateServiceDB,
	deleteServiceDB
} from '$lib/server/ServiceSB';
import type { ServiceProcessed } from '$lib/utils/types';
import type { ServiceFilter } from '$lib/utils/types';

// parameter type for insert and update service DB functions
export type ServiceDBObj = {
	service_id: number;
    service_type_id: number,
	service_name: string;
	service_type: string;
	in_use: boolean;
};

// return value of service DB functions
export type ServiceResponse = {
	success: boolean;
	serviceRaws: ServiceDBObj[] | null;
	availableServices: { [key: string]: number } | null;
	error: string | null;
};

export class Service {
	/* Contains all service methods for conversion and DB communication. */

	public static toServiceDBObj(service: ServiceProcessed): ServiceDBObj {
		/* Converts a ServiceProcessed to a ServiceDBObj. */
		return {
			service_id: service.serviceID,
            service_type_id: service.serviceTypeID,
			service_name: service.serviceName,
			service_type: service.serviceType,
			in_use: service.inUse
		};
	}

	public static async selectServices(
		filter: ServiceFilter = {
			serviceID: 0,
			serviceName: '',
			serviceType: [],
			inUse: null,
			isAdmin: true
		}
	): Promise<ServiceResponse> {
		/* Selects all service records in database using the default or given filter. */
		return selectServiceDB(filter);
	}

	public static async insertService(service: ServiceDBObj): Promise<ServiceResponse> {
		/* Inserts unique service information in database. */
		return insertServiceDB(service);
	}

	public static async updateService(service: ServiceDBObj): Promise<ServiceResponse> {
		/* Updates the service record matching this service's service number. */
		return updateServiceDB(service);
	}

	public static async deleteService(serviceID: number): Promise<ServiceResponse> {
		/* Deletes the service record matching this Service's service number. */
		return deleteServiceDB(serviceID);
	}
}