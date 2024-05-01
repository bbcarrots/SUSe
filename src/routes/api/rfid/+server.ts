import { Student } from '$lib/classes/Student.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	/* Handles RFID validation requests for student records. */
	const rfid = await request.json();
    
	return json(
		await Student.selectStudents({
			minStudentNumber: 2000,
			maxStudentNumber: new Date().getFullYear(),
			username: '',
			rfid: rfid
		})
	);
}