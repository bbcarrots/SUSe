import { json } from '@sveltejs/kit'

export async function POST({ request }) {
    const urlParams = request.url
    console.log(urlParams)
    const { command } = await request.json()
    return json({
        val: "Received: " + command
    })
}

export async function DELETE({ request }) {
    const urlParams = request.url
    console.log(urlParams)
    // const { command } = await request.json()
    return json({
        val: "Received: DELETE"
    })
}