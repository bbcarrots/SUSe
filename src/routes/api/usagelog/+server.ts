import { UsageLog } from '$lib/classes/UsageLog.js';
import { json } from '@sveltejs/kit';

export async function PATCH({ request }) {
	/* Handles Update requests for usage log records. */
	const updateInfo = UsageLog.toUsageLogDBObj(await request.json());
	return json(await UsageLog.updateUsageLog(updateInfo));
}

export async function DELETE({ request }) {
	/* Handles Delete requests for usage log records. */
	const log = await request.json();
	return json(await UsageLog.deleteUsageLog(log.usageLogID));
}
