import { expect, test } from 'vitest'
import { Student } from "$lib/classes/student";
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

