<script lang="ts">
	import Table from "$lib/components/Table.svelte";

	export let data;
	let headers = ["Name", "Student Number", "Email", "Phone Number", "College", "Program", "Actions"]

    type StudentProcessed = {
		name: string,
		sn: number,
		email: string,
		phoneNumber: string,
		college: string,
		program: string,
		isEnrolled: 0 | 1
	}
	
	let studentObjects = data.studentRaws;
    let students: StudentProcessed[] = studentObjects.map(student => {
		return {
			name: student.firstName + " " + student.middleInitial + " " + student.lastName,
			sn: student.sn,
			email: student.username,
			phoneNumber: student.phoneNumber,
			college: student.college,
			program: student.program,
			isEnrolled: student.isEnrolled
		};
	});

</script>

<Table headers={headers} information = {students}/>