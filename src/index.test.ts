import { createClient } from '@supabase/supabase-js';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Student, StudentState, StudentResponse, StudentDBObj } from '$lib/classes/Student'; 
import { supabase, selectStudentDB, insertStudentDB, updateStudentDB, deleteStudentDB } from '$lib/server/supabase'; 

describe('it should add 2 and 3 properly', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});


describe('success: Student.insertStudent', () => {
  const newStudentNumber = 202101012;
  const newUsername = "dummy11"; 
  const studentInstance: Student = new Student(newStudentNumber, "rfid12345", newUsername, "Password1234", "Dummy", "D", "Dumdum", "College of Dummy", "BS Dummy", "09123456789", false);

  it('success: inserted student in database', async () => {
    // returned StudentResponse upon successful insert into database
    const expectedState: StudentResponse = { 
      success: true,
			studentRaws: null,
			error: null
    } 
    await expect(studentInstance.insertStudent()).resolves.toStrictEqual(expectedState);
    await studentInstance.deleteStudent(); // clean up dummy entry
  });

  // it('success: deleted student in database', async () => {
  //   const expectedState: StudentResponse = { // returned state upon successful insert into database
  //     success: true,
	// 		studentRaws: null,
	// 		error: null
  //   } 
  //   await expect(studentInstance.deleteStudent()).resolves.toStrictEqual(expectedState);
  // });

});

describe('fail: Student.insertStudent with same SN or same username', () => {
  // create dummy studentInstance for insertion
  const newStudentNumber = 202101012;
  const newUsername = "dummy11"; 
  const studentInstance: Student = new Student(newStudentNumber, "rfid12345", newUsername, "Password1234", "Dummy", "D", "Dumdum", "College of Dummy", "BS Dummy", "09123456789", false);

  beforeEach( async () => {
    await studentInstance.insertStudent(); // insert studentInstance first
  });

  it('error: inserting with student number already in use', async () => {
    // returned StudentResponse upon failed insert with existing sn_id
    const expectedState: StudentResponse = { 
      success: false,
      studentRaws: null,
      error: 'duplicate key value violates unique constraint "student_sn_id_key"' // error message from supabase with existing SN
    } 

    // create 2nd dummy studentSameSN with same SN
    const studentSameSN: Student = new Student(newStudentNumber, "rfid12345", "dummy12", "1234Password", "DummyJr", "D", "Dumdum", "College of Not Dumm", "BS Not Dummy", "09123456789", false);

    // insert studentSameSN, should error
    await expect(studentSameSN.insertStudent()).resolves.toStrictEqual(expectedState)
    await studentInstance.deleteStudent(); // clean up dummy studentInstance entry
  });

  it('error: inserting with username already in use', async () => {
    // returned StudentResponse upon failed insert with existing username
    const expectedState: StudentResponse = { 
      success: false,
      studentRaws: null,
      error: 'duplicate key value violates unique constraint "student_username_key"' // error message from supabase with existing username
    } 

    // create 2nd dummy studentSameUsername with same username
    const studentSameUsername: Student = new Student(202101013, "rfid12345", newUsername, "1234Password", "DummyJr", "D", "Dumdum", "College of Not Dummy", "BS Not Dummy", "09123456789", false);

    // insert studentSameUsername, should error
    await expect(studentSameUsername.insertStudent()).resolves.toStrictEqual(expectedState)
    await studentInstance.deleteStudent(); // clean up dummy studentInstance entry
  });

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
});


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
