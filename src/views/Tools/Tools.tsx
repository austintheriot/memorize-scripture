import React, { useEffect, useRef } from 'react';
import styles from './Tools.module.scss';

import { useSelector, useDispatch } from 'react-redux';
import { selectText, condenseToolInputChanged } from '../../app/textSlice';
import { Footer } from '../../components/Footer/Footer';

export default () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const text = useSelector(selectText);
	const dispatch = useDispatch();
	const textarea = useRef<HTMLTextAreaElement | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.preventDefault();
		const textareaValue = e.currentTarget.value;
		dispatch(condenseToolInputChanged(textareaValue));
		if (textarea) {
			textarea!.current!.style.height = 'auto';
			textarea!.current!.style.height = `${textarea!.current!.scrollHeight}px`;
		}
	};

	return (
		<>
			<h1 className={styles.h1}>Condense Other Texts:</h1>
			<label htmlFor='input'>
				<h2 className={styles.label}>Input Text</h2>
			</label>
			<textarea
				id='input'
				ref={textarea}
				placeholder={`Enter full text here`}
				value={text.condenseToolInput}
				onChange={handleChange}
				spellCheck={false}
				className={styles.input}
			/>
			<h2 className={styles.label}>Condensed Text</h2>
			<div className={styles.condensedContainer}>
				{text.condenseToolOutput[0] === '' ? (
					<p className={styles.condensedPlaceholder}>
						Your condensed text will appear here
					</p>
				) : (
					<p className={styles.condensedLine}>
						{text.condenseToolOutput.map((line, i) =>
							line === '' ? (
								<br />
							) : (
								<>
									{line}
									<br />
								</>
							)
						)}
					</p>
				)}
			</div>
			<Footer />
		</>
	);
};
