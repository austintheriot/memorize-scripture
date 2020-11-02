import React, { useEffect, useContext } from 'react';

//App State
import { AudioContext } from '../../app/state/audioContext';
import { useSelector, useDispatch } from 'react-redux';
import { selectText, splitTextClicked } from '../../app/state/textSlice';

//Routing
import { Prompt } from 'react-router';

//Styles
import styles from './Home.module.scss';

//Custom components
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { Controls } from '../../components/Controls/Controls';
import { SmallSpacer } from '../../components/Spacers/Spacers';
import { Footer } from '../../components/Footer/Footer';
import { SearchBible } from '../../components/SearchBible/SearchBible';
import { MostRecent } from './MostRecent/MostRecent';

//Utilities
import { storeClickedLine } from './storage';

//types

export default () => {
	const { textAudio } = useContext(AudioContext);
	const dispatch = useDispatch();

	const text = useSelector(selectText);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const handleSplitTextClick = (
		e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
		i: number
	) => {
		if (text.clickedLine === i) return dispatch(splitTextClicked(-1));
		dispatch(splitTextClicked(i));
		storeClickedLine(i);
	};

	return (
		<ErrorBoundary>
			<Prompt
				message={() => {
					//Pause textAudio when navigating away from Home
					console.log('Leaving Home page. Pausing textAudio.');
					textAudio.pause();
					return true;
				}}
			/>

			<h1 className={styles.h1}>
				{text.book} {text.chapter}
			</h1>
			<div className={styles.searchContainer}>
				<SearchBible />
				<MostRecent />
			</div>
			{text.showCondensed ? (
				<div className={styles.textAreaContainer}>
					{text.condensed.map((line, i) => {
						return (
							<p
								key={line + i.toString()}
								className={
									text.clickedLine === i
										? styles.lineBrokenText
										: styles.condensedLine
								}
								onClick={(
									e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
								) => handleSplitTextClick(e, i)}>
								{text.clickedLine === i ? text.split[i] : text.condensed[i]}
							</p>
						);
					})}
				</div>
			) : (
				<div className={styles.textAreaContainer}>
					<p className={styles.fullText}>{text.body}</p>
				</div>
			)}

			<SmallSpacer />
			<p className={styles.copyright}>Copyright Notice:</p>
			<p className={styles.smallText}>
				Scripture quotations are from the ESV® Bible (The Holy Bible, English
				Standard Version®), copyright © 2001 by Crossway, a publishing ministry
				of Good News Publishers. Used by permission. All rights reserved. You
				may not copy or download more than 500 consecutive verses of the ESV
				Bible or more than one half of any book of the ESV Bible.
			</p>
			<Footer />
			<Controls />
		</ErrorBoundary>
	);
};
