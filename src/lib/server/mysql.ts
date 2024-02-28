import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/public'
import { json } from "@sveltejs/kit";
import { Student } from '$lib/classes/student'

export type State = {
    success: boolean,
    value: Response | null,
    error: string | null
};

const errorNoDBConn: State = { 
    success: false,
    value: null,
    error: "Error: No database connection"
};

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

    let studentConn: mysql.Connection | null;

	try {
        studentConn = await connectStudentMySQL();
        
        if (!studentConn) {
            return errorNoDBConn;
        }
    } catch (err) {
        console.log(err)
        return errorNoDBConn;
    }

	try {
        await studentConn
                .query(
                    `INSERT INTO students
                    VALUES ('${student.sn}', '${student.rfid}', '${student.username}', 
                    '${student.password}', '${student.firstName}', '${student.middleInitial}', 
                    '${student.lastName}', '${student.college}', '${student.program}', 
                    '${student.phoneNum}', '${student.isEnrolled}');`
                )
        
        return { 
            success: true,
            value: null,
            error: null
        };
    } catch (err) {
        console.log(err)
        return { 
            success: false,
            value: null,
            error: "Error: Insert student failed"
        };
    }
}

export async function selectStudentDB(sn: number, username: string = ""): Promise<State> {
    // Given a student number, this returns the corresponding student information

	let adminConn: mysql.Connection | null;

    try {
        adminConn = await connectAdminMySQL();

        if (!adminConn) {
            return errorNoDBConn;
        }
    } catch (err) {
        console.log(err)
        return errorNoDBConn;
    }

	try {
        console.log(sn, username);
        let selectQuery: string = `SELECT *
                                    FROM students
                                    WHERE sn=${sn}`;

        if (username) {
            selectQuery += ` OR username='${username}';`;
        }
         else {
            selectQuery += ';'
        }

        const results: object[] = await adminConn
                .query(selectQuery)
                .then(([rows] : object[]) => {return rows;});
        
        return { 
            success: true,
            value: json(results),
            error: null
        };
    } catch (err) {
        console.log(err)
        return { 
            success: false,
            value: null,
            error: "Error: Select student failed"
        };
    }
}