import type { AdminProcessed, ServiceProcessed, StudentProcessed, UsageLogProcessed } from "$lib/utils/types";
import { supabaseFront } from "$lib/utils/utils";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { writable, type Writable } from "svelte/store";

export const AdminTable: Writable<AdminProcessed[]> = writable([]);
export const ServiceTable: Writable<ServiceProcessed[]> = writable([]);
export const StudentTable: Writable<StudentProcessed[]> = writable([]);
export const UsageLogTable: Writable<UsageLogProcessed[]> = writable([]);

let channel: RealtimeChannel

channel = supabaseFront
	.channel('student-db-changes')
	.on(
		'postgres_changes',
		{
			event: '*',
			schema: 'public',
		},
		(payload) => {
			switch(payload.table) {
                case "engglib1_admin":
                    AdminTable.set([]);
                    break;
                case "engglib1_service":
                    ServiceTable.set([]);
                    break;
                case "engglib1_student":
                    StudentTable.set([]);
                    break;
                case "engglib1_usage_log":
                    UsageLogTable.set([]);
                    break;
            }
		}
	)
	.subscribe();