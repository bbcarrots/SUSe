import { Student } from '$lib/classes/Student';

export async function load() {
    return Student.selectStudents();
}
