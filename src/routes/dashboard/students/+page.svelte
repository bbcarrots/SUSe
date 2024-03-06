<script>
	// import { Student } from "$lib/classes/Student";
	import Table from "$lib/components/Table.svelte";
	
	// dummy data for now, assume already filtered and processed and in order in the table
	let headers = ["Name", "Student Number", "Email", "Phone Number", "College", "Program", "Actions"]

	let students = [
		{
			name: 'Juan A Dela Cruz',
			sn: 202012345,
			email: 'jadelacruz',
			phoneNumber: '09999999999',
			college: 'COE',
			program: 'CS',
			isEnrolled: 0
		},
		{
			name: 'Juan A Dela Cruz',
			sn: 202012345,
			email: 'jadelacruz',
			phoneNumber: '09999999999',
			college: 'COE',
			program: 'CS',
			isEnrolled: 0
		}
	]

    export let data;
    console.log(data)

    // students = data.studentRaws.map((obj) => Student.convertToStudent(obj));
    // students = data.studentRaws;
</script>

<Table headers={headers} information = {students}/>