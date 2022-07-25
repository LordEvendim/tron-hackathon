import { ethers } from "ethers";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import { useUserData } from "../stores/useUserData";

type useWalletType = [
  isConnecting: boolean,
  connectWallet: () => void,
  disconnectWallet: () => void
];

export const useWallet = (): useWalletType => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const login = useUserData((state) => state.login);
  const logout = useUserData((state) => state.logout);

  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true);
      if (!window.tronWeb) throw new Error("Cannot find TronLink");

      const provider = new ethers.providers.Web3Provider(window.tronWeb, "any");
      await provider.send("tron_requestAccounts", []);

      const address = window.tronWeb.defaultAddress.base58;

      if (!address) {
        throw new Error("TronLink is not connected");
      }

      login(window.tronWeb.defaultAddress.base58);
      setIsConnecting(false);
    } catch (error: any) {
      toast.error(error.message);
      setIsConnecting(false);
    }
  }, [login]);

  const disconnectWallet = () => {
    logout();
  };

  return [isConnecting, connectWallet, disconnectWallet];
};
