import React, { useEffect, useRef } from 'react';
import styles from './Tools.module.scss';

import { useSelector, useDispatch } from 'react-redux';
import {
	selectText,
	condenseToolInputChanged,
	copyButtonClicked,
} from '../../app/textSlice';
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

	const copyToClipboard = () => {
		try {
			navigator.clipboard.writeText(text.condenseToolOutput.join('\n'));
			dispatch(copyButtonClicked());
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<h1 className={styles.h1}>Condense Texts:</h1>
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
				{navigator.clipboard && (
					<div className={styles.copyButtonContainer}>
						<button
							disabled={text.condenseToolOutput[0] === '' ? true : false}
							onClick={copyToClipboard}
							className={['button', styles.copyButton].join(' ')}>
							{text.copied ? 'Copied!' : 'Copy to Clipboard'}
						</button>
					</div>
				)}
				{text.condenseToolOutput[0] === '' ? (
					<p className={styles.condensedPlaceholder}>
						Your condensed text will appear here
					</p>
				) : (
					<p className={styles.condensedText}>
						{text.condenseToolOutput.join('\n')}
					</p>
				)}
			</div>
			<Footer />
		</>
	);
};
