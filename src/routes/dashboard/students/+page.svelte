<script lang="ts">
	import Table from "$lib/components/Table.svelte";

	export let data;
	let headers = ["Name", "Student Number", "Email", "Phone Number", "College", "Program", "Actions"]

    type StudentProcessed = {
		name: string,
		studentnumber: number,
		email: string,
		phonenumber: string,
		college: string,
		program: string,
		isenrolled: 0 | 1
	}
	
	let studentObjects = data.studentRaws;
    let students: StudentProcessed[] = studentObjects.map(student => {
		return {
			name: student.firstName + " " + student.middleInitial + " " + student.lastName,
			studentnumber: student.sn,
			email: student.username,
			phonenumber: student.phoneNumber,
			college: student.college,
			program: student.program,
			isenrolled: student.isEnrolled
		};
	});

</script>

<Table headers={headers} information = {students}/>