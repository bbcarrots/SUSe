import { expect, test } from 'vitest'
import { Student } from "$lib/classes/Student";
import { connectStudentMySQL } from '$lib/server/mysql';


test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3)
  })

describe('Student', () => {
  let studentInstance: Student;

  beforeEach(() => {
    studentInstance = new Student(202106299, 'abcdefghijkl', 'gscalubayan', 'password', 'Gabriel Aldrich', 'S', 'Calubayan', 'College of Engineering', 'BS Computer Science', '09123456789');
  });

  it('should insert student in database', () => {
    expect(studentInstance.insertStudent()).toBe(true)
  });

})

describe('connectStudentMySQL', () => {
  it('should return a Promise<mysql.Connection> or null', () => {
    // Mock environment variables
    const env = {
      PUBLIC_HOST: 'testhost',
      PUBLIC_STUDENT_USER: 'testuser',
      PUBLIC_STUDENT_PASS: 'testpass',
      PUBLIC_DATABASE: 'testdb'
    };

    // mock mysql module
    const mysql = {
      createConnection: jest.fn().mockReturnValue({
        // mock mysql connection object
      })
    };

    // place mock environment variables and mysql module
    jest.isolateModules(() => {
      global.env = env;
      global.mysql = mysql;

      const result = connectStudentMySQL();

      expect(result).toBeInstanceOf(Promise); 
      expect(mysql.createConnection).toHaveBeenCalledWith({
        host: 'testhost',
        user: 'testuser',
        password: 'testpass',
        database: 'testdb'
      });
    });
  });
});
