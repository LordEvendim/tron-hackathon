import { AsyncActionState } from "../../types/states/asyncActionState";
import { useCallback, useEffect, useState } from "react";
import { useProvider } from "../../stores/useProvider";
import { MIRAN_CORE } from "../../constants/contracts";
import { useContracts } from "../../stores/useContracts";

export const useApplicationInitialization = () => {
  const [initializationStatus, setInitializationStatus] =
    useState<AsyncActionState>({ status: undefined });
  const provider = useProvider((state) => state.provider);

  const initializeApplication = useCallback(async () => {
    try {
      setInitializationStatus({ status: "loading" });

      if (!provider) throw new Error("Provider is unexpectedly undefined");

      // Application initalization goes here
      const coreContract = await window.tronWeb.contract().at(MIRAN_CORE);
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
