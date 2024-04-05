import { Student } from '$lib/classes/Student.js';
import { json } from '@sveltejs/kit';

export async function PATCH({ request }) {
	const updateInfo = Student.toStudentDBObj(await request.json());
	return json(await Student.updateStudent(updateInfo));
}

export async function DELETE({ request }) {
	const student = await request.json();
	return json(await Student.deleteStudent(student.studentNumber));
}
