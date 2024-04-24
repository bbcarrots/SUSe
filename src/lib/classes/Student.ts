import {
	insertStudentDB,
	selectStudentDB,
	updateStudentDB,
	deleteStudentDB
} from '$lib/server/StudentSB';
import type { StudentProcessed } from '$lib/utils/types';

// parameter type for insert and update student DB functions
export type StudentDBObj = {
	sn_id: number;
	rfid: number;
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

// return value of student DB functions
export type StudentResponse = {
	success: boolean;
	studentRaws: StudentDBObj[] | null;
	error: string | null;
};

// filters for selecting student records
export type StudentFilter = {
	minStudentNumber: number;
	maxStudentNumber: number;
	username: string;
    rfid: number;
};

export class Student {
	/* Contains all student methods for conversion and DB communication. */

	public static toStudentDBObj(student: StudentProcessed): StudentDBObj {
		/* Converts a StudentProcessed to a StudentDBObj. */
		return {
			sn_id: student.studentNumber,
			rfid: 0,
			username: 'email' in student ? student.email : '',
			pw: '',
			first_name: 'firstName' in student ? student.firstName : '',
			middle_initial: 'middleInitial' in student ? student.middleInitial : '',
			last_name: 'lastName' in student ? student.lastName : '',
			college: 'college' in student ? student.college : '',
			program: 'program' in student ? student.program : '',
			phone_number: 'phoneNumber' in student ? student.phoneNumber : '',
			is_enrolled: 'isEnrolled' in student ? student.isEnrolled : false
		};
	}

	public static async selectStudents(
		filter: StudentFilter = {
			minStudentNumber: 2000,
			maxStudentNumber: new Date().getFullYear(), // gets current year
			username: '',
            rfid: 0
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
		/* Updates the student record matching this student's student number. */
		return updateStudentDB(student);
	}

	public static async deleteStudent(studentNumber: number): Promise<StudentResponse> {
		/* Deletes the student record matching this Student's student number. */
		return deleteStudentDB(studentNumber);
	}
}
