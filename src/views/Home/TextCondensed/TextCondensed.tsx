import React from 'react';

//App State
import { useSelector, useDispatch } from 'react-redux';
import { selectText, splitTextClicked } from '../../../app/textSlice';

//Styles
import styles from './TextCondensed.module.scss';

export const TextCondensed = () => {
	const dispatch = useDispatch();
	const text = useSelector(selectText);

	const handleSplitTextClick = (
		e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
		i: number
	) => {
		if (text.clickedLine === i) return dispatch(splitTextClicked(-1));
		dispatch(splitTextClicked(i));
	};

	return (
		<>
			{text.condensed.map((line, i) => {
				return (
					<p
						key={line + i.toString()}
						className={
							text.clickedLine === i ? styles.splitLine : styles.condensedLine
						}
						onClick={(e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) =>
							handleSplitTextClick(e, i)
						}>
						{text.clickedLine === i ? text.split[i] : text.condensed[i]}
					</p>
				);
			})}
		</>
	);
};
