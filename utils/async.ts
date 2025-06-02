// Copied: https://github.com/streamich/react-use
import * as React from "react";

/* eslint-disable */
export type PromiseType<P extends Promise<any>> = P extends Promise<infer T>
  ? T
  : never;

export type FunctionReturningPromise = (...args: any[]) => Promise<any>;

export type AsyncState<T> =
  // initial loading
  | {
      loading: boolean;
      error?: undefined;
      value?: undefined;
    }
  // loading with previous value
  | {
      loading: true;
      error?: Error | undefined;
      value?: T;
    }
  // error
  | {
      loading: false;
      error: Error;
      value?: undefined;
    }
  // success
  | {
      loading: false;
      error?: undefined;
      value: T;
    };

// maps a function type to its resolved AsyncState result type
type StateFromFunctionReturningPromise<T extends FunctionReturningPromise> =
  AsyncState<PromiseType<ReturnType<T>>>;

export type AsyncFnReturn<
  T extends FunctionReturningPromise = FunctionReturningPromise
> = [StateFromFunctionReturningPromise<T>, T];

// function that tells if component is mounted
export function useMountedState(): () => boolean {
  // mutable ref to track mount state
  const mountedRef = React.useRef<boolean>(false);
  const get = React.useCallback(() => mountedRef.current, []);

  React.useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return get;
}

// fn: The async function you want to run.
// deps: Dependency list for useCallback.
// initialState: Optional initial loading/error/value state.
export function useAsyncFn<T extends FunctionReturningPromise>(
  fn: T,
  deps: React.DependencyList = [],
  initialState: StateFromFunctionReturningPromise<T> = { loading: false }
): AsyncFnReturn<T> {
  // tracks the latest call (to handle race conditions)
  const lastCallId = React.useRef(0);
  const isMounted = useMountedState();
  const [state, set] =
    React.useState<StateFromFunctionReturningPromise<T>>(initialState);

  const callback = React.useCallback(
    (...args: Parameters<T>): ReturnType<T> => {
      const callId = ++lastCallId.current;

      if (!state.loading) {
        set((prevState) => ({ ...prevState, loading: true }));
      }

      return fn(...args).then(
        (value) => {
          // Only update state if component is still mounted and this is the latest call
          isMounted() &&
            callId === lastCallId.current &&
            set({ value, loading: false });

          return value;
        },
        (error) => {
          isMounted() &&
            callId === lastCallId.current &&
            set({ error, loading: false });

          return error;
        }
      ) as ReturnType<T>;
    },
    deps
  );

  return [state, callback as unknown as T];
}
export function useAsync<T extends FunctionReturningPromise>(
  fn: T,
  deps: React.DependencyList = []
) {
  const [state, callback] = useAsyncFn(fn, deps, {
    loading: true,
  });

  // automatically call the async function on mount
  React.useEffect(() => {
    callback();
  }, [callback]);

  return state;
}
export type AsyncStateRetry<T> = AsyncState<T> & {
  retry(): void;
};
export function useAsyncRetry<T>(
  fn: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [attempt, setAttempt] = React.useState<number>(0);
  const state = useAsync(fn, [...deps, attempt]);

  const stateLoading = state.loading;
  const retry = React.useCallback(() => {
    if (stateLoading) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "You are calling useAsyncRetry hook retry() method while loading in progress, this is a no-op."
        );
      }

      return;
    }

    setAttempt((currentAttempt) => currentAttempt + 1);
  }, [...deps, stateLoading]);

  return { ...state, retry };
}
/* eslint-enable */

