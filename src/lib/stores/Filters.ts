import { writable, type Writable } from 'svelte/store';
import { type ServiceFilter, type StudentFilter, type AdminFilter, type UsageLogFilter } from '$lib/utils/types';

export let ServiceFilterStore: Writable<ServiceFilter> = writable({
	serviceID: 0,
	serviceName: "",
	serviceType: [],
	inUse: null,
	isAdmin: true
});

// filters for selecting student records
export let StudentFilterStore: Writable<StudentFilter> = writable({
	minStudentNumber: 0,
	maxStudentNumber: 0,
	username: "",
    rfid: 0,
	college: [],
	program: [],
    isEnrolled: null,
    isActive: null
});

// filters for selecting admin records
export let AdminFilterStore: Writable<AdminFilter> = writable({
	adminID: 0,
    rfid: 0,
	nickname: "",
	isActive: null
});

// filters for selecting usage log records
export let UsageLogFilterStore: Writable<UsageLogFilter> = writable({
	usageLogID: 0,
	studentNumber: 0,
    serviceType: [],
	minDate: "",
	maxDate: "",
});
