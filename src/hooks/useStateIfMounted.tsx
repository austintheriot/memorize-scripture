import {
  Dispatch, SetStateAction, useCallback, useEffect, useRef, useState,
} from 'react';

/**
 * Wrapper around useState that only updates state if the component is still mounted.
 * Useful for updating state after an async operation. Prevents memory leak.
 * @param {*} defaultState
 */
export default function useStateIfMounted<S>(defaultState: S) {
  const isMounted = useRef(true);
  const [state, setState] = useState<S>(defaultState);
  const setStateIfMounted: Dispatch<SetStateAction<S>> = useCallback(
    ((newState) => isMounted.current && setState(newState)), [],
  );
  useEffect(() => () => { if (isMounted.current) isMounted.current = false; }, []);
  return [state, setStateIfMounted] as const;
}
