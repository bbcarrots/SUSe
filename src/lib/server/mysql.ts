import mysql from 'mysql2/promise';

// let adminMySQLConn: Promise<mysql.Connection> | null = null;
let studentMySQLConn: Promise<mysql.Connection> | null = null;

// function connectAdminMySQL() {
// 	if (!adminMySQLConn) {
// 		try {
// 			adminMySQLConn = mysql.createConnection({
// 				host: 'localhost',
// 				user: 'admin',
// 				password: 'admin',
// 				database: 'suse'
// 			});
// 		} catch {
// 			return null;
// 		}
// 	}

// 	return adminMySQLConn;
// }

function connectStudentMySQL(): Promise<mysql.Connection> | null {
    // Creates the connection for the student user

	if (!studentMySQLConn) {
		try {
			studentMySQLConn = mysql.createConnection({
				host: 'localhost',
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

type Student = {
	sn: number,
	rfid: string,
	username: string,
	pass: string,
	firstName: string,
	middleInitial: string,
	lastName: string,
	college: string,
	program: string,
	phoneNum: string,
}

export async function insertStudentInfo(student: Student): Promise<string> {
    // Inserts the student information after registering

	const studentConn: mysql.Connection | null = await connectStudentMySQL();

	try {
        if (!studentConn) {
            return 'fail';
        }
        
        const isEnrolled: number = 0;
        await studentConn
                .query(`INSERT INTO students
                VALUES ('${student.sn}', '${student.rfid}', '${student.username}', '${student.pass}', '${student.firstName}', 
                '${student.middleInitial}', '${student.lastName}', '${student.college}', '${student.program}', '${student.phoneNum}', '${isEnrolled}');`)
        
        return 'success';
    } catch {
        return 'fail';
    }
}