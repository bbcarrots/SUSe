import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// services
import { type ServiceDBObj, type ServiceFilter, type ServiceResponse } from '$lib/classes/Service';
import { insertServiceDB, deleteServiceDB, updateServiceDB, selectServiceDB } from '$lib/server/ServiceSB';

describe('sanity/integrity test: it should add 5 and 3 properly', () => {
	it('adds 5 + 3 to equal 8', () => {
		expect(5 + 3).toBe(8);
	});
});

describe('Service.insertService', async () => {
	const newServiceID = 999999;
	const newServiceName = 'Red automatic umbrella';
	const serviceInstance: ServiceDBObj = {
		service_id: newServiceID,
		service_type_id: 2, // service type number of umbrella
		service_name: newServiceName,
		service_type: 'Umbrella', // service type name of umbrellas
		in_use: false
	};

	it('success: inserted service in database', async () => {
		// returned ServiceResponse upon successful insert into database
		const expectedState: ServiceResponse = {
			// defined "success" state in ServiceSB.ts
			success: true,
			serviceRaws: null,
			availableServices: null,
			error: null
		};
		await expect(insertServiceDB(serviceInstance)).resolves.toStrictEqual(expectedState);
		await deleteServiceDB(newServiceID); // clean up dummy entry
	});
});

describe('fail: Service.insertService with same Service ID', async () => {
	// service names are not unique
	// create dummy serviceInstance for insertion
	const newServiceNumber = 100003;
	const newServiceName = 'fx-991EX Classwiz';
	const serviceInstance: ServiceDBObj = {
		service_id: newServiceNumber,
		service_type_id: 1, // service type number of calculator
		service_name: newServiceName,
		service_type: 'Calculator',
		in_use: false
	};

	beforeEach(async () => {
		await insertServiceDB(serviceInstance); // insert serviceInstance first
	});

	afterEach(async () => {
		await deleteServiceDB(newServiceNumber); // clean up serviceInstance
	});

	it('error: inserting service with service number already in use', async () => {
		// returned ServiceResponse upon failed insert with existing service_id
		const expectedState: ServiceResponse = {
			success: false,
			serviceRaws: null,
			availableServices: null,
			error: 'duplicate key value violates unique constraint "service_pkey"' // error message from supabase with existing service ID
		};

		// create 2nd dummy serviceSameID with same service number
		const serviceSameID: ServiceDBObj = {
			service_id: newServiceNumber,
			service_type_id: 1, // service type number of calculator
			service_name: 'another fx-991EX Classwiz',
			service_type: 'Calculator',
			in_use: false
		};

		// insert serviceSameID, should error
		await expect(insertServiceDB(serviceSameID)).resolves.toStrictEqual(expectedState);
	});
});

describe('updateServiceDB()', async () => {
	const newServiceNumber = 100004;
	const newServiceName = 'Extension cord (5 meters)';
	const serviceInstance: ServiceDBObj = {
		service_id: newServiceNumber,
		service_type_id: 3, // service type number of extension cord
		service_name: newServiceName,
		service_type: 'Extension Cord',
		in_use: false
	};

	beforeEach(async () => {
		await insertServiceDB(serviceInstance); // insert serviceInstance first
	});

	afterEach(async () => {
		await deleteServiceDB(newServiceNumber); // clean up serviceInstance
	});

	it('success: inserted service correctly updated in database', async () => {
		// instance that updates service name only

		const updatedServiceInstance: ServiceDBObj = {
			service_id: newServiceNumber,
			service_type_id: 3, // service type number of extension cord
			service_name: 'Extension Cord (4.5 meters)',
			service_type: 'Extension Cord',
			in_use: false
		};

		// update the service
		await updateServiceDB(updatedServiceInstance);

		// select the updated service for crosschecking
		const updatedServiceFilter: ServiceFilter = {
			serviceID: newServiceNumber,
			serviceName: 'Extension Cord (4.5 meters)',
			serviceType: 'Extension Cord',
			inUse: false,
			isAdmin: true
		};
		const updatedServiceOutput = await selectServiceDB(updatedServiceFilter);
		if (updatedServiceOutput.serviceRaws !== null) {
			// selected service from DB should be same with our updatedServiceInstance
			expect(updatedServiceOutput.serviceRaws[0]).toStrictEqual(updatedServiceInstance);
		}
	});

	it('error: updating with wrong service number', async () => {
		// returned ServiceResponse upon failed insert into database
		const expectedState: ServiceResponse = {
			success: false,
			serviceRaws: null,
			availableServices: null,
			error: 'Error: Service does not exist'
		};
		const wrongServiceNumber: number = 300004;

		const updatedServiceInstance: ServiceDBObj = {
			service_id: wrongServiceNumber,
			service_type_id: 3, // service type number of extension cord
			service_name: 'Extension Cord (4.5 meters)',
			service_type: 'Extension Cord',
			in_use: false
		};

		await expect(updateServiceDB(updatedServiceInstance)).resolves.toStrictEqual(expectedState);
	});
});

describe('deleteServiceDB()', async () => {
	const newServiceNumber = 100005;
	const newServiceName = 'Lenovo Ideapad Slim 3';

	const serviceInstance: ServiceDBObj = {
		service_id: newServiceNumber,
		service_type_id: 5, // service type number of laptop
		service_name: newServiceName,
		service_type: 'Laptop',
		in_use: false
	};

	beforeEach(async () => {
		await insertServiceDB(serviceInstance); // insert serviceInstance first
	});

	it('success: deleted service in database', async () => {
		// returned ServiceResponse upon successful deletion from database
		const expectedState: ServiceResponse = {
			success: true,
			serviceRaws: null,
			availableServices: null,
			error: null
		};
		await expect(deleteServiceDB(newServiceNumber)).resolves.toStrictEqual(expectedState);
	});

	it('error: deleting nonexistent service in database', async () => {
		// returned ServiceResponse upon failed deletion from database
		const expectedState: ServiceResponse = {
			success: false,
			serviceRaws: null,
			availableServices: null,
			error: 'Error: Service does not exist'
		};

		await expect(deleteServiceDB(900000000)).resolves.toStrictEqual(expectedState);
		await deleteServiceDB(serviceInstance.service_id);
	});
});

describe('error: deleting service that is in use', async () => {
	const newServiceNumber = 100021;
	const newServiceName = 'Extension cord (5 meters)';
	const serviceInstance: ServiceDBObj = {
		service_id: newServiceNumber,
		service_type_id: 3, // service type number of extension cord
		service_name: newServiceName,
		service_type: 'Extension Cord',
		in_use: true
	};

	it('error: deleting service that is in use', async () => {
		await insertServiceDB(serviceInstance); // insert serviceInstance first

		// returned ServiceResponse upon failed deletion from database
		const expectedState: ServiceResponse = {
			success: true,
			serviceRaws: null,
			availableServices: null,
			error: 'Warning: Service is in use.'
		};

		await expect(deleteServiceDB(newServiceNumber)).resolves.toStrictEqual(expectedState);
		serviceInstance.in_use = false;
		await updateServiceDB(serviceInstance);
		await deleteServiceDB(newServiceNumber);
	});
});

describe('selectServiceDB single selects', async () => {
	const newServiceNumber = 100006;
	const newServiceName = 'Acer Nitro 5 AN515-58-50YE';
	const glassesServiceNumber = 100020;

	const serviceInstanceList: ServiceDBObj[] = [];

	beforeEach(async () => {
		// insert dummy service instances first
		for (let offset = 0; offset < 3; offset++) {
			const serviceInstance: ServiceDBObj = {
				service_id: newServiceNumber + offset,
				service_type_id: 5, // service type number of laptop
				service_name: newServiceName,
				service_type: 'Laptop',
				in_use: false
			};

			serviceInstanceList.push(serviceInstance);
			await insertServiceDB(serviceInstance);
		}

		const glassesInstance: ServiceDBObj = {
			service_id: glassesServiceNumber,
			service_type_id: 4, // service type number of reading glasses
			service_name: 'Ray-Ban RB3183 (Black)',
			service_type: 'Reading Glasses',
			in_use: false
		};
		serviceInstanceList.push(glassesInstance);
		await insertServiceDB(glassesInstance);
	});

	afterEach(async () => {
		// clean up dummy entries
		for (const service of serviceInstanceList) {
			service.in_use = false;
			await updateServiceDB(service);
			await deleteServiceDB(service.service_id);
		}
	});

	it.todo('success: selected single service in database using service ID', async () => {
		const oneServiceFilter: ServiceFilter = {
			serviceID: 100006,
			serviceName: '',
			serviceType: '',
			inUse: false,
			isAdmin: true
		};
		const selectOutput = await selectServiceDB(oneServiceFilter);
		console.log(selectOutput);
		if (selectOutput.serviceRaws !== null) {
			const selectOutputServiceNumber = selectOutput.serviceRaws[0].service_id; // extract service number from selected service record
			// compare selected service number with inserted service number
			expect(selectOutputServiceNumber).toStrictEqual(serviceInstanceList[0].service_id);
		}
	});

	it('success: selecting single nonexistent service name, should be empty', async () => {
		const nonexistentServiceFilter: ServiceFilter = {
			serviceID: 0,
			serviceName: 'Nike LeBron 20 EP',
			serviceType: '',
			inUse: false,
			isAdmin: true
		};

		const selectOutput = await selectServiceDB(nonexistentServiceFilter);
		const selectOutputArray = selectOutput.serviceRaws;

		const expectedArray: ServiceDBObj[] = []; // serviceRaws array filed should be empty since record does not exist

		expect(selectOutputArray).toStrictEqual(expectedArray);
	});
});

describe('selectServiceDB, range', async () => {
	const newServiceNumber = 100006;
	const newServiceName = 'Acer Nitro 5 AN515-58-50YE';
	const glassesServiceNumber = 100020;

	const serviceInstanceList: ServiceDBObj[] = [];

	beforeEach(async () => {
		// insert dummy service instances first
		for (let offset = 0; offset < 3; offset++) {
			const serviceInstance: ServiceDBObj = {
				service_id: newServiceNumber + offset,
				service_type_id: 5, // service type number of laptop
				service_name: newServiceName,
				service_type: 'Laptop',
				in_use: newServiceNumber + (offset % 2) == 0 ? false : true
			};

			serviceInstanceList.push(serviceInstance);
			await insertServiceDB(serviceInstance);
		}

		const glassesInstance: ServiceDBObj = {
			service_id: glassesServiceNumber,
			service_type_id: 4, // service type number of reading glasses
			service_name: 'Ray-Ban RB3183 (Black)',
			service_type: 'Reading Glasses',
			in_use: false
		};
		serviceInstanceList.push(glassesInstance);
		await insertServiceDB(glassesInstance);
	});

	afterEach(async () => {
		// clean up dummy entries
		for (const service of serviceInstanceList) {
			if (service.in_use) {
				service.in_use = false;
				await updateServiceDB(service);
			}
			await deleteServiceDB(service.service_id);
		}
	});

	it('success: entries within a certain service type, admin', async () => {
		// insert multiple service entries first

		const multipleServiceFilter: ServiceFilter = {
			serviceID: 0,
			serviceName: '',
			serviceType: 'Laptop',
			inUse: null,
			isAdmin: true // so services even in use are shown
		};

		const selectOutput = await selectServiceDB(multipleServiceFilter);
		if (selectOutput.serviceRaws !== null) {
			const selectedOutputServiceNumbers = selectOutput.serviceRaws.map(
				(service) => service.service_id
			); // extract service number from selected service records
			const expectedServiceNumbers = [12, 13, 14, 15, 100006, 100007, 100008]; // all laptops, not including glasses

			// compare selected service number with inserted service number
			expect(selectedOutputServiceNumbers).toEqual(expect.arrayContaining(expectedServiceNumbers));
		}
	});

	it('success: entries within a certain service type, service (only inUse == false)', async () => {
		// insert multiple service entries first

		const multipleServiceFilter: ServiceFilter = {
			serviceID: 0,
			serviceName: '',
			serviceType: 'Laptop',
			inUse: false,
			isAdmin: false // so only services not in use are shown
		};

		const selectOutput = await selectServiceDB(multipleServiceFilter);
		if (selectOutput.serviceRaws !== null) {
			const selectedOutputServiceNumbers = selectOutput.serviceRaws.map(
				(service) => service.service_id
			); // extract service number from selected service records
			const expectedServiceNumbers = [100006, 100008]; // all even (not in use) laptops, not including glasses

			// compare selected service number with inserted service number
			expect(selectedOutputServiceNumbers.sort()).toEqual(expectedServiceNumbers.sort());
		}
	});

	it('success: selected services using serviceName', async () => {
		const nameServiceFilter: ServiceFilter = {
			serviceID: 0,
			serviceName: 'Acer Nitro 5 AN515-58-50YE',
			serviceType: '',
			inUse: null,
			isAdmin: true // so services even in use are shown
		};
		const selectOutput = await selectServiceDB(nameServiceFilter);
		const expectedServiceNumbers = [100006, 100007, 100008];

		if (selectOutput.serviceRaws !== null) {
			const outputServiceNumbers = selectOutput.serviceRaws.map((service) => service.service_id);
			expect(outputServiceNumbers.sort()).toEqual(expectedServiceNumbers.sort());
		}
	});
});
