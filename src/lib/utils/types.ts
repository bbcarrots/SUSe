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
	dateTimeEnd: string | null;
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

// filters for selecting service records
export type ServiceFilter = {
	serviceID: number;
	serviceName: string;
	serviceType: string[];
	inUse: boolean | null;
	isAdmin: boolean;
};

// filters for selecting student records
export type StudentFilter = {
	minStudentNumber: number;
	maxStudentNumber: number;
	username: string;
    rfid: number;
	college: string[];
	program: string[];
    isEnrolled: boolean | null;
    isActive: boolean | null;
};

// filters for selecting admin records
export type AdminFilter = {
	adminID: number;
	nickname: string;
	isActive: boolean | null;
};

// filters for selecting usage log records
export type UsageLogFilter = {
	usageLogID: number;
	studentNumber: number;
    serviceType: string[];
	minDate: string;
	maxDate: string | null;
};
