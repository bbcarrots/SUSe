import { get } from 'svelte/store';

import {
	sortKeyStudents,
	sortDirectionStudents,
	isEditingStudents,
	formDataStoreStudents,
	defaultCollegeValue,
	sortedItemsStudents,
	college
} from '$lib/stores/StudentTableStores';

export const sortTable = (key: string, tableType: string) => {
	if (tableType === 'students') {
		const isEditing = get(isEditingStudents);
		if (!isEditing) {
			const sortKey = get(sortKeyStudents);
			if (sortKey === key) {
				sortDirectionStudents.update((val) => -val);
			} else {
				sortKeyStudents.set(key);
				sortDirectionStudents.set(1);
			}
			return { sortKey: get(sortKeyStudents), sortDirection: get(sortDirectionStudents) };
		}
	}
};

export const triggerEdit = (tableType: string) => {
	if (tableType === 'students') {
		const isEditing = get(isEditingStudents);
		if (isEditing === false) {
			isEditingStudents.set(true);
		}
	}
};

export const cancelEdit = (tableType: string) => {
	if (tableType === 'students') {
		const isEditing = get(isEditingStudents);
		if (isEditing === true) {
			isEditingStudents.set(false);
		}
	}
};

// update FormData store
export function updateFormData(property: string, tableType: string) {
	if (tableType === 'students') {
		const element = document.getElementById(property) as HTMLInputElement;
		const value = element?.value || '';
		if (property === 'college') {
			college.set(value);
		}
		formDataStoreStudents.update((formDataStudents) => {
			formDataStudents.set(property, value);
			return formDataStudents;
		});
		return get(formDataStoreStudents);
	} else {
		const element = document.getElementById(property) as HTMLInputElement;
		const value = element?.value || '';
		if (property === 'college') {
			college.set(value);
		}
		formDataStoreStudents.update((formDataStudents) => {
			formDataStudents.set(property, value);
			return formDataStudents;
		});
	}
}

export function getIsEditing(tableType: string) {
	let isEditing;
	if (tableType === 'students') {
		isEditing = get(isEditingStudents);
	} else {
		isEditing = get(isEditingStudents);
	}

	return isEditing;
}

export function getSortKey(tableType: string) {
	let sortKey;
	if (tableType === 'students') {
		sortKey = get(sortKeyStudents);
	} else {
		sortKey = get(sortKeyStudents);
	}

	return sortKey;
}

export function getSortDirection(tableType: string) {
	let sortDirection;
	if (tableType === 'students') {
		sortDirection = get(sortDirectionStudents);
	} else {
		sortDirection = get(sortDirectionStudents);
	}

	return sortDirection;
}

export function setSortedItems(tableType: string, items: any) {
	if (tableType == 'students') {
		sortedItemsStudents.set(items);
		return get(sortedItemsStudents);
	}
}
