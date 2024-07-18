// export const snapId = import.meta.env.DEV
//   ? "local:http://localhost:8080/"
//   : "npm:stellar-snap";
export const snapId = "npm:stellar-snap";
// stellar_rpc_endpoint
export const stellar_rpc_endpoint = import.meta.env.DEV
  ? "https://horizon-testnet.stellar.org/"
  : "https://horizon.stellar.org/";

export const passpharase = import.meta.env.DEV
  ? "Test SDF Network ; September 2015"
  : "Public Global Stellar Network ; September 2015";

export const CLAIMABLE_BALANCE_ENDPOINT = `${stellar_rpc_endpoint}claimable_balance`;

export const friend_bot_url = "https://friendbot.stellar.org";

export const pinata = {
  url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
  api_key:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmZDUwYTI5NC00NjhmLTRiNGEtYmQ5ZC1mNjY0MzkxOTIyMGIiLCJlbWFpbCI6ImhpZGVraWthdHN1cmE0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIwOWJlNjViMTJlMWU2ZTM5OTczZiIsInNjb3BlZEtleVNlY3JldCI6IjJmNzAyYmY0YzEyOGI2ODg3OWE5YWRjOGIyZDBiMTA5ZDU3NzhlOTA3OTJmMWYxODFlNGEzODkxMTRiMTRlY2QiLCJpYXQiOjE3MjEwNDY5MDJ9.rLmY-rNFOk8NEYc6NCtMEBuRHnkzO3W7JPX-k_OVpzE",
};

export const stellar_toml_server_url = "http://104.238.129.193:6004";

export const stellar_explorer_url =
  "https://stellar.expert/explorer/testnet/search?term=";
