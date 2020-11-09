import React, { useEffect } from 'react';

//App State
import { useSelector } from 'react-redux';
import { selectText } from '../../app/textSlice';

//Styles
import styles from './Review.module.scss';

//Custom components
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { SmallSpacer } from '../../components/Spacers/Spacers';
import { Footer } from '../../components/Footer/Footer';
import { SearchBible } from '../../components/SearchBible/SearchBible';
import { MostRecent } from '../../components/MostRecent/MostRecent';

//Utilities
import { TextLoading } from '../../components/TextLoading/TextLoading';
import { Copyright } from '../../components/Copyright/Copyright';

//types

export default () => {
	const text = useSelector(selectText);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<ErrorBoundary>
			<h1 className={styles.h1}>
				{text.book} {text.chapter}
			</h1>
			<div className={styles.searchContainer}>
				<SearchBible />
				<MostRecent />
			</div>
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
					) : (
						//Original
						<p className={styles.fullText}>{text.body}</p>
					)
				}
			</div>
			<SmallSpacer />
			<Copyright />
			<Footer />
		</ErrorBoundary>
	);
};
