import React, { useEffect, useRef } from 'react';
import styles from './Tools.module.scss';

import { useDispatch } from 'react-redux';
import {
	condenseToolInputChanged,
	condensedTextCopiedSuccess,
	condensedTextCopiedFail,
} from '../../store/textSlice';
import { Footer } from '../../components/Footer/Footer';

import * as clipboard from 'clipboard-polyfill/text';
import { useAppSelector } from 'store/store';

export default () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const { condenseToolOutput, copiedError, copied, condenseToolInput } = useAppSelector((state) => state.text);
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
		clipboard.writeText(condenseToolOutput.join('\n')).then(
			() => {
				dispatch(condensedTextCopiedSuccess());
			},
			(err) => {
				console.log(err);
				dispatch(condensedTextCopiedFail());
			}
		);
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
				value={condenseToolInput}
				onChange={handleChange}
				spellCheck={false}
				className={styles.input}
			/>
			<h2 className={styles.label}>Condensed Text</h2>
			<div className={styles.condensedContainer}>
				<div className={styles.copyButtonContainer}>
					<button
						disabled={condenseToolOutput[0] === '' ? true : false}
						onClick={copyToClipboard}
						className={['button', styles.copyButton].join(' ')}>
						{copiedError
							? `Sorry, couldn't copy...`
							: copied
								? 'Copied!'
								: 'Copy to Clipboard'}
					</button>
				</div>

				{condenseToolOutput[0] === '' ? (
					<p className={styles.condensedPlaceholder}>
						Your condensed text will appear here
					</p>
				) : (
						<p className={styles.condensedText}>
							{condenseToolOutput.join('\n')}
						</p>
					)}
			</div>
			<Footer />
		</>
	);
};
