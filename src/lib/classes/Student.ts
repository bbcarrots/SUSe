import {
	insertStudentDB,
	selectStudentDB,
	updateStudentDB,
	// deleteStudentDB,
	// approveStudentDB
} from '$lib/server/supabase';

export type StudentDBObj = {
	sn_id: number;
	rfid: string;
	username: string;
	pw: string;
	first_name: string;
	middle_initial: string;
	last_name: string;
	college: string;
	program: string;
	phone_number: string;
	is_enrolled: boolean;
};

export type StudentUIObj = {
    firstName: string,
    middleInitial: string,
    lastName: string,
    studentNumber: number,
    email: string,
    phoneNumber: string,
    college: string,
    program: string,
    isEnrolled: boolean
}

export type StudentResponse = {
	success: boolean;
	studentRaws: StudentDBObj[] | null;
	error: string | null;
};

export type StudentFilter = {
	minStudentNumber: number;
	maxStudentNumber: number;
	username: string;
};

export class Student {
	/* Contains all student methods. */

	public static toStudentUIObj(student: StudentDBObj): StudentUIObj {
		/* Converts a StudentDBObj to a StudentUIObj. */
		return {
			firstName: student.first_name,
            middleInitial: student.middle_initial,
            lastName: student.last_name,
            studentNumber: student.sn_id,
            email: student.username,
            phoneNumber: student.phone_number,
            college: student.college,
            program: student.program,
            isEnrolled: student.is_enrolled
		};
	}

	public static async selectStudents(
		filter: StudentFilter = {
			minStudentNumber: 2000,
			maxStudentNumber: new Date().getFullYear(), // gets current year
			username: ''
		}
	): Promise<StudentResponse> {
		/* Selects all student records in database using the default or given filter. */
		return selectStudentDB(filter);
	}

	public static async insertStudent(student: StudentDBObj): Promise<StudentResponse> {
		/* Inserts unique student information in database. */
		return insertStudentDB(student);
	}

	public static async updateStudent(student: StudentDBObj): Promise<StudentResponse> {
		/* Updates the student record matching this Student's student number and username. */
		return updateStudentDB(student);
	}

	// public async deleteStudent(): Promise<StudentResponse> {
	// 	/* Deletes the student record matching this Student's student number and username. */
	// 	return deleteStudentDB(this);
	// }

	// public async approveStudent(): Promise<StudentResponse> {
	// 	/* Approves the student record matching this Student's student number and username. */
	// 	return approveStudentDB(this);
	// }

	// TO BE IMPLEMENTED:
	// filterStudents()
}
