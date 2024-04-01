<script lang="ts">
	import Table from "$lib/components/Table.svelte";
    import { ToUpdateStudentStore } from "$lib/stores/TableStores.js";

	export let data;
	let headers = [ "Student Number", "First Name", "Middle Initial", "Last Name", "Email", "Phone Number", "College", "Program"]

    type StudentProcessed = {
		firstName: string,
		middleName: string,
		lastName: string,
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

    async function handleCommand(event: CustomEvent<{command:string}>) {
        const sn_id = 1
        const username = "user"

        const response = await fetch(`../api/student`, {
            method: "PATCH",
            body: JSON.stringify(
                $ToUpdateStudentStore
            ),
            headers: {
                'content-type': 'application/json'
            }
        });

        console.log(await response.json())
    }
</script>

<section>
	<Table headers={headers} information = {students} primaryKey="studentNumber" on:command={handleCommand}/>
</section>
