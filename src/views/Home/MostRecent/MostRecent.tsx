import React, { useContext } from 'react';

//App State
import { AudioContext } from '../../../app/state/audioContext';
import { FirebaseContext } from '../../../app/state/firebaseContext';
import { useDispatch, useSelector } from 'react-redux';
import { selectText } from '../../../app/state/textSlice';

//Styles
import styles from './MostRecent.module.scss';

//Utilities
import {
	addToTextArray,
	getTextArray,
	splitTitleIntoBookAndChapter,
} from '../storage';
import { updateResults } from '.././updateState';

//types
import { UtilityConfig } from '../../../app/types';

export const MostRecent = () => {
	const { textAudio, setTextAudio } = useContext(AudioContext);
	const { analytics } = useContext(FirebaseContext);
	const text = useSelector(selectText);
	const dispatch = useDispatch();
	const utilityConfig: UtilityConfig = {
		textAudio,
		setTextAudio,
		dispatch,
		analytics,
	};

	interface TextObject {
		title: string;
		body: string;
	}

	const handleClickRecent = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		{ title, body }: TextObject
	) => {
		const { book, chapter } = splitTitleIntoBookAndChapter(title);
		if (text.book === book && text.chapter === chapter) return;
		updateResults(book, chapter, body, utilityConfig);
		addToTextArray(title, body);
		analytics.logEvent('clicked_most_recent', {
			title,
			body,
		});
	};

	return (
		<details className={styles.mostRecentContainer}>
			<summary>Most Recent:</summary>
			{getTextArray()[0].title ? (
				<>
					<ul className={styles.mostRecentList}>
						{getTextArray().map((el) => (
							<li key={el.title} className={styles.mostRecentListItem}>
								<button
									className={['button', styles.listButton].join(' ')}
									onClick={(e) => handleClickRecent(e, el)}>
									{el.title}
								</button>
							</li>
						))}
					</ul>
				</>
			) : null}
		</details>
	);
};
