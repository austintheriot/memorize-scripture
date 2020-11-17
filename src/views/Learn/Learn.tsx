import React, { useEffect, useContext } from 'react';

//App State
import { FirebaseContext } from '../../app/firebaseContext';
import { AudioContext } from '../../app/audioContext';
import { useSelector, useDispatch } from 'react-redux';
import { selectText } from '../../app/textSlice';

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
import { UtilityConfig } from 'app/types';
import { handleKeyPress } from 'app/audioCommands';

//types

export default () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const { analytics } = useContext(FirebaseContext);
	const audioElement = useContext(AudioContext);
	const dispatch = useDispatch();
	const text = useSelector(selectText);
	const config: UtilityConfig = {
		audioElement,
		dispatch,
		analytics,
	};

	return (
		<ErrorBoundary>
			<div
				onKeyDown={(e) => handleKeyPress(e, config)}
				tabIndex={0}
				className={styles.LearnContainer}>
				<Prompt
					message={() => {
						//Pause textAudio when navigating away from Home
						console.log('Leaving Home page. Pausing textAudio.');
						if (audioElement.readyState >= 2) audioElement.pause();
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
				<div className={styles.textAreaContainer} data-testid='text-container'>
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
							<p className={styles.fullText} data-testid='text-original'>
								{text.body}
							</p>
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
