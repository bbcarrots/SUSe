import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// services
import { type ServiceDBObj, type ServiceFilter, type ServiceResponse } from '$lib/classes/Service';
import { insertServiceDB, deleteServiceDB, updateServiceDB, selectServiceDB } from '$lib/server/ServiceSB';


describe('sanity/integrity test: it should add 5 and 3 properly', () => {
  it('adds 5 + 3 to equal 8', () => {
    expect(5 + 3).toBe(8);
  });
});


describe.todo('Service.insertService', () => {
  const newServiceID = 100002;
  const newServiceName = "Red automatic umbrella";
  const serviceInstance: ServiceDBObj = {
    service_id: newServiceID,
    service_type_id: 2,  // service type number of umbrella
    service_name: newServiceName,
    service_type: "Umbrella", // service type name of umbrellas
    in_use: false
  };

  it('success: inserted service in database', async () => {
    // returned StudentResponse upon successful insert into database
    const expectedState: ServiceResponse = { // defined "success" state in ServiceSB.ts
      success: true,
      serviceRaws: null,
      availableServices: null,
      error: null
    }
    await expect(insertServiceDB(serviceInstance)).resolves.toStrictEqual(expectedState);
    await deleteServiceDB(newServiceID); // clean up dummy entry
  });
});

describe('fail: Service.insertService with same Service ID', () => { // service names are not unique
  // create dummy serviceInstance for insertion
  const newServiceNumber = 100003;
  const newServiceName = "fx-991EX Classwiz";
  const serviceInstance: ServiceDBObj = {
    service_id: newServiceNumber,
    service_type_id: 1, // service type number of calculator
    service_name: newServiceName,
    service_type: "Calculator",
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
    }

    // create 2nd dummy serviceSameID with same service number
    const serviceSameID: ServiceDBObj = {
      service_id: newServiceNumber,
      service_type_id: 1, // service type number of calculator
      service_name: "another fx-991EX Classwiz",
      service_type: "Calculator",
      in_use: false
    };

    // insert serviceSameID, should error
    await expect(insertServiceDB(serviceSameID)).resolves.toStrictEqual(expectedState)
  });

});

describe('updateServiceDB()', () => {
  const newServiceNumber = 100004;
  const newServiceName = "Extension cord (5 meters)";
  const serviceInstance: ServiceDBObj = {
    service_id: newServiceNumber,
    service_type_id: 3, // service type number of extension cord
    service_name: newServiceName,
    service_type: "Extension Cord",
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
      service_name: "Extension Cord (4.5 meters)",
      service_type: "Extension Cord",
      in_use: false
    };

    // update the service
    await updateServiceDB(updatedServiceInstance);

    // select the updated service for crosschecking
    const updatedServiceFilter: ServiceFilter = {
      serviceID: newServiceNumber,
      serviceName: "Extension Cord (4.5 meters)",
      serviceType: "Extension Cord",
      inUse: false,
      isAdmin: false
    }
    const updatedServiceOutput = await selectServiceDB(updatedServiceFilter);
    if (updatedServiceOutput.serviceRaws !== null){
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
    }
    const wrongServiceNumber: number = 300004;

    const updatedServiceInstance: ServiceDBObj = {
      service_id: wrongServiceNumber,
      service_type_id: 3, // service type number of extension cord
      service_name: "Extension Cord (4.5 meters)",
      service_type: "Extension Cord",
      in_use: false
    };

    await expect(updateServiceDB(updatedServiceInstance)).resolves.toStrictEqual(expectedState);
  });

});