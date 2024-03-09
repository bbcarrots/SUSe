import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import { Student, type StudentResponse } from '$lib/classes/Student';

export const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_ANON_KEY);

export async function selectStudentDB(
	studentNumber: number = 0,
	username: string = ''
): Promise<StudentResponse> {
	/* Selects the student record/s from the database given their student number and username. */
	let orFilter: string = ``;

	const selectQuery = supabase.from('student').select('*');

	if (studentNumber) {
		orFilter += `sn_id.eq.${studentNumber}`;
	}
	if (username) {
		if (orFilter.length) {
			orFilter += `, `;
		}

		orFilter += `username.eq.${username}`;
	}

	if (orFilter) {
		selectQuery.or(orFilter);
	}

	const { data, error } = await selectQuery;

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

// export async function updateStudentDB(
// 	student: Student,
// 	oldSN: number,
// 	oldUsername: string
// ): Promise<DBState>
