import { createClient } from '@supabase/supabase-js';
// import { env } from '$env/dynamic/public';
import type { UsageLogDBObj, UsageLogFilter, UsageLogResponse } from '$lib/classes/UsageLog';

// creates the connection to SUSe supabase
export const supabase = createClient(
	'https://yfhwfzwacdlqmyunladz.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaHdmendhY2RscW15dW5sYWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MDIyNjEsImV4cCI6MjAyNTQ3ODI2MX0.gzr5edDIVJXS1YYsQSyuZhc3oHGQYuVDtVfH4_2d30A'
);

const success = {
	success: true,
	usageLogRaws: null,
	error: null
};

export async function selectUsageLogDB(filter: UsageLogFilter): Promise<UsageLogResponse> {
	/* Selects the usage logs/s from the database using a filter.
    Filter only contains option for date start and end for now. */

	let query = supabase.from('usage_log').select('*');

	if (filter.usageLogID) { // if there is a given usageLogID, search for that
		query = query.eq('ul_id', filter.usageLogID);
	}
	if (filter.minDate && filter.maxDate) { // if there is a given start and end date range, search for that
		query = query.gte('datetime_start', filter.minDate).lte('datetime_end', filter.maxDate);
	}

	const { data, error } = await query;

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

export async function insertUsageLogDB(log: UsageLogDBObj): Promise<UsageLogResponse> {
	/* Inserts a non-existing usage log record into the database. */
	const { error } = await supabase.from('usage_log').insert(log);

	if (error) {
		return {
			success: false,
			usageLogRaws: null,
			error: error.message
		};
	}

	return success;
}

async function checkUsageLogExistsDB(filter: UsageLogFilter): Promise<UsageLogResponse> {
	/* Checks if there is a single existing record of a usage log with the given usage log ID. */
	const usageLogDB = await selectUsageLogDB(filter);

	if (usageLogDB.success && usageLogDB.usageLogRaws?.length == 1) {
		return success;
	}

	return {
		success: false,
		usageLogRaws: null,
		error: 'Error: Usage log does not exist'
	};
}

export async function updateUsageLogDB(log: UsageLogDBObj): Promise<UsageLogResponse> {
	/* Updates a usage log based using the usage log ID. */
	const usageLogCheck = await checkUsageLogExistsDB({
		usageLogID: log.ul_id,
		minDate: '',
		maxDate: ''
	});

	if (!usageLogCheck.success) {
		return usageLogCheck;
	}

	const updateObj: { [key: string]: string | number } = {};

	for (const [key, value] of Object.entries(log)) {
		if (value && (typeof value == 'string' || typeof value == 'number')) {
			updateObj[key] = value;
		}
	}

	const { error } = await supabase.from('usage_log').update(updateObj).eq('ul_id', log.ul_id);

	if (error) {
		return {
			success: false,
			usageLogRaws: null,
			error: error.message
		};
	}

	return success;
}

export async function deleteUsageLogDB(usageLogID: number): Promise<UsageLogResponse> {
	/* Deletes an existing usage log record. */
	const usageLogCheck = await checkUsageLogExistsDB({
		usageLogID: usageLogID,
		minDate: '',
		maxDate: ''
	});

	if (!usageLogCheck.success) {
		return usageLogCheck;
	}

	const { error } = await supabase.from('usage_log').delete().eq('ul_id', usageLogID);

	if (error) {
		return {
			success: false,
			usageLogRaws: null,
			error: error.message
		};
	}

	return success;
}