import { AsyncActionState } from "../../types/states/asyncActionState";

import { useCallback, useEffect, useState } from "react";

export const useApplicationInitialization = () => {
  const [initializationStatus, setInitializationStatus] =
    useState<AsyncActionState>({ status: undefined });

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
    if (initializationStatus.status === undefined) {
      initializeApplication();
    }
  }, [initializationStatus, initializeApplication]);

  return initializationStatus;
};
