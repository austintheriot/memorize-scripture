import React, { useEffect } from 'react';
import { Prompt } from 'react-router';
import styles from './Learn.module.scss';
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { AudioControls } from '../../components/AudioControls/AudioControls';
import { SmallSpacer } from '../../components/Spacers/Spacers';
import { Footer } from '../../components/Footer/Footer';
import { SearchBible } from '../../components/SearchBible/SearchBible';
import { MostRecent } from '../../components/MostRecent/MostRecent';
import { TextCondensed } from './TextCondensed/TextCondensed';
import { TextLoading } from '../../components/TextLoading/TextLoading';
import { Copyright } from '../../components/Copyright/Copyright';
import { useAudioContext } from 'hooks/useAudioContext';
import { useAppSelector } from 'store/store';


export default () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const { textAudioRef, handleKeyPress } = useAudioContext();
	const { book, chapter, error, loading, showCondensed, body } = useAppSelector(s => s.text);

	let textComponent = null;
	if (error) {
		textComponent = (
			<p className={styles.errorMessage}>
				Sorry, there was an error loading this passage.
			</p>
		)
	} else if (loading) {
		textComponent = <TextLoading />;
	} else if (showCondensed) {
		textComponent = <TextCondensed />;
	} else {
		textComponent = (
			<p className={styles.fullText} data-testid='text-original'>
				{body}
			</p>
		)
	}

	return (
		<ErrorBoundary>
			<div
				onKeyDown={handleKeyPress}
				tabIndex={0}
				className={styles.LearnContainer}>
				<Prompt
					message={() => {
						//Pause textAudio when navigating away from Home
						console.log('Leaving Home page. Pausing textAudio.');
						if (textAudioRef.current.readyState >= 2) textAudioRef.current.pause();
						return true;
					}}
				/>
				<h1 className={styles.h1}>Learn</h1>
				<div className={styles.searchContainer}>
					<SearchBible />
					<MostRecent />
				</div>
				<h2>
					{book} {chapter}
				</h2>
				<div className={styles.textAreaContainer} data-testid='text-container'>
					{textComponent}
				</div>
				<SmallSpacer />
				<Copyright />
				<Footer />
				<AudioControls />
			</div>
		</ErrorBoundary>
	);
};
