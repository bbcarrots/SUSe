// import { Student } from '$lib/classes/Student.js'
import { json } from '@sveltejs/kit'

export async function PATCH({ request }) {
    const updateInfo = await request.json()
    console.log(updateInfo)

    // return json(Student.updateStudent(updateInfo))
    return json({
                val: "Received: PATCH command"
            })
}

// export async function POST({ request }) {
//     const urlParams = request.url
//     console.log(urlParams)
//     const { command } = await request.json()
//     return json({
//         val: "Received: " + command
//     })
// }

// export async function DELETE({ request }) {
//     const urlParams = request.url
//     console.log(urlParams)
//     // const { command } = await request.json()
//     return json({
//         val: "Received: DELETE"
//     })
// }