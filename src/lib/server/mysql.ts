import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/public'
import { Student } from '$lib/classes/student'

// let adminMySQLConn: Promise<mysql.Connection> | null = null;
let studentMySQLConn: Promise<mysql.Connection> | null = null;

// function connectAdminMySQL(): Promise<mysql.Connection> | null {
// 	if (!adminMySQLConn) {
// 		try {
// 			adminMySQLConn = mysql.createConnection({
// 				host: env.PUBLIC_HOST,
// 				user: env.PUBLIC_ADMIN_USER,
// 				password: env.PUBLIC_ADMIN_PASS,
// 				database: env.PUBLIC_DATABASE
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
				host: env.PUBLIC_HOST,
				user: env.PUBLIC_STUDENT_USER,
				password: env.PUBLIC_STUDENT_PASS,
				database: env.PUBLIC_DATABASE
			});
		} catch {
			return null;
		}
	}

	return studentMySQLConn;
}

export async function insertStudentDB(student: Student): Promise<object> {
    // Inserts the student information after registering

	const studentConn: mysql.Connection | null = await connectStudentMySQL();

	try {
        if (!studentConn) {
            return { success: false };
        }
        console.log(student.firstName);
        await studentConn
                .query(`INSERT INTO students
                VALUES ('${student.sn}', '${student.rfid}', '${student.username}', '${student.password}', '${student.firstName}', 
                '${student.middleInitial}', '${student.lastName}', '${student.college}', '${student.program}', '${student.phoneNum}', '${student.isEnrolled}');`)
        
        return { success: true };
    } catch (err) {
        console.log(err)
        return { success: false };
    }
}