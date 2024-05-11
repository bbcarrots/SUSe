import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { writable, type Writable } from 'svelte/store';

export const supabaseFront: Writable<SupabaseClient> = writable(
	createClient(
		'https://yfhwfzwacdlqmyunladz.supabase.co',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaHdmendhY2RscW15dW5sYWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MDIyNjEsImV4cCI6MjAyNTQ3ODI2MX0.gzr5edDIVJXS1YYsQSyuZhc3oHGQYuVDtVfH4_2d30A'
	)
);
