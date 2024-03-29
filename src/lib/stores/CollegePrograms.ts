import { readable, type Readable } from 'svelte/store';

type College = {
    college: string,
    programs: string[]
}

export const CollegePrograms: Readable<College[]> = readable(
        [
            {
                college: "College of Architecture",
                programs: [
                    "Architecture",
                    "Landscape Architecture"
                ]
            },
            {
                college: "College of Arts and Letters",
                programs: [
                    "Araling Pilipino",
                    "Art Studies",
                    "Comparative Literature",
                    "Creative Writing",
                    "English Studies",
                    "European Languages",
                    "Filipino",
                    "Malikhaing Pagsulat sa Filipino",
                    "Speech Communication",
                    "Theatre Arts"
                ]
            },
            {
                college: "Asian Institute of Tourism",
                programs: [
                    "Tourism"
                ]
            },
            {
                college: "College of Business Administration",
                programs: [
                    "Business Administration",
                    "Business Administration & Accountancy"
                ]
            },
            {
                college: "School of Economics",
                programs: [
                    "Business Economics",
                    "Economics"
                ]
            },
            {
                college: "College of Education",
                programs: [
                    "Elementary Education",
                    "Secondary Education"
                ]
            },
            {
                college: "College of Engineering",
                programs: [
                    "Chemical Engineering",
                    "Civil Engineering",
                    "Computer Engineering",
                    "Computer Science",
                    "Electrical Engineering",
                    "Electronics & Communications Engineering",
                    "Geodetic Engineering",
                    "Industrial Engineering",
                    "Materials Engineering",
                    "Mechanical Engineering",
                    "Metallurgical Engineering",
                    "Mining Engineering"
                ]
            },
            {
                college: "College of Fine Arts",
                programs: [
                    "Art Education",
                    "Art History",
                    "Industrial Design",
                    "Painting",
                    "Sculpture",
                    "Visual Communication"
                ]
            },
            {
                college: "",
                programs: [
                    "Clothing Technology",
                    "Community Nutrition",
                    "Family Life & Child Development",
                    "Food Technology",
                    "Home Economics",
                    "Hotel, Restaurant & Institution Management",
                    "Interior Design"
                ]
            },
            {
                college: "College of Human Kinetics",
                programs: [
                    "Physical Education",
                    "Sports Science"
                ]
            },
            {
                college: "School of Library and Information Studies",
                programs: [
                    "Library & Information Science"
                ]
            },
            {
                college: "College of Mass Communication",
                programs: [
                    "Broadcast Communication",
                    "Communication Research",
                    "Film",
                    "Journalism",
                ]
            },
            {
                college: "College of Music",
                programs: [
                    "Music"
                ]
            },
            {
                college: "National College of Public Administration and Governance",
                programs: [
                    "Public Administration"
                ]
            },
            {
                college: "College of Science",
                programs: [
                    "Applied Physics",
                    "Biology",
                    "Chemistry",
                    "Geology",
                    "Mathematics",
                    "Molecular Biology & Biotechnology",
                    "Physics"
                ]
            },
            {
                college: "College of Social Sciences and Philosophy",
                programs: [
                    "Anthropology",
                    "Geography",
                    "History",
                    "Linguistics",
                    "Philosophy",
                    "Political Science",
                    "Psychology",
                    "Sociology"
                ]
            },
            {
                college: "College of Social Work and Community Development",
                programs: [
                    "Community Development",
                    "Social Work"
                ]
            },
            {
                college: "College of Statistics",
                programs: [
                    "Statistics"
                ]
            }
        ]
    )