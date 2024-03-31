<script lang="ts">
	import Table from "$lib/components/Table.svelte";
	import { type StudentProcessed } from "$lib/utils/types.js";

	export let data;
	let headers = [ "Student Number", "First Name", "Middle Initial", "Last Name", "Email", "Phone Number", "College", "Program"]


	let studentObjects = data.studentRaws;

	let students: StudentProcessed[] = [];

	if (studentObjects !== null && studentObjects !== undefined) {
		students = studentObjects.map(student => {
			return {
				studentNumber: student.sn_id,
				firstName: student.first_name,
				middleName: student.middle_initial,
				lastName: student.last_name,
				email: student.username,
				phoneNumber: student.phone_number,
				college: student.college,
				program: student.program,
				isEnrolled: student.is_enrolled
			};
		});
	}

</script>

<section>
	<Table headers={headers} information = {students} primaryKey="studentNumber"/>
</section>
