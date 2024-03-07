import mysql from 'mysql2/promise';
import { describe, it, expect, beforeEach } from 'vitest';
import { Student, StudentState } from '$lib/classes/Student'; 
import { DBState, connectAdminMySQL } from '$lib/server/mysql'; 

describe('it should add 2 and 3 properly', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});


describe('Student.insertStudent', () => {
  let studentInstance: Student;

  beforeEach(async () => {
    studentInstance = new Student(198712345, "rfid12345", "Eheads", "Password1234", "Ely", "B", "Buendia", "College of Mass Communications", "BA Film", "09123456789", 1);
    // need to reset database first before each test
    const adminConn: mysql.Connection | null = await connectAdminMySQL();
    const deleteQuery = "DELETE FROM students";
    if(adminConn){
      adminConn.query(deleteQuery); // delete all entries in database
    }

  });

  it('success: inserted student in database', async () => {
    const expectedState: DBState = { // returned state upon successful insert into database
      success: true,
			studentRaws: [],
			error: null
    } 
	
    await expect(studentInstance.insertStudent()).resolves.toStrictEqual(expectedState)
  });

  it('error: inserting already existing record', async () => {
    const expectedState: StudentState = { // returned state upon unsuccessful insert into database
      success: false,
      studentRaws: [],
      error: "Error: Student sn/username already exists in database"
    } 

    await studentInstance.insertStudent(); // insert it first

    //then insert for a second time
    await expect(studentInstance.insertStudent()).resolves.toStrictEqual(expectedState)
  });


  // it('error: inserting when no database connection', async() => {

  // });
})