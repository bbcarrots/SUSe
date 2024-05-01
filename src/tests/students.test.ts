import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// students
import { type StudentDBObj, type StudentFilter, type StudentResponse } from '$lib/classes/Student';
import {
	insertStudentDB,
	deleteStudentDB,
	updateStudentDB,
	selectStudentDB
} from '$lib/server/StudentSB';

describe('sanity/integrity test: it should add 2 and 3 properly', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});

describe('insertStudentDB()', () => {
	const newStudentNumber = 202100001;
	const newUsername = 'dummyinsert';
	const studentInstance: StudentDBObj = {
		sn_id: newStudentNumber,
		rfid: 1000,
		username: newUsername,
		pw: 'Password1234',
		first_name: 'Dummy',
		middle_initial: 'D',
		last_name: 'Dumdum',
		college: 'College of Dummy',
		program: 'BS Dummy',
		phone_number: '09123456789',
		is_enrolled: false,
		is_active: false
	};

	it('success: inserted student in database', async () => {
		// returned StudentResponse upon successful insert into database
		const expectedState: StudentResponse = {
			success: true,
			studentRaws: null,
			error: null
		};
		await expect(insertStudentDB(studentInstance)).resolves.toStrictEqual(expectedState);
		await deleteStudentDB(202100001); // clean up dummy entry
	});
});

describe('fail: Student.insertStudent with same SN or same username', () => {
	// create dummy studentInstance for insertion
	const newStudentNumber = 202100002;
	const newUsername = 'dummyfailinsert';
	const studentInstance: StudentDBObj = {
		sn_id: newStudentNumber,
		rfid: 1001,
		username: newUsername,
		pw: 'Password1234',
		first_name: 'Dummy',
		middle_initial: 'D',
		last_name: 'Dumdum',
		college: 'College of Dummy',
		program: 'BS Dummy',
		phone_number: '09123456789',
		is_enrolled: false,
		is_active: false
	};

	beforeEach(async () => {
		await insertStudentDB(studentInstance); // insert studentInstance first
	});

	afterEach(async () => {
		await deleteStudentDB(newStudentNumber); // clean up studentInstance
	});

	it('error: inserting with student number already in use', async () => {
		// returned StudentResponse upon failed insert with existing sn_id
		const expectedState: StudentResponse = {
			success: false,
			studentRaws: null,
			error: 'duplicate key value violates unique constraint "student_sn_id_key"' // error message from supabase with existing SN
		};

		// create 2nd dummy studentSameSN with same SN

		const studentSameSN: StudentDBObj = {
			sn_id: newStudentNumber,
			rfid: 1002,
			username: 'dummy',
			pw: '1234Password',
			first_name: 'DummyJr',
			middle_initial: 'D',
			last_name: 'Dumdum',
			college: 'College of Not Dumm',
			program: 'BS Not Dummy',
			phone_number: '09123456789',
			is_enrolled: false,
			is_active: false
		};

		// insert studentSameSN, should error
		await expect(insertStudentDB(studentSameSN)).resolves.toStrictEqual(expectedState);
	});

	it('error: inserting with username already in use', async () => {
		// returned StudentResponse upon failed insert with existing username
		const expectedState: StudentResponse = {
			success: false,
			studentRaws: null,
			error: 'duplicate key value violates unique constraint "student_username_key"' // error message from supabase with existing username
		};

		// create 2nd dummy studentSameUsername with same username
		const studentSameUsername: StudentDBObj = {
			sn_id: 202101013,
			rfid: 1003,
			username: newUsername,
			pw: '1234Password',
			first_name: 'DummyJr',
			middle_initial: 'D',
			last_name: 'Dumdum',
			college: 'College of Not Dumm',
			program: 'BS Not Dummy',
			phone_number: '09123456789',
			is_enrolled: false,
			is_active: false
		};

		// insert studentSameUsername, should error
		await expect(insertStudentDB(studentSameUsername)).resolves.toStrictEqual(expectedState);
	});
});

describe('updateStudentDB()', () => {
	const newStudentNumber = 202100004;
	const newUsername = 'dummyupdate';
	const studentInstance: StudentDBObj = {
		sn_id: newStudentNumber,
		rfid: 1004,
		username: newUsername,
		pw: 'Password1234',
		first_name: 'Dummy',
		middle_initial: 'D',
		last_name: 'Dumdum',
		college: 'College of Dummy',
		program: 'BS Dummy',
		phone_number: '09123456789',
		is_enrolled: false,
		is_active: false
	};

	beforeEach(async () => {
		await insertStudentDB(studentInstance); // insert studentInstance first
	});

	afterEach(async () => {
		await deleteStudentDB(newStudentNumber); // clean up studentInstance
	});

	it('success: inserted student correctly updated in database', async () => {
		// instance that updates password, first name, MI, last name, college, program, and phone number

		const updatedStudentInstance: StudentDBObj = {
			sn_id: newStudentNumber,
			rfid: 1004,
			username: newUsername,
			pw: 'Password1234',
			first_name: 'Stephen',
			middle_initial: 'A',
			last_name: 'Smith',
			college: 'College of Mass Communication',
			program: 'BA Broadcast Communication',
			phone_number: '09876543210',
			is_enrolled: false,
			is_active: false
		};

		// update the student
		await updateStudentDB(updatedStudentInstance);

		// select the updated student for crosschecking
		const updatedStudentFilter: StudentFilter = {
			minStudentNumber: newStudentNumber,
			maxStudentNumber: newStudentNumber,
			username: newUsername,
			rfid: 1004
		};
		const updatedStudentOutput = await selectStudentDB(updatedStudentFilter);
		if (updatedStudentOutput.studentRaws !== null) {
			// selected student from DB should be same with our updatedStudentInstance
			expect(updatedStudentOutput.studentRaws[0]).toStrictEqual(updatedStudentInstance);
		}
	});

	it('error: updating with wrong SN', async () => {
		// returned StudentResponse upon successful insert into database
		const expectedState: StudentResponse = {
			success: false,
			studentRaws: null,
			error: 'Error: Student does not exist'
		};
		const wrongSN: number = 202133333;

		const updatedStudentInstance: StudentDBObj = {
			sn_id: wrongSN,
			rfid: 1006,
			username: newUsername,
			pw: 'Password1234',
			first_name: 'Stephen',
			middle_initial: '',
			last_name: 'Curry',
			college: 'College of Social Sciences and Philosophy',
			program: 'BA Sociology',
			phone_number: '09876543210',
			is_enrolled: false,
			is_active: false
		};

		await expect(updateStudentDB(updatedStudentInstance)).resolves.toStrictEqual(expectedState);
	});
});

describe('deleteStudentDB()', () => {
	const newStudentNumber = 202101012;
	const newUsername = 'dummy11';

	const studentInstance: StudentDBObj = {
		sn_id: newStudentNumber,
		rfid: 1008,
		username: newUsername,
		pw: 'Password1234',
		first_name: 'Dummy',
		middle_initial: 'D',
		last_name: 'Dumdum',
		college: 'College of Dummy',
		program: 'BS Dummy',
		phone_number: '09123456789',
		is_enrolled: false,
		is_active: false
	};

	beforeEach(async () => {
		await insertStudentDB(studentInstance); // insert studentInstance first
	});

	afterEach(async () => {
		await deleteStudentDB(newStudentNumber); // clean up studentInstance
	});

	it('success: deleted student in database', async () => {
		// returned StudentResponse upon successful deletion from database
		const expectedState: StudentResponse = {
			success: true,
			studentRaws: null,
			error: null
		};
		await expect(deleteStudentDB(newStudentNumber)).resolves.toStrictEqual(expectedState);
	});

	it('error: deleting nonexistent student in database', async () => {
		// returned StudentResponse upon failed deletion from database
		const expectedState: StudentResponse = {
			success: false,
			studentRaws: null,
			error: 'Error: Student does not exist'
		};

		await expect(deleteStudentDB(900000000)).resolves.toStrictEqual(expectedState);
	});
});

describe('selectStudentDB', () => {
	const newStudentNumber = 203099998;
	const newRFID = 1009;
	const newUsername = 'dummyfiltertest';

	const studentInstanceList: StudentDBObj[] = [];

	beforeEach(async () => {
		// insert dummmy studentInstances first
		for (let offset = 0; offset < 5; offset++) {
			const dummyStudent: StudentDBObj = {
				sn_id: newStudentNumber + offset,
				rfid: newRFID + offset,
				username: newUsername + offset.toString(),
				pw: 'Password1234',
				first_name: 'Dummy',
				middle_initial: 'D',
				last_name: 'Dumdum',
				college: 'College of Dummy',
				program: 'BS Dummy',
				phone_number: '09123456789',
				is_enrolled: false,
				is_active: false
			};

			studentInstanceList.push(dummyStudent);
			await insertStudentDB(dummyStudent);
		}
	});

	afterEach(async () => {
		// clean up dummy entries
		for (const student of studentInstanceList) {
			await deleteStudentDB(student.sn_id);
		}
	});

	it('success: selected single student in database', async () => {
		const oneStudentFilter: StudentFilter = {
			minStudentNumber: newStudentNumber,
			maxStudentNumber: newStudentNumber,
			username: newUsername,
			rfid: newRFID
		};
		const selectOutput = await selectStudentDB(oneStudentFilter);

		if (selectOutput.studentRaws !== null) {
			const selectOutputSN = selectOutput.studentRaws[0].sn_id; // extract student number from selected student record
			// compare selected student number with inserted student number
			expect(selectOutputSN).toStrictEqual(studentInstanceList[0].sn_id);
		}
	});

	it('success: entries within valid year range', async () => {
		// insert multiple student entries first

		const multipleStudentFilter: StudentFilter = {
			minStudentNumber: 2030,
			maxStudentNumber: 2030,
			username: '',
			rfid: 0
		};
		const selectOutput = await selectStudentDB(multipleStudentFilter);
		if (selectOutput.studentRaws !== null) {
			const selectedOutputSN = selectOutput.studentRaws.map((student) => student.sn_id); // extract student number from selected student record
			const expectedStudentNumbers = [203099998, 203099999];

			// compare selected student number with inserted student number
			expect(selectedOutputSN.sort()).toEqual(expectedStudentNumbers.sort());
		}
	});

	it('success: selected single student in database using rfid', async () => {
		const oneStudentFilter: StudentFilter = {
			minStudentNumber: 0,
			maxStudentNumber: 0,
			username: '',
			rfid: newRFID
		};
		const selectOutput = await selectStudentDB(oneStudentFilter);

		if (selectOutput.studentRaws !== null) {
			const selectOutputSN = selectOutput.studentRaws[0].sn_id; // extract student number from selected student record
			// compare selected student number with inserted student number
			expect(selectOutputSN).toStrictEqual(studentInstanceList[0].sn_id);
		}
	});

	it('error: selecting single nonexistent student record', async () => {
		const nonexistentStudentFilter: StudentFilter = {
			minStudentNumber: 200000000,
			maxStudentNumber: 200000000,
			username: 'dummyfiltertest',
			rfid: 90210
		};

		const selectOutput = await selectStudentDB(nonexistentStudentFilter);
		const selectOutputArray = selectOutput.studentRaws;

		const expectedArray: StudentDBObj[] = []; // studentRaws array filed should be empty since record does not exist

		expect(selectOutputArray).toStrictEqual(expectedArray);
	});
});

describe('error: Student.selectStudentDB wrong input', () => {
	it('error: invalid four-digit year inputs', () => {
		const invalidFourDigitFilter: StudentFilter = {
			minStudentNumber: 1945,
			maxStudentNumber: 1989,
			username: 'dummyfiltertest',
			rfid: 0
		};

		const expectedError: StudentResponse = {
			success: false,
			studentRaws: null,
			error: 'Error: Student number range invalid'
		};

		expect(selectStudentDB(invalidFourDigitFilter)).resolves.toStrictEqual(expectedError);
	});

	it('error: invalid nine-digit SN inputs', () => {
		const invalidFourDigitFilter: StudentFilter = {
			minStudentNumber: 194512345,
			maxStudentNumber: 198954321,
			username: 'dummyfiltertest',
			rfid: 90210
		};

		const expectedError: StudentResponse = {
			success: false,
			studentRaws: null,
			error: 'Error: Student number range invalid'
		};

		expect(selectStudentDB(invalidFourDigitFilter)).resolves.toStrictEqual(expectedError);
	});
});
