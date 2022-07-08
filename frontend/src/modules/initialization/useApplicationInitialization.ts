import { AsyncActionState } from "../../types/states/asyncActionState";
import { useCallback, useEffect, useState } from "react";
import { useProvider } from "../../stores/useProvider";
import { ethers } from "ethers";
import { MIRAN_CORE } from "../../constants/contracts";
import MiranCoreContract from "../../contracts/MiranCore.json";
import { MiranCore } from "../../contracts/typechain/MiranCore";
import { useContracts } from "../../stores/useContracts";

export const useApplicationInitialization = () => {
  const [initializationStatus, setInitializationStatus] =
    useState<AsyncActionState>({ status: undefined });
  const provider = useProvider((state) => state.provider);

  const initializeApplication = useCallback(async () => {
    try {
      setInitializationStatus({ status: "loading" });

      console.log("Setting factory contract");
      if (!provider) throw new Error("Provider is unexpectedly undefined");

      // Application initalization goes here
      const coreContract = new ethers.Contract(
        MIRAN_CORE,
        MiranCoreContract.abi,
        provider.getSigner()
      ) as MiranCore;
      useContracts.setState({ core: coreContract });

      setInitializationStatus({ status: "succeeded" });
    } catch (error: any) {
      if (error instanceof Error) {
        return setInitializationStatus({ status: "failed", error });
      }

      setInitializationStatus({
        status: "failed",
        error: new Error("Failed to initialize application"),
      });
    }
  }, [provider]);

  useEffect(() => {
    if (initializationStatus.status === undefined) {
      initializeApplication();
    }
  }, [initializationStatus, initializeApplication]);

  return initializationStatus;
};
