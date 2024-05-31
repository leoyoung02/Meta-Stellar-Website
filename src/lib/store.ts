import { writable } from 'svelte/store';

export const videoPlayed = writable(false);
export const connected = writable(false);