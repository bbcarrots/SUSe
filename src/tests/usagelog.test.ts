import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// usage logs
import {
	type UsageLogDBObj,
	type UsageLogFilter,
	type UsageLogResponse
} from '$lib/classes/UsageLog';
import {
	insertUsageLogDB,
	deleteUsageLogDB,
	updateUsageLogDB,
	selectUsageLogDB
} from '$lib/server/UsageLogSB';
import type { StudentDBObj } from '$lib/classes/Student';
import { deleteStudentDB, insertStudentDB } from '$lib/server/StudentSB';
import type { ServiceDBObj } from '$lib/classes/Service';
import { deleteServiceDB, insertServiceDB } from '$lib/server/ServiceSB';
import type { AdminDBObj } from '$lib/classes/Admin';
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

	beforeEach(async () => {
		// student
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
		await insertStudentDB(studentInstance);

		// service
		const serviceInstance: ServiceDBObj = {
			service_id: newServiceID,
			service_type_id: 5,
			service_name: 'Gaming PC',
			service_type: 'Laptop',
			in_use: false
		};
		await insertServiceDB(serviceInstance);

		// admin
		const adminInstance: AdminDBObj = {
			admin_id: newAdminID,
			rfid: 80001,
			pw: 'password',
			nickname: 'Tupac',
			is_active: true
		};
		await insertAdminDB(adminInstance);
	});

	afterEach(async () => {
		await deleteServiceDB(newServiceID);
		await deleteStudentDB(newSN);
		await deleteAdminDB(newAdminID);
	});

	it.todo('success: inserted usage log in database', async () => {
		// usagelog
		const usageLogInstance: UsageLogDBObj = {
			ul_id: newULID,
			sn_id: newSN,
			admin_id: newAdminID,
			service_id: newServiceID,
			service_type: 'Laptop',
			datetime_start: '2027-04-05 11:06:00+00',
			datetime_end: '2027-04-05 11:06:59+00'
		};

		// returned UsageLogResponse upon successful insert into database
		const expectedState: UsageLogResponse = {
			success: true,
			usageLogRaws: null,
			error: null
		};
		await expect(insertUsageLogDB(usageLogInstance)).resolves.toStrictEqual(expectedState);
		await deleteUsageLogDB(newULID); // clean up dummy entry
	});
});

// describe.todo('fail: insertUsageLog with same ULID', () => {
//   // create dummy studentInstance for insertion
//   const newULID = 9;
//   const newSN = 205100001;
//   const newAdminID = 212300001;
//   const service_id = 100020;

//   const usageLogInstance: UsageLogDBObj = {
//     ul_id: newULID,
//     sn_id: newSN,
//     admin_id: newAdminID,
//     service_id: service_id,
//     service_type: "Laptop",
//     datetime_start: "2027-04-05 11:06:00+00",
//     datetime_end: "2027-04-05 11:06:59+00"
//   };

//   beforeEach(async () => {
//     await insertUsageLogDB(usageLogInstance); // insert studentInstance first
//   });

//   afterEach(async () => {
//     await deleteStudentDB(newStudentNumber); // clean up studentInstance
//   });

//   it('error: inserting with usage log ID already in use', async () => {
//     // returned StudentResponse upon failed insert with existing sn_id
//     const expectedState: StudentResponse = {
//       success: false,
//       studentRaws: null,
//       error: 'duplicate key value violates unique constraint "student_sn_id_key"' // error message from supabase with existing SN
//     }

//     // create 2nd dummy studentSameSN with same SN

//     const studentSameSN: StudentDBObj = {sn_id: newStudentNumber,
//       rfid: 1002,
//       username: "dummy",
//       pw: "1234Password",
//       first_name: "DummyJr",
//       middle_initial: "D",
//       last_name: "Dumdum",
//       college: "College of Not Dumm",
//       program: "BS Not Dummy",
//       phone_number: "09123456789",
//       is_enrolled: false
//     };

//     // insert studentSameSN, should error
//     await expect(insertStudentDB(studentSameSN)).resolves.toStrictEqual(expectedState)
//   });

// });
