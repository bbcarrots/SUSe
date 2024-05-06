import { Admin } from '$lib/classes/Admin.js';
import { Student } from '$lib/classes/Student.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	/* Handles RFID validation requests for student records. */
	const { isAdmin, rfid } = await request.json();

	if (isAdmin) {
		return json(
			await Admin.selectAdmins({
				adminID: 0,
                rfid: rfid,
				nickname: '',
				isActive: null
			})
		);
	} else {
		return json(
			await Student.selectStudents({
				minStudentNumber: 2000,
				maxStudentNumber: new Date().getFullYear(),
				username: '',
				rfid: rfid,
				college: [],
				program: [],
				isEnrolled: null,
				isActive: null
			})
		);
	}
}
