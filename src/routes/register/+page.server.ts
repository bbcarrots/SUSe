// import { Student } from '$lib/classes/Student';

import { selectStudentDB, supabase } from '$lib/server/supabase';


export const actions = {
    /* Default action of RegistrationForm is to insert student information into database. */
    default: async ( { request }) => {
        const formData: FormData = await request.formData();
        const studentData: {[key: string] : string} = {} // Initialize empty object

        for (const pair of formData.entries()) {
            // Gets form entry pairs (ex. ['sn', '2020XXXXX']) and adds it to studentData
            if (pair[0] == 'sn') {
                studentData[pair[0]] = pair[1].toString();
            } else {
                studentData[pair[0]] = pair[1].toString();
            }
        }

        // studentData['rfid'] = 'ThisIsTestRFID'; // TO BE IMPLEMENTED WHEN RFID CAN BE SCANNED

        
        // console.log(request);
        const { error } = await supabase
            .from('student')
            .insert({
                    sn_id: parseInt(studentData.sn),
                    rfid: 0x12345678,
                    username: studentData.username,
                    pw: studentData.password,
                    first_name: studentData.firstName,
                    middle_initial: studentData.middleInitial,
                    last_name: studentData.lastName,
                    college: studentData.college,
                    program: studentData.program,
                    phone_number: studentData.phoneNum,
                    is_enrolled: 1
                })
        console.log(`error: ${error}`)
        const selectAll = await selectStudentDB(0, 'znfloro');
        console.log(selectAll)

        // // Inserts student information using parsed info from the form
        // return new Student(
        //     parseInt(studentData.sn),
        //     studentData.rfid,
        //     studentData.username,
        //     studentData.password,
        //     studentData.firstName,
        //     studentData.middleInitial,
        //     studentData.lastName,
        //     studentData.college,
        //     studentData.program,
        //     studentData.phoneNum
        // ).insertStudent();
    },
};