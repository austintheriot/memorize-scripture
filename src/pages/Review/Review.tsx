import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { userEnteredReviewInput } from '../../store/textSlice';
import styles from './Review.module.scss';
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { SmallSpacer } from '../../components/Spacers/Spacers';
import { Footer } from '../../components/Footer/Footer';
import { SearchBible } from '../../components/SearchBible/SearchBible';
import { MostRecent } from '../../components/MostRecent/MostRecent';
import { Copyright } from '../../components/Copyright/Copyright';
import { Comparison } from './Comparison/Comparison';
import { useAppSelector } from 'store/store';
import { RecordedAudioControls } from 'components/RecordedAudioControls/RecordedAudioControls';

const Review = () => {
	const dispatch = useDispatch();
	const { book, chapter, reviewInput } = useAppSelector((state) => state.text);
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
				{book} {chapter}
			</h2>

			{/* USER INPUT */}
			<label className={styles.textareaLabel} htmlFor="textarea">
				<h3>Input</h3>
			</label>
			<textarea
				id="textarea"
				ref={textarea}
				placeholder={`Enter the text of ${book} ${chapter} here`}
				value={reviewInput}
				onChange={handleChange}
				spellCheck={false}
				className={styles.textarea}
			/>

			{/* RESULTS & STATS*/}
			<Comparison />

			<SmallSpacer />
			<Copyright />
			<Footer />
			<RecordedAudioControls />
		</ErrorBoundary>
	);
};

export default Review;