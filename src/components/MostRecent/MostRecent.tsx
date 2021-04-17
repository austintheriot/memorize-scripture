import React, { useContext, useRef } from 'react';

//App State
import { useDispatch } from 'react-redux';
import { textMostRecentPassageClicked } from '../../store/textSlice';

//Styles
import styles from './MostRecent.module.scss';

//Utilities
import { addToTextArray, getTextArray } from '../../utils/storageUtils';
import { audioMostRecentPassageClicked } from 'store/audioSlice';
import { useFirebaseContext } from 'hooks/useFirebaseContext';

export const MostRecent = () => {
	const { analytics } = useFirebaseContext();
	const dispatch = useDispatch();
	const details = useRef<HTMLDetailsElement | null>(null);

	interface TextObject {
		title: string;
		body: string;
	}

	const handleClickRecent = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		{ title, body }: TextObject
	) => {
		//Text State
		dispatch(textMostRecentPassageClicked({ title, body }));
		//Audio State State
		dispatch(audioMostRecentPassageClicked(title));
		addToTextArray(title, body);
		if (details) details.current?.removeAttribute('open');
		analytics.logEvent('clicked_most_recent', {
			title,
			body,
		});
	};

	return (
		<details
			className={styles.mostRecentContainer}
			ref={details}
			data-testid='most-recent-details'>
			<summary data-testid='most-recent-summary'>Most Recent:</summary>
			{getTextArray()[0].title ? (
				<>
					<ul className={styles.mostRecentList}>
						{getTextArray().map((el) => (
							<li key={el.title} className={styles.mostRecentListItem}>
								<button
									aria-label='recent passage'
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
