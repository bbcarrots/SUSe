<script lang="ts">
	import NewTable from "$lib/components/NewTable.svelte";

	export let data;
	let headers = [ "Student Number", "Name", "Email", "Phone Number", "College", "Program"]

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
				studentNumber: student.sn_id,
				name: student.first_name + " " + student.middle_initial + " " + student.last_name,
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
	<NewTable headers={headers} information = {students} primaryKey="studentNumber"/>
</section>
