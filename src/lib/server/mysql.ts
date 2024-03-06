import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/public';
import { json } from '@sveltejs/kit';
import { Student } from '$lib/classes/Student';

export type State = {
	success: boolean;
	value: Response | null;
	error: string | null;
};

const errorNoDBConn: State = {
	success: false,
	value: null,
	error: 'Error: No database connection'
};

let adminMySQLConn: Promise<mysql.Connection> | null = null;
let studentMySQLConn: Promise<mysql.Connection> | null = null;

function connectAdminMySQL(): Promise<mysql.Connection> | null {
	/* Creates the connection for the admin user */

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
	/* Creates the connection for the student user */

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

export async function selectStudentDB(sn: number = 0, username: string = ''): Promise<State> {
	/* Selects all student records. Returns matching student record/s if sn or username is provided. */

	let adminConn: mysql.Connection | null;

	try {
		// try connecting to db as a admin, catch no db connection error
		adminConn = await connectAdminMySQL();

		if (!adminConn) {
			adminMySQLConn = null;
			return errorNoDBConn;
		}
	} catch (err) {
		console.error(err);
		adminMySQLConn = null;
		return errorNoDBConn;
	}

	try {
		// try a select query and return success with value, catch select student fail error
		let selectQuery: string = `SELECT * 
                                    FROM students`;

		if (sn) {
			// if sn != 0, add sn predicate
			selectQuery += ` WHERE sn=${sn}`;
		}

		if (username) {
			// if username != "", add username predicate
			selectQuery += ` OR username='${username}';`;
		}

		selectQuery += ';';

		const results: object[] = await adminConn
            .query(selectQuery)
            .then(([rows]: object[]) => {
			return rows;
		});

		return {
			success: true,
			value: json(results),
			error: null
		};
	} catch (err) {
		console.error(err);
		return {
			success: false,
			value: null,
			error: 'Error: Select student failed'
		};
	}
}

export async function insertStudentDB(student: Student): Promise<State> {
	/* Inserts the student information into database. */

	let studentConn: mysql.Connection | null;

	try {
		// try connecting to db as a student, catch no db connection error
		studentConn = await connectStudentMySQL();

		if (!studentConn) {
			studentMySQLConn = null;
			return errorNoDBConn;
		}
	} catch (err) {
		console.error(err);
		studentMySQLConn = null;
		return errorNoDBConn;
	}

	try {
		// try an insert query and return success, catch insert student fail error
		await studentConn.query(
			`INSERT INTO students
                    VALUES ('${student.sn}', '${student.rfid}', '${student.username}', 
                    '${student.password}', '${student.firstName}', '${student.middleInitial}', 
                    '${student.lastName}', '${student.college}', '${student.program}', 
                    '${student.phoneNum}', '${student.isEnrolled}');`
		);

		return {
			success: true,
			value: null,
			error: null
		};
	} catch (err) {
		console.error(err);
		return {
			success: false,
			value: null,
			error: 'Error: Insert student failed'
		};
	}
}

// export async function updateStudentDB(student: Student): Promise<State> {
// 	/* Updates an existing student record. */

// 	let adminConn: mysql.Connection | null;

// 	try {
// 		// try connecting to db as a admin, catch no db connection error
// 		adminConn = await connectAdminMySQL();

// 		if (!adminConn) {
// 			adminMySQLConn = null;
// 			return errorNoDBConn;
// 		}
// 	} catch (err) {
// 		console.error(err);
// 		adminMySQLConn = null;
// 		return errorNoDBConn;
// 	}

//     try {
//         // try an insert query and return success, catch insert student fail error
// 		await adminConn.query(
// 			// `INSERT INTO students
//             //         VALUES ('${student.sn}', '${student.rfid}', '${student.username}', 
//             //         '${student.password}', '${student.firstName}', '${student.middleInitial}', 
//             //         '${student.lastName}', '${student.college}', '${student.program}', 
//             //         '${student.phoneNum}', '${student.isEnrolled}');`
// 		);

// 		return {
// 			success: true,
// 			value: null,
// 			error: null
// 		};
//     } catch (err) {
// 		console.error(err);
// 		return {
// 			success: false,
// 			value: null,
// 			error: 'Error: Update student failed'
// 		};
// 	}

// }