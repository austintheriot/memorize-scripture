import { useRef, useEffect } from 'react';

/**
 * Stores a value and returns the previous value when a component re-renders.
 */
export const usePrevious = <T>(value: T) => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;
