import mysql from 'mysql2/promise';
import { describe, it, expect, beforeEach } from 'vitest';
import { Student, StudentState, StudentRaw, convertToStudent } from '$lib/classes/Student'; 
import { DBState, connectAdminMySQL } from '$lib/server/mysql'; 

describe('it should add 2 and 3 properly', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});


// describe('Student.insertStudent', () => {
//   let studentInstance: Student;

//   beforeEach(async () => {
//     studentInstance = new Student(198712345, "rfid12345", "ebbuendia", "Password1234", "Ely", "B", "Buendia", "College of Mass Communications", "BA Film", "09123456789", 1);
//     // need to reset database first before each test
//     const adminConn: mysql.Connection | null = await connectAdminMySQL();
//     const deleteQuery = "DELETE FROM students";
//     if(adminConn){
//       adminConn.query(deleteQuery); // delete all entries in database
//     }

//   });

//   it('success: inserted student in database', async () => {
//     const expectedState: DBState = { // returned state upon successful insert into database
//       success: true,
// 			studentRaws: [],
// 			error: null
//     } 
//     await expect(studentInstance.insertStudent()).resolves.toStrictEqual(expectedState)
//   });

//   it('error: inserting with student number already in use', async () => {
//     const expectedState: StudentState = { // returned state upon unsuccessful insert into database
//       success: false,
//       studentRaws: [],
//       error: "Error: Student sn/username already exists in database"
//     } 
//     let studentSameSN = new Student(198712345, "rfid12346", "ebbuendia2", "Password1234", "Ely", "B", "Buendia Jr.", "College of Mass Communications", "BA Film", "09123456789", 1);
    
//     await studentInstance.insertStudent(); // insert it first

//     //then insert for a second time
//     await expect(studentSameSN.insertStudent()).resolves.toStrictEqual(expectedState)
//   });

//   it('error: inserting with username already in use', async () => {
//     const expectedState: StudentState = { // returned state upon unsuccessful insert into database
//       success: false,
//       studentRaws: [],
//       error: "Error: Student sn/username already exists in database"
//     } 
//     let studentSameSN = new Student(198712346, "rfid12346", "ebbuendia", "Password1234", "Ely", "B", "Buendia Jr.", "College of Mass Communications", "BA Film", "09123456789", 1);
    
//     await studentInstance.insertStudent(); // insert it first

//     //then insert for a second time
//     await expect(studentSameSN.insertStudent()).resolves.toStrictEqual(expectedState)
//   });


//   it('error: inserting when no database connection', async() => {
//     const expectedState: DBState = {
//       success: false,
//       studentRaws: [],
//       error: 'Error: No database connection'
//     };

//     await mysql.createConnection({ // how to disconnect from database?
//       host: 'testhost',
//       user: 'testuser',
//       password: 'testpass',
//       database: 'testdb'
//     });

//     await expect(studentInstance.insertStudent()).resolves.toStrictEqual(expectedState)

//   });
// })

// describe('Student.convertToStudent', () => { // not yet working
//   let studentRawInstance: StudentRaw;

//   beforeEach(async () => {
//     studentRawInstance = {sn: 198712345, 
//       rfid: "rfid12345", 
//       username: "Eheads", 
//       pass: "Password1234", 
//       firstName: "Ely", 
//       middleInitial: "B", 
//       lastName: "Buendia", 
//       college: "College of Mass Communications", 
//       program: "BA Film", 
//       phoneNumber: "09123456789",
//       isEnrolled: 1
//     };
//     // need to reset database first before each test
//     const adminConn: mysql.Connection | null = await connectAdminMySQL();
//     const deleteQuery = "DELETE FROM students";
//     if(adminConn){
//       adminConn.query(deleteQuery); // delete all entries in database
//     }

//   });

//   it("success: converted StudentRaw to Student instance", () => {
//     let student: Student;
//     let expectedStudent = new Student(198712345, "rfid12345", "Eheads", "Password1234", "Ely", "B", "Buendia", "College of Mass Communications", "BA Film", "09123456789");

//     expect(student.convertToStudent(studentRawInstance)).toBe(expectedStudent)
//   });
// });
