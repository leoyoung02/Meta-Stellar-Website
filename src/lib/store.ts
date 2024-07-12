import { writable } from 'svelte/store';
import type { Writable } from "svelte/store";
import {MetaStellarWallet} from 'metastellar-sdk';
import type {walletState} from 'metastellar-sdk';

export const videoPlayed = writable(false);
export const connected = writable(false);


export const lockScroll: Writable<boolean> = writable(false);
export const walletData: Writable<walletState> = writable((new MetaStellarWallet()).exportState());
console.log(MetaStellarWallet);
//export const currentWalletState: Writable<walletState> = writable((new MetaStellarWallet()).exportState());