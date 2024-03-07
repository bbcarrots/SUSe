import { insertStudentDB, selectStudentDB } from '$lib/server/mysql';
import type { DBState } from '$lib/server/mysql';

type StudentRaw = {
    sn: number,
    rfid: string,
    username: string,
    pass: string,
    firstName: string,
    middleInitial: string,
    lastName: string,
    college: string,
    program: string,
    phoneNumber: string,
    isEnrolled: 0 | 1 // MySQL only accepts 0 or 1 as a representation of booleans
}

export type StudentState = {
    success: boolean,
    studentRaws: StudentRaw[], // workaround on not being able to send class objects in POST requests—send raw student information instead
    error: string | null
}

export class Student {
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
		private _phoneNum: string,
		private _isEnrolled: 0 | 1 = 0
	) {}

	get sn(): number {
		return this._sn;
	}

	get rfid(): string {
		return this._rfid;
	}

	get username(): string {
		return this._username;
	}

	get password(): string {
		return this._password;
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

	get phoneNum(): string {
		return this._phoneNum;
	}

	get isEnrolled(): 0 | 1 {
		return this._isEnrolled;
	}
    
    static convertToStudent(obj: StudentRaw): Student {
        return new Student(
            obj.sn,
            obj.rfid,
            obj.username,
            obj.pass,
            obj.firstName,
            obj.middleInitial,
            obj.lastName,
            obj.college,
            obj.program,
            obj.phoneNumber,
            obj.isEnrolled
        );
    }

	static async selectStudents(): Promise<StudentState> {
		/* Selects all student records in database. */
        const state: DBState = await selectStudentDB();
        const value: StudentRaw[] = await state.value?.json();
		return {
            success: state.success,
            studentRaws: value,
            error: state.error
        }
	}

	async insertStudent(): Promise<StudentState> {
		/* Inserts unique student information in database. */
		const selectState: DBState = await selectStudentDB(this._sn, this._username);
		const selectValue: [] = await selectState.value?.json();

		if (!selectState.success) {
			return {
                success: selectState.success,
                studentRaws: [],
                error: selectState.error
            };
		} else if (selectValue.length > 0) {
			return {
				success: false,
				studentRaws: [],
				error: 'Error: Student sn/username already exists in database'
			};
		}

        const insertState: DBState = await insertStudentDB(this);

		return {
            success: insertState.success,
            studentRaws: [],
            error: insertState.error
        };
	}

	// async updateStudent() {
	//     /* Updates student information in database. */
	//     const state: DBState = await selectStudentDB(this._sn, this._username);
	//     const value: [] = await state.value?.json()

	//     if (!state.success) {
	//         return state;
	//     } else if (value.length > 1) {
	//         return {
	//             success: false,
	//             value: null,
	//             error: "Error: Too many students with similar sn/username"
	//         }
	//     }

	//     return updateStudentDB(this);
	// }

	// TO BE IMPLEMENTED:
	// updateStudent()
	// deleteStudent()
	// approveStudent()
}