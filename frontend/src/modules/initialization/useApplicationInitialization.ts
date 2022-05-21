import { AsyncActionState } from "../../types/states/asyncActionState";

import { useCallback, useEffect, useState } from "react";
import { useHashconnect } from "../../stores/useHashconnect";
import { initalizeHashconnect } from "../hashconnect/initializeHashconnect";

export const useApplicationInitialization = () => {
  const [initializationStatus, setInitializationStatus] =
    useState<AsyncActionState>({ status: undefined });
  const hashconnect = useHashconnect((state) => state.hashconenct);
  const setSaveData = useHashconnect((state) => state.setData);

  const initializeApplication = useCallback(async () => {
    try {
      setInitializationStatus({ status: "loading" });

      // initialization goes here

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
  }, []);

  useEffect(() => {
    if (hashconnect && initializationStatus.status === undefined) {
      initializeApplication();
    }
  }, [hashconnect, initializationStatus, initializeApplication]);

  return initializationStatus;
};
