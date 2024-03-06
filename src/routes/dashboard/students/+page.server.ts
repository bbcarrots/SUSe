import { Student } from '$lib/classes/student';

export async function load() {
    return Student.selectStudents();
}
