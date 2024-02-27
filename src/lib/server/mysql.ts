import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/public'
import { json } from "@sveltejs/kit";
import { Student } from '$lib/classes/student'

type State = {
    success: boolean,
    value: Response | null
}

let adminMySQLConn: Promise<mysql.Connection> | null = null;
let studentMySQLConn: Promise<mysql.Connection> | null = null;

function connectAdminMySQL(): Promise<mysql.Connection> | null {
	if (!adminMySQLConn) {
		try {
			adminMySQLConn = mysql.createConnection({
				host: env.PUBLIC_HOST,
				user: env.PUBLIC_ADMIN_USER,
				password: env.PUBLIC_ADMIN_PASS,
				database: env.PUBLIC_DATABASE
			});
		} catch {
			return null;
		}
	}

	return adminMySQLConn;
}

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

export async function insertStudentDB(student: Student): Promise<State> {
    // Inserts the student information after registering

	const studentConn: mysql.Connection | null = await connectStudentMySQL();

	try {
        if (!studentConn) {
            return { 
                success: false,
                value: null
            };
        }
        console.log(student.firstName);
        await studentConn
                .query(`INSERT INTO students
                VALUES ('${student.sn}', '${student.rfid}', '${student.username}', '${student.password}', '${student.firstName}', 
                '${student.middleInitial}', '${student.lastName}', '${student.college}', '${student.program}', '${student.phoneNum}', '${student.isEnrolled}');`)
        
        return { 
            success: true,
            value: null
        };
    } catch (err) {
        console.log(err)
        return { 
            success: false,
            value: null
        };
    }
}



export async function selectStudentDB(sn: number): Promise<State> {
    // Given a student number, this returns the corresponding student information

	const adminConn: mysql.Connection | null = await connectAdminMySQL();

	try {
        if (!adminConn) {
            return { 
                success: false,
                value: null
            };
        }
        console.log(sn);
        const results: object[] = await adminConn
                .query(
                    `SELECT *
                    FROM students
                    WHERE sn=${sn};`
                )
                .then(([rows] : object[]) => {return rows;});
        
        return { 
            success: true,
            value: json(results)
        };
    } catch (err) {
        console.log(err)
        return { 
            success: false,
            value: null
        };
    }
}