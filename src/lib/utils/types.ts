export type StudentProcessed = {
	studentNumber: number;
	email: string;
	firstName: string;
	middleInitial: string;
	lastName: string;
	college: string;
	program: string;
	phoneNumber: string;
	isEnrolled: boolean;
};

export type UsageLogProcessed = {
	usageLogID: number;
	studentNumber: number;
	adminID: number;
	serviceID: number;
	serviceType: string;
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
	isActive: boolean;
};
