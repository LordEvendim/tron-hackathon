import { ethers } from "ethers";
import create from "zustand";

interface ProviderStore {
  provider: ethers.providers.Web3Provider;
  setProvider: (newProvider: ethers.providers.Web3Provider) => void;
}

export const useProvider = create<ProviderStore>((set) => ({
  provider: new ethers.providers.Web3Provider(window.ethereum, "any"),
  setProvider: (newProvider: ethers.providers.Web3Provider) =>
    set({ provider: newProvider }),
}));
