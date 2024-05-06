import React from 'react';
import styles from './Memorize.module.scss';
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { SmallSpacer } from '../../components/Spacers/Spacers';
import { Footer } from '../../components/Footer/Footer';
import { SearchBible } from '../../components/SearchBible/SearchBible';
import { MostRecent } from '../../components/MostRecent/MostRecent';
import { TextCondensed } from './TextCondensed/TextCondensed';
import { TextLoading } from '../../components/TextLoading/TextLoading';
import { Copyright } from '../../components/Copyright/Copyright';
import { useAppSelector } from "~/store/store";
import { AudioControls } from "~/components/AudioControls/AudioControls";


const Memorize = () => {
	const { book, chapter, error, loading, condensedState, body } = useAppSelector(s => s.text);

	let textComponent = null;
	if (error) {
		textComponent = (
			<p className={styles.errorMessage}>
				Sorry, there was an error loading this passage.
			</p>
		)
	} else if (loading) {
		textComponent = <TextLoading />;
	} else if (condensedState === 'condensed') {
		textComponent = <TextCondensed />;
	} else if (condensedState === 'plain') {
		textComponent = (
			<p className={styles.fullText} data-testid='text-original'>
				{body}
			</p>
		)
	} else if (condensedState === 'hidden') {
		textComponent = (
			<p className={styles.fullText} data-testid='text-hidden'>
				Text hidden
			</p>
		)
	}

	return (
		<ErrorBoundary>
			<div
				className={styles.LearnContainer}>
				<h1 className={styles.h1}>{`${book}`.replace('Psalms', 'Psalm')} {chapter}</h1>
				<div className={styles.searchContainer}>
					<SearchBible />
					<MostRecent />
				</div>
				<div className={styles.textAreaContainer} data-testid='text-container'>
					{textComponent}
				</div>
				<SmallSpacer />
				<Copyright />
				<Footer />
				<SmallSpacer />
				<AudioControls />
			</div>
		</ErrorBoundary>
	);
};

export default Memorize;