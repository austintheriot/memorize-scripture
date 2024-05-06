import React from "react";
import { useDispatch } from "react-redux";
import { splitTextClicked } from "../../../store/textSlice";
import styles from "./TextCondensed.module.scss";
import { useAppSelector } from "~/store/store";
import FocusRing from "~/components/FocusRing/FocusRing";
import { conditionalStyles } from "~/utils/conditionalStyles";

export const TextCondensed = () => {
	const dispatch = useDispatch();
	const { condensed, split, clickedLine } = useAppSelector(
		(state) => state.text,
	);

	const handleSplitTextClick = (
		_e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		i: number,
	) => {
		if (clickedLine === i) return dispatch(splitTextClicked(-1));
		dispatch(splitTextClicked(i));
	};

	return (
		<>
			{condensed.map((line, i) => {
				return (
					<button
						data-testid="text-condensed"
						key={line + i.toString()}
						className={conditionalStyles([
							styles.TextButton,
							[styles.splitLine, clickedLine === i],
							[styles.condensedLine, clickedLine !== i],
						])}
						onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
							handleSplitTextClick(e, i)
						}
					>
						{clickedLine === i ? split[i] : condensed[i]}
						<FocusRing />
					</button>
				);
			})}
		</>
	);
};
