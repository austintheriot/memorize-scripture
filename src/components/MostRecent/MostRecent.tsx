import React, { useRef } from 'react';

//App State
import { useDispatch } from 'react-redux';
import { textMostRecentPassageClicked } from '../../store/textSlice';

//Styles
import styles from './MostRecent.module.scss';

//Utilities
import { addToTextArray, getTextArray, splitTitleIntoBookAndChapter, TextsObject } from '../../utils/storageUtils';
import { useFirebaseContext } from 'hooks/useFirebaseContext';
import FocusRing from 'components/FocusRing/FocusRing';
import { setAudioUrl } from 'store/searchSlice';

export const MostRecent = () => {
	const { analytics } = useFirebaseContext();
	const dispatch = useDispatch();
	const details = useRef<HTMLDetailsElement | null>(null);

	const handleClickRecent = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		{ title, body }: TextsObject
	) => {
		//Text State
		dispatch(textMostRecentPassageClicked({ title, body }));
		//Audio State
		const { book, chapter } = splitTitleIntoBookAndChapter(title);
		dispatch(setAudioUrl({book, chapter}));
		
		addToTextArray(title, body);
		if (details) details.current?.removeAttribute('open');
		analytics.logEvent('clicked_most_recent', {
			title,
			body,
		});
	};

	const mostRecent = getTextArray();

	return (
		<details
			className={styles.mostRecentContainer}
			ref={details}
			data-testid='most-recent-details'>
			<summary data-testid='most-recent-summary'>
				Most Recent:
				<FocusRing />
				</summary>
			{mostRecent[0].title ? (
				<ul className={styles.mostRecentList}>
				{mostRecent.map((el) => (
					<li key={el.title} className={styles.mostRecentListItem}>
						<button
							aria-label='recent passage'
							className={['button', styles.listButton].join(' ')}
							onClick={(e) => handleClickRecent(e, el)}>
							{el.title}
							<FocusRing />
						</button>
					</li>
				))}
			</ul>
			) : null}
		</details>
	);
};
