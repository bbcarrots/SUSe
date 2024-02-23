import mysql from 'mysql2/promise';
// import { PUBLIC_STUDENT_USER } from '$env/dynamic/public'
// import { Student } from '$lib/classes/student'

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

export async function insertStudentDB(student): Promise<object> {
    // Inserts the student information after registering

	const studentConn: mysql.Connection | null = await connectStudentMySQL();

	try {
        if (!studentConn) {
            return { success: false };
        }
        await studentConn
                .query(`INSERT INTO students
                VALUES ('${student.sn}', '${student.rfid}', '${student.username}', '${student.password}', '${student.firstName}', 
                '${student.middleInitial}', '${student.lastName}', '${student.college}', '${student.program}', '${student.phoneNum}', '${student.isEnrolled}');`)
        
        return { success: true };
    } catch {
        return { success: false };
    }
}