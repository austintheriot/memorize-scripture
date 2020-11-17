import React, { useContext } from 'react';
import { FirebaseContext } from '../../../app/firebaseContext';

//App State
import { useSelector, useDispatch } from 'react-redux';
import { selectText, splitTextClicked } from '../../../app/textSlice';

//Styles
import styles from './TextCondensed.module.scss';

export const TextCondensed = () => {
	const { analytics } = useContext(FirebaseContext);
	const dispatch = useDispatch();
	const text = useSelector(selectText);

	const handleSplitTextClick = (
		e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
		i: number
	) => {
		analytics.logEvent('condensed_line_clicked', {
			clickedLine: text.clickedLine === i ? -1 : text.clickedLine,
		});
		if (text.clickedLine === i) return dispatch(splitTextClicked(-1));
		dispatch(splitTextClicked(i));
	};

	return (
		<>
			{text.condensed.map((line, i) => {
				return (
					<p
						data-testid='text-condensed'
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
