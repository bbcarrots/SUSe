import { writable, type Readable, get } from 'svelte/store';

export let sortKeyStudents = writable<string>('name');
export let sortDirectionStudents = writable<number>(1);
export let isEditingStudents = writable<boolean>(false);
export let sortedItemsStudents = writable<Array<any>>([]);
export let defaultCollegeValue = writable<string>('');
export let college = writable<string>(get(defaultCollegeValue));

export const formDataStoreStudents = writable(new FormData());
