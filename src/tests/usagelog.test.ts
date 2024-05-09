import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { type UsageLogDBObj, type UsageLogFilter, type UsageLogResponse } from '$lib/classes/UsageLog';
import { insertUsageLogDB, deleteUsageLogDB,	updateUsageLogDB,	selectUsageLogDB} from '$lib/server/UsageLogSB';
import { type StudentDBObj } from '$lib/classes/Student';
import { deleteStudentDB, insertStudentDB } from '$lib/server/StudentSB';
import { type ServiceDBObj } from '$lib/classes/Service';
import { deleteServiceDB, insertServiceDB } from '$lib/server/ServiceSB';
import { type AdminDBObj } from '$lib/classes/Admin';
import { deleteAdminDB, insertAdminDB } from '$lib/server/AdminSB';

describe('sanity/integrity test: it should add properly', () => {
	it('adds 8 + 5 to equal 13', () => {
		expect(8 + 5).toBe(13);
	});
});

describe('insertUsageLogDB()', async () => {
	const newULID = 1020304;
	const newSN = 205100001;
	const newAdminID = 212300001;
	const newServiceID = 40001;

  const studentInstance: StudentDBObj = {
    sn_id: newSN,
    rfid: 90001,
    username: 'klamar',
    pw: 'mrmorale',
    first_name: 'Kendrick',
    middle_initial: '',
    last_name: 'Lamar',
    college: 'College of Social Sciences and Philosophy',
    program: 'BS Psychology',
    phone_number: '09123456789',
    is_enrolled: true,
    is_active: true
  };

  const serviceInstance: ServiceDBObj = {
    service_id: newServiceID,
    service_type_id: 5,
    service_name: 'Gaming PC',
    service_type: 'Laptop',
    in_use: false
  };

  const adminInstance: AdminDBObj = {
    admin_id: newAdminID,
    rfid: 80001,
    pw: 'password',
    nickname: 'Tupac',
    is_active: false
  };

  const usageLogInstance: UsageLogDBObj = {
    ul_id: newULID,
    sn_id: newSN,
    admin_id: newAdminID,
    service_id: newServiceID,
    service_type: 'Laptop',
    datetime_start: '2027-04-05 11:06:00+00',
    datetime_end: '2027-04-05 11:06:59+00'
  };

	beforeEach(async () => {
		// student
		await insertStudentDB(studentInstance);

		// service
		await insertServiceDB(serviceInstance);

		// admin
		await insertAdminDB(adminInstance);
	});

	afterEach(async () => {
		await deleteServiceDB(newServiceID);
		await deleteStudentDB(newSN);
		await deleteAdminDB(newAdminID);
	});

	it('success: inserted usage log in database', async () => {
		// returned UsageLogResponse upon successful insert into database
		const expectedState: UsageLogResponse = {
			success: true,
			usageLogRaws: null,
			error: null
		};

		await expect(insertUsageLogDB(usageLogInstance)).resolves.toStrictEqual(expectedState);
		await deleteUsageLogDB(newULID); // clean up dummy entry
	});

  it('error: inserting with usage log ID already in use', async () => {
    // insert first UL
    await insertUsageLogDB(usageLogInstance);

    // returned UsageLogResponse upon failed insert with existing ULID
    const expectedState: UsageLogResponse = {
      success: false,
      usageLogRaws: null,
      error: "duplicate key value violates unique constraint \"usage_log_ul_id_key\"" // error message from supabase with existing ULID
    }

    // create 2nd dummy usage log with same ULID
    const sameULID: UsageLogDBObj = {
      ul_id: newULID,
      sn_id: newSN,
      admin_id: newAdminID,
      service_id: newServiceID,
      service_type: 'Laptop',
      datetime_start: '2027-04-06 11:06:00+00',
      datetime_end: '2027-04-06 11:06:59+00'
    };

    // insert sameULID, should error
    await expect(insertUsageLogDB(sameULID)).resolves.toStrictEqual(expectedState)

    await deleteUsageLogDB(newULID);
  });
});

// describe.skip('updateUsageLogDB()', async () => {
// 	const newULID = 1020305;
// 	const newSN = 205100001;
// 	const newAdminID = 212300001;
// 	const newServiceID = 40001;

//   const studentInstance: StudentDBObj = {
//     sn_id: newSN,
//     rfid: 90001,
//     username: 'klamar',
//     pw: 'mrmorale',
//     first_name: 'Kendrick',
//     middle_initial: '',
//     last_name: 'Lamar',
//     college: 'College of Social Sciences and Philosophy',
//     program: 'BS Psychology',
//     phone_number: '09123456789',
//     is_enrolled: true,
//     is_active: true
//   };

//   const serviceInstance: ServiceDBObj = {
//     service_id: newServiceID,
//     service_type_id: 5,
//     service_name: 'Gaming PC',
//     service_type: 'Laptop',
//     in_use: false
//   };

//   const adminInstance: AdminDBObj = {
//     admin_id: newAdminID,
//     rfid: 80001,
//     pw: 'password',
//     nickname: 'Tupac',
//     is_active: false
//   };

//   const usageLogInstance: UsageLogDBObj = {
//     ul_id: newULID,
//     sn_id: newSN,
//     admin_id: newAdminID,
//     service_id: newServiceID,
//     service_type: 'Laptop',
//     datetime_start: '2027-04-05 11:06:00+00',
//     datetime_end: '2027-04-05 11:06:59+00'
//   };

// 	beforeEach(async () => {
// 		// student
// 		await insertStudentDB(studentInstance);
// 		await insertServiceDB(serviceInstance);
// 		await insertAdminDB(adminInstance);
//     await insertUsageLogDB(usageLogInstance);
// 	});

// 	afterEach(async () => {
// 		await deleteServiceDB(newServiceID);
// 		await deleteStudentDB(newSN);
// 		await deleteAdminDB(newAdminID);
//     await deleteUsageLogDB(newULID);
// 	});

// 	it('success: updated usage log in database', async () => {
// 		// returned UsageLogResponse upon successful insert into database
// 		const expectedState: UsageLogResponse = {
// 			success: true,
// 			usageLogRaws: null,
// 			error: null
// 		};

//     const updatedUsageLog: UsageLogDBObj = {
//       ul_id: newULID,
//       sn_id: newSN,
//       admin_id: newAdminID,
//       service_id: newServiceID,
//       service_type: 'Laptop',
//       datetime_start: '2027-04-05 11:07:00+00',
//       datetime_end: '2027-04-05 11:07:59+00'
//     };

// 		await expect(updateUsageLogDB(updatedUsageLog)).resolves.toStrictEqual(expectedState);
// 	});

//   it('error: updating with nonexistent ULID', async () => {
//     // insert first UL
//     await insertUsageLogDB(usageLogInstance);

//     // returned UsageLogResponse upon failed insert with existing ulid
//     const expectedState: UsageLogResponse = {
//       success: false,
//       usageLogRaws: null,
//       error: "Error: Usage log does not exist" // error message from supabase with existing ULID
//     }

//     // create 2nd dummy usage log with same ULID
//     const sameULID: UsageLogDBObj = {
//       ul_id: newULID + 1,
//       sn_id: newSN,
//       admin_id: newAdminID,
//       service_id: newServiceID,
//       service_type: 'Laptop',
//       datetime_start: '2027-04-06 11:06:00+00',
//       datetime_end: '2027-04-06 11:06:59+00'
//     };

//     // insert sameULID, should error
//     await expect(updateUsageLogDB(sameULID)).resolves.toStrictEqual(expectedState)
//   });
// });

describe('deleteUsageLogDB()', async () => {
	const newULID = 1020306;
	const newSN = 205100001;
	const newAdminID = 212300001;
	const newServiceID = 40001;

  const studentInstance: StudentDBObj = {
    sn_id: newSN,
    rfid: 90001,
    username: 'klamar',
    pw: 'mrmorale',
    first_name: 'Kendrick',
    middle_initial: '',
    last_name: 'Lamar',
    college: 'College of Social Sciences and Philosophy',
    program: 'BS Psychology',
    phone_number: '09123456789',
    is_enrolled: true,
    is_active: true
  };

  const serviceInstance: ServiceDBObj = {
    service_id: newServiceID,
    service_type_id: 5,
    service_name: 'Gaming PC',
    service_type: 'Laptop',
    in_use: false
  };

  const adminInstance: AdminDBObj = {
    admin_id: newAdminID,
    rfid: 80001,
    pw: 'password',
    nickname: 'Tupac',
    is_active: false
  };

  const usageLogInstance: UsageLogDBObj = {
    ul_id: newULID,
    sn_id: newSN,
    admin_id: newAdminID,
    service_id: newServiceID,
    service_type: 'Laptop',
    datetime_start: '2027-04-05 11:06:00+00',
    datetime_end: '2027-04-05 11:06:59+00'
  };

	beforeEach(async () => {
		// student
		await insertStudentDB(studentInstance);
		await insertServiceDB(serviceInstance);
		await insertAdminDB(adminInstance);
    await insertUsageLogDB(usageLogInstance);
	});

	afterEach(async () => {
		await deleteServiceDB(newServiceID);
		await deleteStudentDB(newSN);
		await deleteAdminDB(newAdminID);
	});

	it('success: deleted usage log', async () => {
		// returned UsageLogResponse upon successful insert into database
		const expectedState: UsageLogResponse = {
			success: true,
			usageLogRaws: null,
			error: null
		};

		await expect(deleteUsageLogDB(newULID)).resolves.toStrictEqual(expectedState);
	});

  it('error: deleting with nonexistent ULID', async () => {
    // returned UsageLogResponse upon failed delete
    const expectedState: UsageLogResponse = {
      success: false,
      usageLogRaws: null,
      error: "Error: Usage log does not exist" // error message from supabase with existing ULID
    }

    // insert studentSameSN, should error
    await expect(deleteUsageLogDB(newULID + 1)).resolves.toStrictEqual(expectedState);
    await deleteUsageLogDB(newULID);
  });
});

// describe('selectUsageLogDB()', async () => {
// 	const newULID = 1020306;
// 	const newSN = 205100001;
// 	const newAdminID = 212300001;
// 	const newServiceID = 40001;

//   const studentInstance: StudentDBObj = {
//     sn_id: newSN,
//     rfid: 90001,
//     username: 'klamar',
//     pw: 'mrmorale',
//     first_name: 'Kendrick',
//     middle_initial: '',
//     last_name: 'Lamar',
//     college: 'College of Social Sciences and Philosophy',
//     program: 'BS Psychology',
//     phone_number: '09123456789',
//     is_enrolled: true,
//     is_active: true
//   };

//   const serviceInstance: ServiceDBObj = {
//     service_id: newServiceID,
//     service_type_id: 5,
//     service_name: 'Gaming PC',
//     service_type: 'Laptop',
//     in_use: false
//   };

//   const adminInstance: AdminDBObj = {
//     admin_id: newAdminID,
//     rfid: 80001,
//     pw: 'password',
//     nickname: 'Tupac',
//     is_active: false
//   };

//   const usageLogList: UsageLogDBObj[] = [];

// 	beforeEach(async () => {
// 		// student
// 		await insertStudentDB(studentInstance);
// 		await insertServiceDB(serviceInstance);
// 		await insertAdminDB(adminInstance);

//     for (let offset = 0; offset < 3; offset++) {
//       const usageLogInstance: UsageLogDBObj = {
//         ul_id: newULID + offset,
//         sn_id: newSN,
//         admin_id: newAdminID,
//         service_id: newServiceID,
//         service_type: 'Laptop',
//         datetime_start: '2027-04-0' + (5 + offset).toString() + '11:06:00+00',
//         datetime_end: '2027-04-0' + (5 + offset).toString() + '11:06:59+00'
//       };

// 			usageLogList.push(usageLogInstance);
// 			await insertUsageLogDB(usageLogInstance);
// 		}
// 	});

// 	afterEach(async () => {
// 		await deleteServiceDB(newServiceID);
// 		await deleteStudentDB(newSN);
// 		await deleteAdminDB(newAdminID);
//     for (const usagelog in usageLogList) {
//       await deleteUsageLogDB(usagelog.ul_id)
//     }
// 	});

// 	it.skip('success: select single usage log', async () => {
// 		const oneUsageLogFilter: UsageLogFilter = {
//       usageLogID: newULID,
//       studentNumber: 0,
//       minDate: "",
//       maxDate: ""
// 		};
// 		const selectOutput = await selectUsageLogDB(oneUsageLogFilter);

// 		if (selectOutput.usageLogRaws !== null) {
//       console.log("selected usage log:", selectOutput.usageLogRaws);
// 			const selectOutputULID = selectOutput.usageLogRaws[0].ul_id; // extract ULID from selected UL
// 			// compare selected ULID with inserted ULID
// 			expect(selectOutputULID).toStrictEqual(newULID);
// 		}
// 	});

//   it.skip('success: multiple ULs with student number', async () => {
// 		const oneUsageLogFilter: UsageLogFilter = {
//       usageLogID: 0,
//       studentNumber: newSN,
//       minDate: "",
//       maxDate: ""
// 		};
// 		const selectOutput = await selectUsageLogDB(oneUsageLogFilter);

// 		if (selectOutput.usageLogRaws !== null) {
//       const expectedULIDs: number[] = [newULID, newULID + 1, newULID + 2];
// 			const selectOutputULIDs = selectOutput.usageLogRaws.map(usagelog => usagelog.ul_id);
			
// 			expect(selectOutputULIDs.sort()).toStrictEqual(expectedULIDs.sort());
// 		}
// 	});

//   it.skip('success: multiple ULs with mindate and maxdate', async () => {
// 		const oneUsageLogFilter: UsageLogFilter = {
//       usageLogID: 0,
//       studentNumber: newSN,
//       minDate: "2027-04-05 11:06:00+00",
//       maxDate: "2027-04-06 11:06:00+00" // only two ULs should be selected, excluding the last one inserted
// 		};

// 		const selectOutput = await selectUsageLogDB(oneUsageLogFilter);

// 		if (selectOutput.usageLogRaws !== null) {
//       const expectedULIDs: number[] = [newULID, newULID + 1];
// 			const selectOutputULIDs = selectOutput.usageLogRaws.map(usagelog => usagelog.ul_id);
			
// 			expect(selectOutputULIDs.sort()).toStrictEqual(expectedULIDs.sort());
// 		}
// 	});

//   it('error: select single nonexistent usage log', async () => {
// 		const oneUsageLogFilter: UsageLogFilter = {
//       usageLogID: newULID + 1,
//       studentNumber: 0,
//       minDate: "",
//       maxDate: ""
// 		};
//     const selectOutput = await selectUsageLogDB(oneUsageLogFilter);
//     const selectOutputArray = selectOutput.usageLogRaws;

//     const empty: UsageLogDBObj[] = [];

// 		if (selectOutput.usageLogRaws !== null) {
// 			expect(selectOutputArray).toStrictEqual(empty);
// 		}
// 	});
// });