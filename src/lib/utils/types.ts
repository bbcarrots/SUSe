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
	usageLogID: number;
	serviceID: number;
	serviceType: string;
	studentNumber: number;
	adminID: number;
	dateTimeStart: string;
	dateTimeEnd: string;
};
