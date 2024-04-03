import { Student } from '$lib/classes/Student';

export const actions = {
	/* Default action of RegistrationForm is to insert student information into database. */
	default: async ({ request }) => {
		const formData: FormData = await request.formData();
		const studentData: { [key: string]: string } = {}; // Initialize empty object full of strings

		for (const pair of formData.entries()) {
			// Gets form entry pairs (ex. ['sn', '2020XXXXX']) and adds it to studentData
			studentData[pair[0]] = pair[1].toString();
		}

		studentData['rfid'] = String(Math.floor(Math.random() * 202599999) + 100000000); // TO BE IMPLEMENTED WHEN RFID CAN BE SCANNED

		// Inserts student information using parsed info from the form
		return Student.insertStudent({
			sn_id: parseInt(studentData.studentNumber),
			rfid: parseInt(studentData.rfid),
			username: studentData.username,
			pw: studentData.password,
			first_name: studentData.firstName,
			middle_initial: studentData.middleInitial,
			last_name: studentData.lastName,
			college: studentData.college,
			program: studentData.program,
			phone_number: studentData.phoneNumber,
			is_enrolled: false
		});
	}
};
