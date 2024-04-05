import { UsageLog } from '$lib/classes/UsageLog.js';
import { json } from '@sveltejs/kit';

export async function PATCH({ request }) {
	const updateInfo = UsageLog.toUsageLogDBObj(await request.json());
	return json(await UsageLog.updateUsageLog(updateInfo));
}

export async function DELETE({ request }) {
	const log = await request.json();
	return json(await UsageLog.deleteUsageLog(log.usageLogID));
}
