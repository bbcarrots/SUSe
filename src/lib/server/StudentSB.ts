import { createClient } from '@supabase/supabase-js';
// import { env } from '$env/dynamic/public';
import { type StudentDBObj, type StudentResponse } from '$lib/classes/Student';
import { type StudentFilter } from '$lib/utils/types';

// creates the connection to SUSe supabase
export const supabase = createClient(
	'https://yfhwfzwacdlqmyunladz.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaHdmendhY2RscW15dW5sYWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MDIyNjEsImV4cCI6MjAyNTQ3ODI2MX0.gzr5edDIVJXS1YYsQSyuZhc3oHGQYuVDtVfH4_2d30A'
);

const success = {
	success: true,
	studentRaws: null,
	error: null
};

export async function selectStudentDB(filter: StudentFilter): Promise<StudentResponse> {
	/* Selects the student record/s from the database using a filter.
    Filter only contains option for student number and username for now. */
	let minSN: number = filter.minStudentNumber;
	let maxSN: number = filter.maxStudentNumber;

	// checks if the SN provided are years between 2000 and 9999
	if (
		Math.floor(minSN / 2000) >= 1 &&
		Math.floor(minSN / 2000) < 5 &&
		Math.floor(maxSN / 2000) >= 1 &&
		Math.floor(maxSN / 2000) < 5
	) {
		minSN = filter.minStudentNumber * 100000; // extends it to a 9-digit SN
		maxSN = (filter.maxStudentNumber + 1) * 100000 - 1; // max SN should be 1 below the year
	}

	// checks if the SN provided is a valid 9-digit
	if (
		Math.floor(minSN / 200000000) == 0 ||
		Math.floor(maxSN / 200000000) == 0 ||
		minSN > 999999999 ||
		maxSN > 999999999 ||
		minSN > maxSN
	) {
		// student numbers range have to be valid
		// minimum SN is 2000-00000 and max SN is 9999-99999
		return {
			success: false,
			studentRaws: null,
			error: 'Error: Student number range invalid'
		};
	}

	let query = supabase
		.from('student')
		.select('*')
		.gte('sn_id', minSN) // student number should be between an inclusive range
		.lte('sn_id', maxSN)

	if (filter.rfid) {
		query = query.eq('rfid', filter.rfid); // if there is a valid rfid (!= 0), add a filter
	}

    if (filter.username) {
        query = query.like('username', '%' + filter.username + '%'); // username can be found in any position
    }

    if (filter.college.length) {
        query = query.in('college', filter.college);
    }

    if (filter.program.length) {
        query = query.in('program', filter.program);
    }

    if (filter.isEnrolled != null) {
        query = query.eq('is_enrolled', filter.isEnrolled); // username can be found in any position
    }

    if (filter.isActive != null) {
        query = query.eq('is_active', filter.isActive); // username can be found in any position
    }

	const { data, error } = await query;

	if (error) {
		return {
			success: false,
			studentRaws: null,
			error: error.message
		};
	}

	return {
		success: true,
		studentRaws: data,
		error: null
	};
}

export async function insertStudentDB(student: StudentDBObj): Promise<StudentResponse> {
	/* Inserts a non-existing student record into the database. */
	const { error } = await supabase.from('student').insert(student);

	if (error) {
		return {
			success: false,
			studentRaws: null,
			error: error.message
		};
	}

	return success;
}

async function checkStudentExistsDB(filter: StudentFilter): Promise<StudentResponse> {
	/* Checks if there is a single existing record of a student with the given student number and username. */
	const studentDB = await selectStudentDB(filter);

	if (studentDB.success && studentDB.studentRaws?.length == 1) {
        if (studentDB.studentRaws[0].is_active) {
			return {
				success: true,
				studentRaws: null,
				error: 'Warning: Student is active.'
			};
		}

		return success;
	}

	return {
		success: false,
		studentRaws: null,
		error: 'Error: Student does not exist'
	};
}

export async function updateStudentDB(student: StudentDBObj): Promise<StudentResponse> {
	/* Updates a student record based using their student number and username.
    NOTE: Cannot update the student number or username of a student. Need to delete and register again. */
	const studentCheck = await checkStudentExistsDB({
		minStudentNumber: student.sn_id,
		maxStudentNumber: student.sn_id,
		username: '',
		rfid: 0,
        college: [],
        program: [],
        isEnrolled: null,
        isActive: null,
	});

	if (!studentCheck.success) {
		return studentCheck;
	}

	const updateObj: { [key: string]: string | boolean } = {};

	for (const [key, value] of Object.entries(student)) {
		// updates every property except for sn_id, rfid, username, and pw
		if (
			((value &&
			typeof value == 'string') || typeof value == 'boolean') &&
			key != 'sn_id' &&
			key != 'rfid' &&
			key != 'username'
		) {
			updateObj[key] = value;
		}
	}

	const { error } = await supabase.from('student').update(updateObj).eq('sn_id', student.sn_id);

	if (error) {
		return {
			success: false,
			studentRaws: null,
			error: error.message
		};
	}

	return success;
}

export async function deleteStudentDB(studentNumber: number): Promise<StudentResponse> {
	/* Deletes an existing student record. */
	const studentCheck = await checkStudentExistsDB({
		minStudentNumber: studentNumber,
		maxStudentNumber: studentNumber,
		username: '',
		rfid: 0,
        college: [],
        program: [],
        isEnrolled: null,
        isActive: null,
	});

	if (!studentCheck.success) {
		return studentCheck;
	} else if (studentCheck.error == 'Warning: Student is active.') {
        return {
			success: false,
			studentRaws: null,
			error: studentCheck.error
		};
    }

	const { error } = await supabase.from('student').delete().eq('sn_id', studentNumber);

	if (error) {
		return {
			success: false,
			studentRaws: null,
			error: error.message
		};
	}

	return success;
}
