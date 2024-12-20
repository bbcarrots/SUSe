interface FilterObject {
	name: string;
	value: number;
}

export const collegePrograms = [
	{ name: 'Architecture', value: 1 },
	{ name: 'Landscape Architecture', value: 2 },
	{ name: 'Araling Pilipino', value: 3 },
	{ name: 'Art Studies', value: 4 },
	{ name: 'Physical Education', value: 5 },
	{ name: 'Sports Science', value: 6 },
	{ name: 'Library & Information Science', value: 7 },
	{ name: 'Broadcast Communication', value: 8 },
	{ name: 'Communication Research', value: 9 },
	{ name: 'Film', value: 10 },
	{ name: 'Journalism', value: 11 },
	{ name: 'Music', value: 12 },
	{ name: 'Public Administration', value: 13 },
	{ name: 'Applied Physics', value: 14 },
	{ name: 'Biology', value: 15 },
	{ name: 'Chemistry', value: 16 },
	{ name: 'Geology', value: 17 },
	{ name: 'Mathematics', value: 18 },
	{ name: 'Molecular Biology & Biotechnology', value: 19 },
	{ name: 'Physics', value: 20 },
	{ name: 'Anthropology', value: 21 },
	{ name: 'Geography', value: 22 },
	{ name: 'History', value: 23 },
	{ name: 'Linguistics', value: 24 },
	{ name: 'Philosophy', value: 25 },
	{ name: 'Political Science', value: 26 },
	{ name: 'Psychology', value: 27 },
	{ name: 'Sociology', value: 28 },
	{ name: 'Community Development', value: 29 },
	{ name: 'Social Work', value: 30 },
	{ name: 'Statistics', value: 31 },
	{ name: 'Comparative Literature', value: 32 },
	{ name: 'Creative Writing', value: 33 },
	{ name: 'English Studies', value: 34 },
	{ name: 'European Languages', value: 35 },
	{ name: 'Filipino', value: 36 },
	{ name: 'Malikhaing Pagsulat sa Filipino', value: 37 },
	{ name: 'Speech Communication', value: 38 },
	{ name: 'Theatre Arts', value: 39 },
	{ name: 'Tourism', value: 40 },
	{ name: 'Business Administration', value: 41 },
	{ name: 'Business Administration and Accountancy', value: 42 },
	{ name: 'Business Economics', value: 43 },
	{ name: 'Economics', value: 44 },
	{ name: 'Elementary Education', value: 45 },
	{ name: 'Secondary Education', value: 46 },
	{ name: 'Chemical Engineering', value: 47 },
	{ name: 'Civil Engineering', value: 48 },
	{ name: 'Computer Engineering', value: 49 },
	{ name: 'Computer Science', value: 50 },
	{ name: 'Electrical Engineering', value: 51 },
	{ name: 'Electronics & Communications Engineering', value: 52 },
	{ name: 'Geodetic Engineering', value: 53 },
	{ name: 'Industrial Engineering', value: 54 },
	{ name: 'Materials Engineering', value: 55 },
	{ name: 'Mechanical Engineering', value: 56 },
	{ name: 'Metallurgical Engineering', value: 57 },
	{ name: 'Mining Engineering', value: 58 },
	{ name: 'Art Education', value: 59 },
	{ name: 'Art History', value: 60 },
	{ name: 'Painting', value: 61 },
	{ name: 'Speech Communication', value: 62 },
	{ name: 'Sculpture', value: 63 },
	{ name: 'Visual Communication', value: 64 },
	{ name: 'Clothing Technology', value: 65 },
	{ name: 'Community Nutrition', value: 66 },
	{ name: 'Family Life & Child Development', value: 67 },
	{ name: 'Food Technology', value: 68 },
	{ name: 'Home Economics', value: 69 },
	{ name: 'Hotel, Restaurant & Institution Management', value: 70 },
	{ name: 'Interior Design', value: 71 }
];

export const colleges = [
	{ name: 'College of Architecture', value: 1 },
	{ name: 'College of Arts and Letters', value: 2 },
	{ name: 'Asian Institute of Tourism', value: 3 },
	{ name: 'College of Business Administration', value: 4 },
	{ name: 'School of Economics', value: 5 },
	{ name: 'College of Education', value: 6 },
	{ name: 'College of Engineering', value: 7 },
	{ name: 'College of Fine Arts', value: 8 },
	{ name: 'College of Home Economics', value: 9 },
	{ name: 'College of Human Kinetics', value: 10 },
	{ name: 'School of Library and Information Studies', value: 11 },
	{ name: 'College of Mass Communication', value: 12 },
	{ name: 'College of Music', value: 13 },
	{ name: 'National College of Public Administration and Governance', value: 14 },
	{ name: 'College of Science', value: 15 },
	{ name: 'College of Social Sciences and Philosophy', value: 16 },
	{ name: 'College of Social Work and Community Development', value: 17 },
	{ name: 'College of Statistics', value: 18 }
];

const currentYear = new Date().getFullYear();

const studentNumberYear: FilterObject[] = [];
for (let year = 2010; year <= currentYear; year++) {
	studentNumberYear.push({ name: String(year), value: year });
}
studentNumberYear.sort((a, b) => b.value - a.value);

export { studentNumberYear };

export const serviceTypes = [
	{ name: 'Calculator', value: 1 },
	{ name: 'Extension Cord', value: 2 },
	{ name: 'Discussion Room', value: 3 },
	{ name: 'Umbrella', value: 4 },
	{ name: 'Laptop', value: 5 },
	{ name: 'Adapter', value: 6 },
	{ name: 'Reading Glasses', value: 7 }
];

export const userStatus = [
	{ name: 'Not active', value: 1 },
	{ name: 'Is active', value: 2 }
];

export const serviceStatus = [
	{ name: 'Not in use', value: 1 },
	{ name: 'In Use', value: 2 }
];

// table headers
export const adminHeaders = ['Admin ID', 'Nickname', 'Is Active'];
export const serviceHeaders = ['Service ID', 'Service Name', 'Service Type', 'In Use'];
export const studentHeaders = [
    'Student Number',
    'First Name',
    'Middle Initial',
    'Last Name',
    'Email',
    'Phone Number',
    'College',
    'Program',
    'Is Enrolled'
];
export const usageLogHeaders = [
    'Usage Log ID',
    'Service ID',
    'Service Type',
    'Student Number',
    'Admin ID',
    'Date Time Start',
    'Date Time End',
    'Location'
];