import type { AlertType } from "$lib/types";
import { Toaster, toast } from "svelte-sonner";
import { MetaStellarWallet } from "metastellar-sdk";
import Swal from "sweetalert2";
import { walletData } from "$lib/store";

type SonnerToastProps = {
  type: string;
  desc: string;
};
export const Toast = ({ type, desc }: SonnerToastProps) => {
  switch (type) {
    case "success":
      toast.success(desc);
      break;
    case "info":
      toast.info(desc);
      break;
    case "warning":
      toast.warning(desc);
      break;
    case "error":
      toast.error(desc);
      break;
  }
};

type AlertProps = {
  type: AlertType;
  desc: string;
  successText: string;
  errText: string;
  callback: () => void;
};

export const Alert = ({
  type,
  desc,
  successText,
  errText,
  callback,
}: AlertProps) => {
  Swal.fire({
    title: "Are you sure?",
    text: desc,
    icon: type,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.value) {
      // Swal.fire("Confirmed!", successText, "success");
      callback();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", errText, "error");
    }
  });
};

export const getWalletData = () => {
  let data: any;
  walletData.subscribe((val: any) => (data = val));
  return data;
};

export const updateWalletData = async () => {
  let wd = getWalletData();
  walletData.update((item) => ({ ...item, dataPacket: null }));
  walletData.subscribe((val) => console.log(val));
  const wallet = MetaStellarWallet.loadFromState(wd);
  await wallet.init();
  walletData.set(wallet.exportState());
};

export const assetType = (asset: any) => {
  if (asset.asset_code !== "XLM" && asset.limit === "0.0000001") {
    return "nft";
  } else if (asset.asset_code !== "XLM" && asset.limit !== "0.0000001") {
    return "token";
  } else {
    return "";
  }
};
