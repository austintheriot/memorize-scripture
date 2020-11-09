import React, { useEffect, useContext } from 'react';

//App State
import { AudioContext } from '../../app/audioContext';
import { useSelector } from 'react-redux';
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

//types

export default () => {
	const { textAudio } = useContext(AudioContext);
	const text = useSelector(selectText);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

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
		</ErrorBoundary>
	);
};
