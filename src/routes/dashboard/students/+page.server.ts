import { selectStudentDB } from '$lib/server/mysql';

export async function load() {
    const response = await selectStudentDB();

    return {
        status: true,
        value: "placeholder",
        error: null
    };
}
