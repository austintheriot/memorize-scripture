import React, { useEffect, useRef, ChangeEvent } from 'react';

//App State
import { useSelector, useDispatch } from 'react-redux';
import { selectText, userEnteredReviewInput } from '../../app/textSlice';

//Styles
import styles from './Review.module.scss';

//Custom components
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { SmallSpacer } from '../../components/Spacers/Spacers';
import { Footer } from '../../components/Footer/Footer';
import { SearchBible } from '../../components/SearchBible/SearchBible';
import { MostRecent } from '../../components/MostRecent/MostRecent';

//Utilities
import { Copyright } from '../../components/Copyright/Copyright';
import { Comparison } from './Comparison/Comparison';

//types

export default () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const dispatch = useDispatch();
	const text = useSelector(selectText);
	const textarea = useRef<HTMLTextAreaElement | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.preventDefault();
		const textareaValue = e.currentTarget.value;
		dispatch(userEnteredReviewInput(textareaValue));
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

			{/* USER INPUT */}
			<label className={styles.textareaLabel} htmlFor='textarea'>
				<h3>Input</h3>
			</label>
			<textarea
				id='textarea'
				ref={textarea}
				placeholder={`Enter the text of ${text.book} ${text.chapter} here`}
				value={text.reviewInput}
				onChange={handleChange}
				spellCheck={false}
				className={styles.textarea}
			/>

			{/* RESULTS & STATS*/}
			<Comparison />

			<SmallSpacer />
			<Copyright />
			<Footer />
		</ErrorBoundary>
	);
};
