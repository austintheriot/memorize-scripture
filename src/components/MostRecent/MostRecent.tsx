import React, { useContext, useRef } from 'react';

//App State
import { FirebaseContext } from '../../app/firebaseContext';
import { useDispatch } from 'react-redux';
import { textMostRecentPassageClicked } from '../../app/textSlice';

//Styles
import styles from './MostRecent.module.scss';

//Utilities
import { addToTextArray, getTextArray } from '../../app/storage';
import { audioMostRecentPassageClicked } from 'app/audioSlice';

export const MostRecent = () => {
	const { analytics } = useContext(FirebaseContext);
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
			<summary>Most Recent:</summary>
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
