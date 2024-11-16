import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '$env/static/private';

// creates the connection to SUSe supabase
export const supabase = createClient(
	SUPABASE_URL ? SUPABASE_URL: "",
    SUPABASE_KEY ? SUPABASE_KEY: ""
);