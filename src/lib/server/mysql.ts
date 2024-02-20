import mysql from 'mysql2/promise';

let adminMySQLConn: Promise<mysql.Connection> | null = null;
let studentMySQLConn: Promise<mysql.Connection> | null = null;

export function connectAdminMySQL(): Promise<mysql.Connection> | null {
	if (!adminMySQLConn) {
		try {
			adminMySQLConn = mysql.createConnection({
				host: '127.0.0.1',
				user: 'admin',
				password: 'admin',
				database: 'suse'
			});
		} catch {
			return null;
		}
	}

	return adminMySQLConn;
}

export function connectStudentMySQL(): Promise<mysql.Connection> | null {
	if (!studentMySQLConn) {
		try {
			studentMySQLConn = mysql.createConnection({
				host: '127.0.0.1',
				user: 'student',
				password: 'student',
				database: 'suse'
			});
		} catch {
			return null;
		}
	}

	return studentMySQLConn;
}

type studentInfo = {
	sn: number,
	rfid: string,
	username: string,
	password: string,
	firstName: string,
	middleName: string,
	lastName: string,
	college: string,
	program: string,
	phoneNum: string,
}

export async function insertStudentInfo(data: studentInfo): Promise<'success' | 'fail'> {
	const studentConn = await connectStudentMySQL();

	if (!studentConn) {
		return 'fail';
	}
    const isEnrolled: boolean = false;
	const results = await studentConn.query(`INSERT INTO students
            VALUES ('${data.sn}', '${data.rfid}', '${data.username}', '${data.password}', '${data.firstName}', '${data.middleName}', '${data.lastName}', '${data.college}', '${data.program}', '${data.phoneNum}', '${isEnrolled}')`);

    console.log(`results: ${results}`);

	return 'success';
}
