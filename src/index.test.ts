// import { createClient } from '@supabase/supabase-js';
import { describe, it, expect, beforeEach, /*afterEach*/} from 'vitest';
import { Student, type StudentResponse, /*type StudentDBObj*/ } from '$lib/classes/Student'; 
// import { supabase, selectStudentDB, insertStudentDB, updateStudentDB, deleteStudentDB } from '$lib/server/supabase'; 

describe('sanity/integrity test: it should add 2 and 3 properly', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});


describe('success: Student.insertStudent', () => {
  const newStudentNumber = 202100001;
  const newUsername = "dummyinsert"; 
  const studentInstance: Student = new Student(newStudentNumber, "rfid123456", newUsername, "Password1234", "Dummy", "D", "Dumdum", "College of Dummy", "BS Dummy", "09123456789", false);

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
});

describe('fail: Student.insertStudent with same SN or same username', () => {
  // create dummy studentInstance for insertion
  const newStudentNumber = 202100002;
  const newUsername = "dummyfailinsert"; 
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
    const studentSameSN: Student = new Student(newStudentNumber, "rfid12345", "dummy", "1234Password", "DummyJr", "D", "Dumdum", "College of Not Dumm", "BS Not Dummy", "09123456789", false);

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

});

// fail tests not yet working, i.e., success state returned when expected to fail
// to be implemented at Sprint 3

describe('success: Student.updateStudent', () => {
  const newStudentNumber = 202100004;
  const newUsername = "dummyupdate"; 
  const studentInstance: Student = new Student(newStudentNumber, "rfid12345", newUsername, "Password1234", "Dummy", "D", "Dumdum", "College of Dummy", "BS Dummy", "09123456789", false);

  beforeEach( async () => {
    await studentInstance.insertStudent(); // insert studentInstance first
  });

  it('success: inserted student correctly updated in database', async () => {
    // returned StudentResponse upon successful insert into database
    const expectedState: StudentResponse = { 
      success: true,
			studentRaws: null,
			error: null
    } 
    // instance that updates password, first name, MI, last name, college, program, and phone number
    const updatedStudentInstance: Student = new Student(newStudentNumber, "rfid12345", newUsername, "Password1234", "Stephen", "", "Curry", "College of Social Sciences and Philosophy", "BA Sociology", "09876543210", false);

    await expect(updatedStudentInstance.updateStudent()).resolves.toStrictEqual(expectedState);
    await studentInstance.deleteStudent(); // clean up dummy entry
  });

  it('error: updating with wrong SN', async () => {
    // returned StudentResponse upon successful insert into database
    const expectedState: StudentResponse = { 
      success: false,
		  studentRaws: null,
		  error: 'Error: Student does not exist'
    } 
    const wrongSN: number = 202133333;

    // instance that updates password, first name, MI, last name, college, program, and phone number
    const updatedStudentInstance: Student = new Student(wrongSN, "rfid12345", newUsername, "Password1234", "Stephen", "", "Curry", "College of Social Sciences and Philosophy", "BA Sociology", "09876543210", false);

    await expect(updatedStudentInstance.updateStudent()).resolves.toStrictEqual(expectedState);
    await studentInstance.deleteStudent(); // clean up dummy entry
  });

  it('error: updating with wrong username', async () => {
    // returned StudentResponse upon successful insert into database
    const expectedState: StudentResponse = { 
      success: false,
		  studentRaws: null,
		  error: 'Error: Student does not exist'
    } 
    const wrongUsername: string = "wrongusername";

    // instance that updates password, first name, MI, last name, college, program, and phone number
    const updatedStudentInstance: Student = new Student(newStudentNumber, "rfid12345", wrongUsername, "Password1234", "Stephen", "", "Curry", "College of Social Sciences and Philosophy", "BA Sociology", "09876543210", false);

    await expect(updatedStudentInstance.updateStudent()).resolves.toStrictEqual(expectedState);
    await studentInstance.deleteStudent(); // clean up dummy entry
  });

});

// delete tests not working yet. deletion of non existent record does not error as expected.
   
describe('success: Student.deleteStudent', () => {
  const newStudentNumber = 202101012;
  const newUsername = "dummy11"; 
  const studentInstance: Student = new Student(newStudentNumber, "rfid12345", newUsername, "Password1234", "Dummy", "D", "Dumdum", "College of Dummy", "BS Dummy", "09123456789", false);
  
  beforeEach( async () => {
    await studentInstance.insertStudent(); // insert studentInstance first
  });

  it('success: deleted student in database', async () => {
    // returned StudentResponse upon successful deletion from database
    const expectedState: StudentResponse = { 
      success: true,
      studentRaws: null,
      error: null
    } 
    await expect(studentInstance.deleteStudent()).resolves.toStrictEqual(expectedState);
  });

  it('error: deleting nonexistent student in database', async () => {
    // returned StudentResponse upon failed deletion from database
    const expectedState: StudentResponse = { 
      success: false,
      studentRaws: null,
      error: "Error: Student does not exist"
    } 

    const nullStudentInstance: Student = new Student(900000000, "rfid00000", "nullusername", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", false);

    await expect(nullStudentInstance.deleteStudent()).resolves.toStrictEqual(expectedState);
    await studentInstance.deleteStudent(); // clean up dummy studentInstance entry
  });


});

// selectStudents() test not yet working, next sprint

// describe('success: Student.selectStudentDB', () => {
//   const newStudentNumber = 202100003;
//   const newUsername = "dummyselect"; 
//   const studentInstance: Student = new Student(newStudentNumber, "rfid12345", newUsername, "Password1234", "Dummy", "D", "Dumdum", "College of Dummy", "BS Dummy", "09123456789", false);

//   beforeEach( async () => {
//     await studentInstance.insertStudent(); // insert studentInstance first
//   });

//   it('success: selected student in database', async () => {
//     // returned StudentResponse upon successful insert into database
//     const expectedState: StudentResponse = { 
//       success: true,
// 			studentRaws: [],
// 			error: null
//     } 
//     await expect(studentInstance.selectStudents()).resolves.toStrictEqual(expectedState);
//     await studentInstance.deleteStudent(); // clean up dummy entry
//   });
// });

// not yet working. to be implemented at Sprint

// describe('fail: Student.insertStudent() with no DB connection', () => {
//   const newStudentNumber = 202101012;
//   const newUsername = "dummy11"; 
//   const studentInstance: Student = new Student(newStudentNumber, "rfid12345", newUsername, "Password1234", "Dummy", "D", "Dumdum", "College of Dummy", "BS Dummy", "09123456789", false);

//   beforeEach( async () => {
//     const wrongSupabase = createClient("https://wrongurl.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaHdmendhY2RscW15dW5sYWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MDIyNjEsImV4cCI6MjAyNTQ3ODI2MX0.gzr5edDIVJXS1YYsQSyuZhc3oHGQYuVDtVfH4_2d30A");
//   });

//   it('error: inserting when no database connection', async() => {
//     const expectedState: DBState = {
//       success: false,
//       studentRaws: [],
//       error: 'Error: No database connection'
//     }
//   });

// });