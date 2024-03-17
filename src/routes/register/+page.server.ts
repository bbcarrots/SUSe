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
		return new Student(
			parseInt(studentData.studentNumber),
			studentData.rfid,
			studentData.username,
			studentData.password,
			studentData.firstName,
			studentData.middleInitial,
			studentData.lastName,
			studentData.college,
			studentData.program,
			studentData.phoneNumber
		).insertStudent();
	}
};
