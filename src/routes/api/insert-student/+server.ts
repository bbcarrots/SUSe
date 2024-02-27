import { insertStudentDB } from "$lib/server/mysql"
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
    const studentInfo = await request.json()
    const output = await insertStudentDB(studentInfo)
    return json(output)
}
