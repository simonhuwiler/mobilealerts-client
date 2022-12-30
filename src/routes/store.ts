import { writable } from 'svelte/store';

export const storeSensors = writable(null);
export const storeIsDeleteMode = writable(false)
export const storeRemoveSensorPreview = writable([])
export const storePhoneID = writable(null)