import { MutableRefObject, useCallback, useEffect, useRef } from "react";

/**
 * Runs callback function if user clicks outside of the provided element.
 * This returns a ref: assign this ref to the element which you wish to listen for outside clicks on.
 */
export default function useDetectOutsideClick<
	El extends HTMLElement | null,
	Exception extends HTMLElement | null | undefined = HTMLElement,
>(
	callback: (...args: unknown[]) => void,
	exceptions: (
		| Exception
		| MutableRefObject<Exception | null | undefined>
	)[] = [],
) {
	const ref = useRef<El | null>(null);

	const handleWindowClick = useCallback(
		(e: MouseEvent) => {
			const path = e.composedPath();
			const clickWasOutside = ref.current && !path.includes(ref.current);
			const hitAnException = exceptions.find((exception) => {
				if (!exception) return false;
				const exceptionEl =
					"current" in exception ? exception.current : exception;
				if (!exceptionEl) return false;
				return path.includes(exceptionEl);
			});
			if (clickWasOutside && !hitAnException) callback();
		},
		[callback, exceptions],
	);

	useEffect(() => {
		window.addEventListener("click", handleWindowClick);
		return () => window.removeEventListener("click", handleWindowClick);
	}, [handleWindowClick]);

	return ref;
}
