import React, {
	useEffect,
	useRef,
	ChangeEvent,
	useState,
	useCallback,
} from 'react';

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
	const dispatch = useDispatch();
	const text = useSelector(selectText);
	const textarea = useRef<HTMLTextAreaElement | null>(null);
	
	// updates the DOM with a new audio recording
	const [audioSrc, setAudioSrc] = useState<string | null>(null);
	const chunks = useRef<Blob[]>([]);
	const mediaRecorder = useRef<MediaRecorder | null>();

	// stop recording
	const stopRecording = useCallback(() => {
		if (mediaRecorder?.current?.state && mediaRecorder.current.state !== 'inactive') {
			mediaRecorder.current.stop();
		}
	}, []);

	// pause any existing playback
	// delete any existing saved data
	const deleteRecording = useCallback(() => {
		stopRecording();
		chunks.current = [];
		setAudioSrc(null);
	}, [stopRecording]);

	// pause any existing playback
	// delete any existing saved data
	// start recording
	const startRecording = useCallback(() => {
		deleteRecording();
		if (mediaRecorder?.current?.state && mediaRecorder?.current?.state !== 'recording') {
			mediaRecorder.current.start();
		}
	}, [deleteRecording]);

	// typically called after recording or stops or when a
	// blob becomes large enough to save
	const onDataAvailable = useCallback((e: BlobEvent) => {
		chunks.current.push(e.data);
	}, []);

	const onStop = useCallback(() => {
		const blob = new Blob(chunks.current, { type: 'audio/ogg; codecs=opus' });
		const audioURL = window.URL.createObjectURL(blob);
		setAudioSrc(audioURL);
	}, []);

	const initStream = useCallback(async () => {
		try {
			if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
				console.log('getUserMedia supported.');
				const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
				const newMediaRecorder = new MediaRecorder(stream);
				newMediaRecorder.ondataavailable = onDataAvailable;
				newMediaRecorder.onstop = onStop;
				mediaRecorder.current = newMediaRecorder;
			} else {
				console.log('getUserMedia not supported on your browser!');
			}
		} catch (err) {
				console.log(err);
				alert('Sorry, audio recording is not supported by your browser.');
		}
	}, [onDataAvailable, onStop]);

	/* Set up audio stream for recording */
	useEffect(() => {
		initStream();
	}, [initStream]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

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
			<div>
				<button type='button' onClick={startRecording}>
					Start Recording
				</button>
				<button type='button' onClick={stopRecording}>
					Stop Recording
				</button>
				<button type='button' onClick={deleteRecording}>
					Delete Recording
				</button>
				{audioSrc && <audio src={audioSrc} controls />}
			</div>
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
