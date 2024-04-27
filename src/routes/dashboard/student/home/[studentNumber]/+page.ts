import { error } from '@sveltejs/kit';

/* Function that returns the student number from the slug*/
export function load({ params }) {
	return {
		studentNumber: params.studentNumber
	};
}
