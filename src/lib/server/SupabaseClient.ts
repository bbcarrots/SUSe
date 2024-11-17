import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY, ENGG2_API_KEY } from '$env/static/private';

const options = {
    global: {
        headers: {
            'x-app-api-key': ENGG2_API_KEY
        }
    }
}

// creates the connection to SUSe supabase
export const supabase = createClient(
	SUPABASE_URL ? SUPABASE_URL: "",
    SUPABASE_KEY ? SUPABASE_KEY: "",
    options
);