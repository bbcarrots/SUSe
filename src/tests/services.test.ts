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


describe('deleteServiceDB()', () => {
  const newServiceNumber = 100004;
  const newServiceName = "Lenovo Ideapad Slim 3";
  
  const serviceInstance: ServiceDBObj = {
    service_id: newServiceNumber,
    service_type_id: 5, // service type number of laptop
    service_name: newServiceName,
    service_type: "Laptop",
    in_use: false
  };

  beforeEach(async () => {
    await insertServiceDB(serviceInstance); // insert serviceInstance first
  });

  it('success: deleted student in database', async () => {
    // returned ServiceResponse upon successful deletion from database
    const expectedState: ServiceResponse = {
      success: true,
      serviceRaws: null,
      availableServices: null,
      error: null
    }
    await expect(deleteServiceDB(newServiceNumber)).resolves.toStrictEqual(expectedState);
  });

  it('error: deleting nonexistent student in database', async () => {
    // returned ServiceResponse upon failed deletion from database
    const expectedState: ServiceResponse = {
      success: false,
      serviceRaws: null,
      availableServices: null,
      error: "Error: Service does not exist"
    }

    await expect(deleteServiceDB(900000000)).resolves.toStrictEqual(expectedState);
  });

});

describe('selectServiceDB', () => {
  const newServiceNumber = 100004;
  const newServiceName = "Acer Nitro 5 AN515-58-50YE";

  let serviceInstanceList: ServiceDBObj[] = [];

  beforeEach(async () => {
    // insert dummy service instances first
    for(let offset = 0; offset < 5; offset++){

      const serviceInstance: ServiceDBObj = {
        service_id: newServiceNumber + offset,
        service_type_id: 5, // service type number of laptop
        service_name: newServiceName + offset.toString(),
        service_type: "Laptop",
        in_use: offset % 2 == 0 ? false : true // odd laptops are in use
      };

      serviceInstanceList.push(serviceInstance);
      await insertServiceDB(serviceInstance);
    }

    const glassesInstance: ServiceDBObj = {
      service_id: 100020,
      service_type_id: 4, // service type number of reading glasses
      service_name: "Ray-Ban RB3183 (Black)",
      service_type: "Reading Glasses",
      in_use: false
    };
    serviceInstanceList.push(glassesInstance);
    await insertServiceDB(glassesInstance);

  });

  afterEach(async () => {
    // clean up dummy entries
    for(var service of serviceInstanceList){
      await deleteServiceDB(service.service_id);
    }
  });

  it('success: selected single service in database', async () => {
    const oneServiceFilter: ServiceFilter = {
      serviceID: 100007,
      serviceName: "ACER Predator Helios 16 PH16-71-72VB GeForce RTX™ 4060 Intel® Core™ i7 Laptop (Abyssal Black)",
      serviceType: "Laptop",
      inUse: false,
      isAdmin: false
    }
    const selectOutput = await selectServiceDB(oneServiceFilter);

    if(selectOutput.serviceRaws !== null){
      const selectOutputServiceNumber = selectOutput.serviceRaws[0].service_id; // extract service number from selected service record
      // compare selected student number with inserted student number
      expect(selectOutputServiceNumber).toStrictEqual(serviceInstanceList[0].service_id);
    }
  });

  it('success: entries within a certain service type, admin', async () => {
    // insert multiple student entries first

    const multipleStudentFilter: ServiceFilter = {
      serviceID: 0,
      serviceName: "",
      serviceType: "Laptop",
      inUse: false,
      isAdmin: true // so services even in use are shown
    }

    const selectOutput = await selectServiceDB(multipleStudentFilter);
    if(selectOutput.serviceRaws !== null){
      const selectedOutputServiceNumbers = selectOutput.serviceRaws.map(service => service.service_id); // extract service number from selected service records
      const expectedServiceNumbers = [100004, 100005, 100006, 100007, 100008]; // all laptops, not including glasses

      // compare selected student number with inserted student number
      expect(selectedOutputServiceNumbers).toEqual(expectedServiceNumbers); 
    }

  });

  it('success: entries within a certain service type, student (only inUse == false)', async () => {
    // insert multiple student entries first

    const multipleStudentFilter: ServiceFilter = {
      serviceID: 0,
      serviceName: "",
      serviceType: "Laptop",
      inUse: false,
      isAdmin: false // so only services not in use are shown
    }

    const selectOutput = await selectServiceDB(multipleStudentFilter);
    if(selectOutput.serviceRaws !== null){
      const selectedOutputServiceNumbers = selectOutput.serviceRaws.map(service => service.service_id); // extract service number from selected service records
      const expectedServiceNumbers = [100004, 100006, 100008]; // all laptops, not including glasses

      // compare selected student number with inserted student number
      expect(selectedOutputServiceNumbers).toEqual(expectedServiceNumbers); 
    }

  });

  it.todo('success: selected single student in database using rfid', async () => {
    const oneStudentFilter: StudentFilter = {
      minStudentNumber: 0,
      maxStudentNumber: 0,
      username: "",
      rfid: newRFID
    }
    const selectOutput = await selectStudentDB(oneStudentFilter);

    if(selectOutput.studentRaws !== null){
      const selectOutputSN = selectOutput.studentRaws[0].sn_id; // extract student number from selected student record
      // compare selected student number with inserted student number
      expect(selectOutputSN).toStrictEqual(studentInstanceList[0].sn_id);
    }
  });

  it.todo('error: selecting single nonexistent student record', async () => {
    const nonexistentStudentFilter: StudentFilter = {
      minStudentNumber: 200000000,
      maxStudentNumber: 200000000,
      username: "dummyfiltertest",
      rfid: 90210,
    }

    const selectOutput = await selectStudentDB(nonexistentStudentFilter);
    const selectOutputArray = selectOutput.studentRaws;

    const expectedArray: StudentDBObj[] = []; // studentRaws array filed should be empty since record does not exist

    expect(selectOutputArray).toStrictEqual(expectedArray);
  });

});