import { writable, type Readable } from 'svelte/store';

export let sortKey= writable<string>('name'); 
export let sortDirection = writable<number>(1); 
export let isEditing = writable<boolean>(false);
export let sortedItems = writable<Array<any>>([]); 
