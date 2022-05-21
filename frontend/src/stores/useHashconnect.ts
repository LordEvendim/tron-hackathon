import create from "zustand";
import { HashConnect, HashConnectTypes } from "hashconnect";

interface HashpackData {
  topic: string;
  pairingString: string;
  privateKey?: string;
  pairedWalletData?: HashConnectTypes.WalletMetadata;
  pairedAccounts: string[];
}

interface ProviderStore {
  hashconenct: HashConnect;
  data: HashpackData;
  setData: (newData: HashpackData) => void;
}

export const useHashconnect = create<ProviderStore>((set) => ({
  hashconenct: new HashConnect(),
  data: {
    topic: "",
    pairingString: "",
    privateKey: undefined,
    pairedWalletData: undefined,
    pairedAccounts: [],
  },
  setData: (newData: HashpackData) => {
    set({ data: newData });
  },
}));
