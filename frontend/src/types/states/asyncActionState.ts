export type AsyncActionState =
  | {
      status: "succeeded";
    }
  | {
      status: "loading";
    }
  | {
      status: "failed";
      error: Error;
    }
  | { status: undefined };
