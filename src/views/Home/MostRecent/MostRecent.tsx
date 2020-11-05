import React, { useContext } from 'react';

//App State
import { FirebaseContext } from '../../../app/firebaseContext';
import { useDispatch } from 'react-redux';
import { mostRecentPassageClicked } from '../../../app/textSlice';

//Styles
import styles from './MostRecent.module.scss';

//Utilities
import { addToTextArray, getTextArray } from '../storage';

export const MostRecent = () => {
	const { analytics } = useContext(FirebaseContext);
	const dispatch = useDispatch();

	interface TextObject {
		title: string;
		body: string;
	}

	const handleClickRecent = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		{ title, body }: TextObject
	) => {
		dispatch(mostRecentPassageClicked({ title, body }));
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
