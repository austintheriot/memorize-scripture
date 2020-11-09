import React, { useState, useEffect, useRef } from 'react';

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
	const textarea = useRef<HTMLTextAreaElement | null>(null);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const handleChange = () => {
		if (textarea) {
			textarea!.current!.style.height = 'auto';
			textarea!.current!.style.height = `${textarea!.current!.scrollHeight}px`;
		}
	};

	return (
		<ErrorBoundary>
			<h1 className={styles.h1}>Review</h1>
			<div className={styles.searchContainer}>
				<SearchBible />
				<MostRecent />
			</div>
			<h2>
				{text.book} {text.chapter}
			</h2>
			<div className={styles.textAreaContainer}>
				<textarea
					ref={textarea}
					onChange={handleChange}
					className={styles.textarea}></textarea>
			</div>
			<SmallSpacer />
			<Copyright />
			<Footer />
		</ErrorBoundary>
	);
};
