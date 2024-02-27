import { insertStudentDB } from "$lib/server/mysql";


export class Student {

    private _isEnrolled: number = 0;
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

    get isEnrolled(): number {
        return this._isEnrolled;
    }

    insertStudent() {
        // TO BE IMPLEMENTED: UNIQUE ENTRY CHECKER FUNCTION
        return insertStudentDB(this);
    }

    // TO BE IMPLEMENTED:
    // updateStudent()
    // deleteStudent()
    // approveStudent()
}