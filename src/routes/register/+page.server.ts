import { Student } from '$lib/classes/student.js';

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        return new Student(
            parseInt(formData.get('sn')),
            'TestRFID',
            formData.get('username'),
            formData.get('password'),
            formData.get('firstName'),
            formData.get('middleInitial'),
            formData.get('lastName'),
            formData.get('college'),
            formData.get('program'),
            formData.get('phoneNum')
        ).insertStudent();
    },
};