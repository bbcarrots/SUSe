import { createClient } from '@supabase/supabase-js';
// import { env } from '$env/dynamic/public';
import { Student, type StudentFilter, type StudentResponse } from '$lib/classes/Student';

// creates the connection to SUSe supabase
export const supabase = createClient(
	'https://yfhwfzwacdlqmyunladz.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaHdmendhY2RscW15dW5sYWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MDIyNjEsImV4cCI6MjAyNTQ3ODI2MX0.gzr5edDIVJXS1YYsQSyuZhc3oHGQYuVDtVfH4_2d30A'
);

export async function selectStudentDB(filter: StudentFilter): Promise<StudentResponse> {
	/* Selects the student record/s from the database using a filter
    Filter only contains option for student number and username for now. */

	const { data, error } = await supabase
		.from('student')
		.select('*')
		.gte('sn_id', filter.minStudentNumber * 100000) // student number should be between an inclusive range
		.lte('sn_id', (filter.maxStudentNumber + 1) * 100000)
		.like('username', '%' + filter.username + '%'); // username can be found in any position

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

export async function insertStudentDB(student: Student): Promise<StudentResponse> {
	/* Inserts a student record into the database. */
	const { error } = await supabase.from('student').insert(student.toStudentDBObj());

	if (error) {
		return {
			success: false,
			studentRaws: null,
			error: error.message
		};
	}

	return {
		success: true,
		studentRaws: null,
		error: null
	};
}

export async function updateStudentDB(student: Student): Promise<StudentResponse> {
	/* Updates a student record based using their student number and username.
    NOTE: Cannot update the student number or username of a student. Need to delete and register again. */
	const { error } = await supabase
		.from('student')
		.update({
			first_name: student.firstName,
			middle_initial: student.middleInitial,
			last_name: student.lastName,
			college: student.college,
			program: student.program,
			phone_number: student.phoneNumber
		})
		.eq('sn_id', student.studentNumber)
		.eq('username', student.username);

	if (error) {
		return {
			success: false,
			studentRaws: null,
			error: error.message
		};
	}

	return {
		success: true,
		studentRaws: null,
		error: null
	};
}

export async function deleteStudentDB(student: Student): Promise<StudentResponse> {
	/* Updates a student record based using their student number and username.
    NOTE: Cannot update the student number or username of a student. Need to delete and register again. */
	const { error } = await supabase
		.from('student')
		.delete()
		.eq('sn_id', student.studentNumber)
		.eq('username', student.username);

	if (error) {
		return {
			success: false,
			studentRaws: null,
			error: error.message
		};
	}

	return {
		success: true,
		studentRaws: null,
		error: null
	};
}

export async function approveStudentDB(student: Student): Promise<StudentResponse> {
	/* Updates a student record based using their student number and username.
    NOTE: Cannot update the student number or username of a student. Need to delete and register again. */
	const { error } = await supabase
		.from('student')
		.update({ is_enrolled: true })
		.eq('sn_id', student.studentNumber)
		.eq('username', student.username);

	if (error) {
		return {
			success: false,
			studentRaws: null,
			error: error.message
		};
	}

	return {
		success: true,
		studentRaws: null,
		error: null
	};
}
