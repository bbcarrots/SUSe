import { describe, it, expect, beforeEach } from 'vitest';
import { Student, State } from '$lib/classes/Student'; 

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});


describe('Student', () => {
  let studentInstance: Student;

  beforeEach(() => {
    studentInstance = new Student(198712345, "rfid12345", "Eheads", "Password1234", "Ely", "B", "Buendia", "College of Mass Communications", "BA Film", "09123456789");
  });

  it('success: inserted student in database', async () => {
    const expectedState: State = { // returned state upon successful insert into database
      success: true,
			value: null,
			error: null
    } 
	
    await expect(studentInstance.insertStudent()).resolves.toBe(expectedState)
  });

  it('error: inserting already existing record', async () => {
    const expectedState: State = { // returned state upon successful insert into database
      success: false,
      value: null,
      error: "Error: Student sn/username already exists in database"
    } 

    studentInstance.insertStudent(); // insert it first

    //then insert for a second time
    await expect(studentInstance.insertStudent()).resolves.toBe(expectedState)
  });


  // it('error: inserting when no database connection', async() => {

  // });
})
