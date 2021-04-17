import React from 'react';
import { useDispatch } from 'react-redux';
import { splitTextClicked } from '../../../store/textSlice';
import styles from './TextCondensed.module.scss';
import { useAppSelector } from 'store/store';
import { useFirebaseContext } from 'hooks/useFirebaseContext';

export const TextCondensed = () => {
	const { analytics } = useFirebaseContext();
	const dispatch = useDispatch();
	const { condensed, split, clickedLine } = useAppSelector((state) => state.text);

	const handleSplitTextClick = (
		e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
		i: number
	) => {
		analytics.logEvent('condensed_line_clicked', {
			clickedLine: clickedLine === i ? -1 : clickedLine,
		});
		if (clickedLine === i) return dispatch(splitTextClicked(-1));
		dispatch(splitTextClicked(i));
	};

	return (
		<>
			{condensed.map((line, i) => {
				return (
					<p
						data-testid='text-condensed'
						key={line + i.toString()}
						className={
							clickedLine === i ? styles.splitLine : styles.condensedLine
						}
						onClick={(e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) =>
							handleSplitTextClick(e, i)
						}>
						{clickedLine === i ? split[i] : condensed[i]}
					</p>
				);
			})}
		</>
	);
};
