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
	isActive: boolean;
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
    serviceTypeID: number;
	serviceName: string;
	serviceType: string;
	inUse: boolean;
};

export type AdminProcessed = {
	adminID: number;
	nickname: string;
	isActive: boolean;
};

// all filters store strings fron the frontend
export type ServiceFilter = {
	serviceID: number[];
	serviceName: string[];
	serviceType: string[];
	inUse: boolean[];
	isAdmin: boolean[];
};

export type StudentFilter = {
	studentNumberYear: string[];
	isActive: string[];
	college: string[];
	program: string[];
};

export type AdminFilter = {
	nickname: string[];
	isActive: string[];
};

export type UsageLogFilter = {
	dateRangeStart: string;
	dateRangeEnd: string;
	serviceType: string[];
};
