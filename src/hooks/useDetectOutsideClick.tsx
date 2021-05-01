import { useCallback, useEffect, useRef } from 'react';

/**
 * Runs callback function if user clicks outside of the provided element.
 * This returns a ref: assign this ref to the element which you wish to listen for outside clicks on.
 */
export default function useDetectOutsideClick(
	callback: (...args: any[]) => void,
) {
	const ref = useRef();

	const handleWindowClick = useCallback(
		(e) => {
			const path = e.composedPath();
			if (ref.current && !path.includes(ref.current)) callback();
		},
		[callback],
	);

	useEffect(() => {
		window.addEventListener('click', handleWindowClick);
		return () => window.removeEventListener('click', handleWindowClick);
	}, [handleWindowClick]);

	return ref;
}
