export const fetchNFT = async () => {
  try {
    const response = await fetch("url");
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (e) {
    throw e;
  }
};
