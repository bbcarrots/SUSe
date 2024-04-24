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

export type ServiceProcessed = {
	serviceID: number;
	serviceName: string;
	serviceType: string;
	inUse: boolean;
};

export type AdminProcessed = {
	adminID: number;
	nickname: string;
