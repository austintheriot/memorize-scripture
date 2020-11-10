import React, { useEffect, useContext } from 'react';

//App State
import { FirebaseContext } from '../../app/firebaseContext';
import { AudioContext } from '../../app/audioContext';
import { useSelector, useDispatch } from 'react-redux';
import { selectText } from '../../app/textSlice';
import {
	spacebarPressed,
	leftArrowPressed,
	rightArrowPressed,
} from '../../app/audioSlice';

//Routing
import { Prompt } from 'react-router';

//Styles
import styles from './Learn.module.scss';

//Custom components
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { Controls } from '../../components/Controls/Controls';
import { SmallSpacer } from '../../components/Spacers/Spacers';
import { Footer } from '../../components/Footer/Footer';
import { SearchBible } from '../../components/SearchBible/SearchBible';
import { MostRecent } from '../../components/MostRecent/MostRecent';
import { TextCondensed } from './TextCondensed/TextCondensed';

//Utilities
import { TextLoading } from '../../components/TextLoading/TextLoading';
import { Copyright } from '../../components/Copyright/Copyright';

//types

export default () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const { analytics } = useContext(FirebaseContext);
	const { textAudio } = useContext(AudioContext);
	const dispatch = useDispatch();
	const text = useSelector(selectText);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const key = e.key;
		console.log(key);
		if (textAudio.readyState !== 4) return;
		if (key === ' ') {
			e.preventDefault();
			analytics.logEvent('space_bar_pressed');
			if (textAudio.paused) {
				textAudio.play();
			} else {
				textAudio.pause();
			}
			dispatch(spacebarPressed());
		}
		if (key === 'ArrowLeft') {
			analytics.logEvent('left_arrow_pressed');
			const targetTime = Math.max(textAudio.currentTime - 5, 0);
			dispatch(leftArrowPressed(targetTime / textAudio.duration));
			textAudio.currentTime = targetTime;
		}
		if (key === 'ArrowRight') {
			analytics.logEvent('right_arrow_pressed');
			const targetTime = Math.min(
				textAudio.currentTime + 5,
				textAudio.duration - 0.01
			);
			dispatch(rightArrowPressed(targetTime / textAudio.duration));
			textAudio.currentTime = targetTime;
		}
	};

	return (
		<ErrorBoundary>
			<div onKeyDown={handleKeyDown} tabIndex={0}>
				<Prompt
					message={() => {
						//Pause textAudio when navigating away from Home
						console.log('Leaving Home page. Pausing textAudio.');
						textAudio.pause();
						return true;
					}}
				/>
				<h1 className={styles.h1}>Learn</h1>
				<div className={styles.searchContainer}>
					<SearchBible />
					<MostRecent />
				</div>
				<h2>
					{text.book} {text.chapter}
				</h2>
				<div className={styles.textAreaContainer}>
					{
						//Error
						text.error ? (
							<p className={styles.errorMessage}>
								Sorry, there was an error loading this passage.
							</p>
						) : //Loading
						text.loading ? (
							<TextLoading />
						) : //Condensed
						text.showCondensed ? (
							<TextCondensed />
						) : (
							//Original
							<p className={styles.fullText}>{text.body}</p>
						)
					}
				</div>
				<SmallSpacer />
				<Copyright />
				<Footer />
				<Controls />
			</div>
		</ErrorBoundary>
	);
};
