// import { Student, type StudentFilter } from '$lib/classes/Student.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	/* Handles Update and Approve requests for student records. */
	const rfid: number = await request.json().rfid;
	console.log(rfid);
	return json(rfid);
	// const filter: StudentFilter = {
	//     minStudentNumber: 0,
	//     maxStudentNumber: 0,
	//     username: '',
	//     rfid: rfid
	// }
	// return json(await Student.selectStudents(filter));
}
