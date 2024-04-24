import { Student } from '$lib/classes/Student';
import { Service } from '$lib/classes/Service';

export async function load() {
	/* Loads student records from the DB when page is created. */
	Service.selectServices()
	return Student.selectStudents();
}
