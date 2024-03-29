import create from "zustand";
import { MiranCore } from "../contracts/typechain/MiranCore";

interface ContractStore {
  core: any;
  setCore: (contract: MiranCore) => void;
}

export const useContracts = create<ContractStore>((set) => ({
  core: undefined,
  setCore: (contract: MiranCore) => set(() => ({ core: contract })),
}));
