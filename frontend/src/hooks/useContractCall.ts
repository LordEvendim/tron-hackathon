import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useContractCall = <T>(
  method: () => Promise<T>,
  autoCall: boolean = false
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<T | undefined>(undefined);

  const call = useCallback(async () => {
    setIsLoading(true);

    try {
      const transactionData = await method();

      if (!transactionData) {
        throw new Error("Cannot get transaction results");
      }

      setResult(transactionData);
      setIsLoading(false);
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      }

      console.log(error);
      setIsLoading(false);
    }
  }, [method]);

  useEffect(() => {
    if (autoCall) {
      call();
    }
  }, [autoCall, call]);

  return { isLoading, result, call };
};
