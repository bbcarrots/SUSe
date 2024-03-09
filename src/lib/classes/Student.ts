import { insertStudentDB, selectStudentDB } from '$lib/server/supabase';

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

export type StudentResponse = {
	success: boolean;
	studentRaws: StudentDBObj[] | null;
	error: string | null;
};

export class Student {
	/* Contains all student properties and methods. */
	// private usageLogs: [UsageLog] = []; TO BE IMPLEMENTED

	constructor(
		private _sn: number,
		private _rfid: string,
		private _username: string,
		private _password: string,
		private _firstName: string,
		private _middleInitial: string,
		private _lastName: string,
		private _college: string,
		private _program: string,
		private _phoneNumber: string,
		private _isEnrolled: boolean = false
	) {}

	get studentNumber(): number {
		return this._sn;
	}

	get username(): string {
		return this._username;
	}

	get firstName(): string {
		return this._firstName;
	}

	get middleInitial(): string {
		return this._middleInitial;
	}

	get lastName(): string {
		return this._lastName;
	}

	get college(): string {
		return this._college;
	}

	get program(): string {
		return this._program;
	}

	get phoneNumber(): string {
		return this._phoneNumber;
	}

	get isEnrolled(): boolean {
		return this._isEnrolled;
	}

	public toStudentDBObj(): StudentDBObj {
		/* Converts this Student object into a raw student record for database use. */
		return {
			sn_id: this._sn,
			rfid: this._rfid,
			username: this._username,
			pw: this._password,
			first_name: this._firstName,
			middle_initial: this._middleInitial,
			last_name: this._lastName,
			college: this._college,
			program: this._program,
			phone_number: this._phoneNumber,
			is_enrolled: this.isEnrolled
		};
	}

	public static toStudent(obj: StudentDBObj): Student {
		/* Converts a raw student record from the database into a Student object. */
		return new Student(
			obj.sn_id,
			obj.rfid,
			obj.username,
			obj.pw,
			obj.first_name,
			obj.middle_initial,
			obj.last_name,
			obj.college,
			obj.program,
			obj.phone_number,
			Boolean(obj.is_enrolled)
		);
	}

	public static async selectStudents(): Promise<StudentResponse> {
		/* Selects all student records in database. */
		return selectStudentDB();
	}

	public async insertStudent(): Promise<StudentResponse> {
		/* Inserts unique student information in database. */
		return insertStudentDB(this);
	}

	// async updateStudent(oldSN: number, oldUsername: string) {
	// 	/* Updates student information in database provided with the oldSN and oldUsername
	//         to find the to-be-updated student record. */
	// 	const selectState: DBState = await selectStudentDB(oldSN, oldUsername);
	// 	const selectValue: [] = await selectState.value?.json();

	// 	if (!selectState.success) {
	// 		return selectState;
	// 	} else if (selectValue.length > 1) {
	// 		return {
	// 			success: false,
	// 			value: null,
	// 			error: 'Error: Too many students with similar sn/username'
	// 		};
	// 	}

	// 	return updateStudentDB(this, oldSN, oldUsername);
	// }

	// TO BE IMPLEMENTED:
	// deleteStudent()
	// approveStudent()
}
