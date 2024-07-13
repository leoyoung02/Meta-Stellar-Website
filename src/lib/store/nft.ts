import { writable } from "svelte/store";
import { fetchNFT } from "$lib/services/nft";
export interface NftModel {
  code: string;
  issuer: string;
}

export const nftStore = writable<NftModel[]>([
  { code: "test1 code", issuer: "test1 issuer" },
  { code: "test2 code", issuer: "test2 issuer" },
]);
let loadingForNFT = false;

export const nftLoadingStore = writable<boolean>(false);

export const updateNFT = (nft: NftModel) => {
  nftStore.update((all) => [...all, nft]);
  return true;
};

export const getNFT = async () => {
  let nftList;

  nftStore.subscribe((val) => {
    if (val?.length && Object.values(val)?.length) {
      nftList = val;
    }
  });

  // if ((!loadingForNFT && !nftList) || !!forceUpdate) {
  if (!loadingForNFT && !nftList) {
    loadingForNFT = true;
    nftLoadingStore.update((u) => true);
    try {
      const nftDataFromServer = await fetchNFT();
      nftStore.update((u) => nftDataFromServer);
    } catch (e) {
      throw e;
    } finally {
      loadingForNFT = false;
      nftLoadingStore.update((u) => false);
    }
  }

  return nftList;
};
