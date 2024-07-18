import { snapId } from "$lib/constants";

export const signTxn = async (txnXDR: any) => {
  console.log("here in sign transaction");
  const signTransactionResult = await window.ethereum.request({
    method: "wallet_invokeSnap",
    params: {
      snapId: snapId,
      request: {
        method: "signAndSubmitTransaction",
        params: {
          transaction: txnXDR,
          testnet: true,
        },
      },
    },
  });

  return signTransactionResult;
};
