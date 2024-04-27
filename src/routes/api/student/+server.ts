import { Student } from '$lib/classes/Student.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	/* Handles RFID validation requests for student records. */
	const student = await request.json();
	return json(
		await Student.selectStudents({
			minStudentNumber: 2000,
			maxStudentNumber: new Date().getFullYear(),
			username: '',
			rfid: student.rfid
		})
	);
}

export async function PATCH({ request }) {
	/* Handles Update and Approve requests for student records. */
	const updateInfo = Student.toStudentDBObj(await request.json());
	return json(await Student.updateStudent(updateInfo));
}

export async function DELETE({ request }) {
	/* Handles Delete requests for student records. */
	const student = await request.json();
	return json(await Student.deleteStudent(student.studentNumber));
}
