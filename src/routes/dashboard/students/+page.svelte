<script lang="ts">
	export let data;
	let headers = [ "Student Number", "First Name", "Middle Initial", "Last Name", "Email", "Phone Number", "College", "Program"]

	import NewTable from "$lib/components/NewTable.svelte";
	import { type StudentProcessed } from "$lib/utils/types.js";
	let studentObjects = data.studentRaws;

	let students: StudentProcessed[] = [];

	if (studentObjects !== null && studentObjects !== undefined) {
		students = studentObjects.map((student) => {
			return {
				studentNumber: student.sn_id,
				firstName: student.first_name,
				middleInitial: student.middle_initial,
				lastName: student.last_name,
				email: student.username,
				phoneNumber: student.phone_number,
				college: student.college,
				program: student.program,
				isEnrolled: student.is_enrolled,
			}
		})
	}

</script>

<NewTable headers={headers} information = {students} primaryKey="studentNumber"/>
