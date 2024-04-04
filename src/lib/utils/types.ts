export type StudentProcessed = {
	firstName: string;
	middleInitial: string;
	lastName: string;
	studentNumber: number;
	email: string;
	phoneNumber: string;
	college: string;
	program: string;
	isEnrolled: boolean;
};

export type UsageLogProcessed = {
	usageLogId: number;
	serviceId: number;
	serviceType: string;
	studentNumber: number;
	adminId: number;
	dateTimeStart: string;
	dateTimeEnd: string;
};
