import { createClient } from '@supabase/supabase-js';
// import { env } from '$env/dynamic/public';
import type { UsageLogFilter, UsageLogResponse } from '$lib/classes/UsageLog';

// creates the connection to SUSe supabase
export const supabase = createClient(
	'https://yfhwfzwacdlqmyunladz.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaHdmendhY2RscW15dW5sYWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MDIyNjEsImV4cCI6MjAyNTQ3ODI2MX0.gzr5edDIVJXS1YYsQSyuZhc3oHGQYuVDtVfH4_2d30A'
);

// const success = {
// 	success: true,
// 	usageLogRaws: null,
// 	error: null
// };

export async function selectUsageLogDB(filter: UsageLogFilter): Promise<UsageLogResponse> {
	/* Selects the usage logs/s from the database using a filter.
    Filter only contains option for date start and end for now. */

	const { data, error } = await supabase
		.from('usage_log')
		.select('*')
		.gte('datetime_start', filter.minDate) // student number should be between an inclusive range
		.lte('datetime_end', filter.maxDate);

	if (error) {
		return {
			success: false,
			usageLogRaws: null,
			error: error.message
		};
	}

	return {
		success: true,
		usageLogRaws: data,
		error: null
	};
}
