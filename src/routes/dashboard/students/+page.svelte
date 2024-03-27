<script lang="ts">
	import Table from "$lib/components/Table.svelte";

	export let data;
	let headers = ["Name", "Student Number", "Email", "Phone Number", "College", "Program"]

    type StudentProcessed = {
		name: string,
		studentNumber: number,
		email: string,
		phoneNumber: string,
		college: string,
		program: string,
		isEnrolled: boolean
	}
	
	let studentObjects = data.studentRaws;

	let students: StudentProcessed[] = [];

	if (studentObjects !== null && studentObjects !== undefined) {
		students = studentObjects.map(student => {
			return {
				name: student.first_name + " " + student.middle_initial + " " + student.last_name,
				studentNumber: student.sn_id,
				email: student.username,
				phoneNumber: student.phone_number,
				college: student.college,
				program: student.program,
				isEnrolled: student.is_enrolled
			};
		});
	}

</script>

<Table headers={headers} information = {students} primaryKey="studentNumber"/>