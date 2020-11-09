import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

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
import { Copyright } from '../../components/Copyright/Copyright';
import { Comparison } from './Comparison';

//types

export default () => {
	const text = useSelector(selectText);
	const textarea = useRef<HTMLTextAreaElement | null>(null);
	const [textareaValue, setTextareaValue] = useState('');

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.preventDefault();
		const textareaValue = e.currentTarget.value;
		setTextareaValue(textareaValue);
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

			<label className={styles.textareaLabel} htmlFor='textarea'>
				<h3>Input</h3>
			</label>
			<textarea
				id='textarea'
				ref={textarea}
				placeholder='Enter your text here'
				value={textareaValue}
				onChange={handleChange}
				spellCheck={false}
				className={styles.textarea}
			/>

			<Comparison bible={text.body} input={textareaValue} />

			<SmallSpacer />
			<Copyright />
			<Footer />
		</ErrorBoundary>
	);
};
