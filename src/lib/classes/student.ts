import { insertStudentDB, selectStudentDB } from '$lib/server/mysql';
import type { DBState } from '$lib/server/mysql';

type StudentState = {
	success: boolean;
	students: Student[];
	error: string | null;
};

export class Student {
	private _isEnrolled: 0 | 1 = 0;
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
		private _phoneNum: string
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

	// static async selectStudents(): Promise<DBState> {
    //     /* Selects all student records in database. */
    //     const state: DBState = await selectStudentDB();
    //     const value: object[] = await state.value?.json();
        
	// 	return value.map((obj) => {
    //         new Student(obj)
    //     });
	// }

	async insertStudent(): Promise<StudentState> {
        /* Inserts unique student information in database. */
		const selectState: DBState = await selectStudentDB(this._sn, this._username);
		const selectValue: [] = await selectState.value?.json();

		if (!selectState.success) {
			return {
				success: selectState.success,
				students: [],
				error: selectState.error
			};
		} else if (selectValue.length > 0) {
			return {
				success: false,
				students: [],
				error: 'Error: Student sn/username already exists in database'
			};
		}

        const insertState: DBState = await insertStudentDB(this);

		return {
            success: insertState.success,
            students: [],
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
