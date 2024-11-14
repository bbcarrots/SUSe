import type { AdminProcessed, ServiceProcessed, StudentProcessed, UsageLogProcessed } from "$lib/utils/types";
import { writable, type Writable } from "svelte/store";

export const AdminTable: Writable<AdminProcessed[]> = writable([]);
export const ServiceTable: Writable<ServiceProcessed[]> = writable([]);
export const StudentTable: Writable<StudentProcessed[]> = writable([]);
export const UsageLogTable: Writable<UsageLogProcessed[]> = writable([]);