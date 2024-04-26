import { UsageLog } from "$lib/classes/UsageLog";

export async function load() {
	/* Loads usage log records from the DB when page is created. */
	return UsageLog.selectUsageLogs();
}
