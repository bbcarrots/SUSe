import { createClient } from '@supabase/supabase-js'
import { env } from '$env/dynamic/public';
import { type StudentResponse } from '$lib/classes/Student'

export const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_ANON_KEY);

export async function selectStudentDB(sn: number = 0, username: string = ''): Promise<StudentResponse> {

    let orFilter: string = ``;

    const selectQuery = supabase
        .from('student')
        .select('*')

    if (sn)         { orFilter += `sn_id.eq.${sn}`}
    if (username)   { orFilter += `username.eq.${username}`}

    if (orFilter)   { selectQuery.or(orFilter)}

    const { data, error } = await selectQuery;

    if (error) {
        return {
            success: false,
            studentRaws: null,
            error: error.message
        }
    }

    return {
        success: true,
        studentRaws: data,
        error: null
    };
}

// export async function insertStudentDB(student: Student): Promise<DBResponse> {

//     const { data, error } = await query
//         .from('student')
//         .insert()
// }

// export async function updateStudentDB(
// 	student: Student,
// 	oldSN: number,
// 	oldUsername: string
// ): Promise<DBState>