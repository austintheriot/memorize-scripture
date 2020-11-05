import React, { useContext, useState, useEffect } from 'react';
import styles from './RecordingControls.module.scss';

//State
import { FirebaseContext } from '../../../app/firebaseContext';
import { RecordingContext } from '../../../app/recordingContext';
import { useSelector, useDispatch } from 'react-redux';
import {
	selectRecordingSettings,
	rewindButtonClicked,
	forwardButtonClicked,
	playButtonClicked,
	pauseButtonClicked,
	speedButtonClicked,
	progressBarClicked,
	recordingStarted,
	recordingStopped,
} from '../../../app/recordingSlice';

import { ProgressBar } from '../../../components/ProgressBar/ProgressBar';

//Custom icons
import beginningIcon from '../../../icons/beginning.svg';
import rewindIcon from '../../../icons/rewind.svg';
import pauseIcon from '../../../icons/pause.svg';
import playIcon from '../../../icons/play.svg';
import forwardIcon from '../../../icons/forward.svg';
import loadingIcon from '../../../icons/loading.svg';
import errorIcon from '../../../icons/error.svg';

//Utilities
import { storePlaySpeed } from '../../../app/storage';

export const RecordingControls = () => {
	const dispatch = useDispatch();
	const recordingSettings = useSelector(selectRecordingSettings);
	const {
		recordedAudio,
		setRecordedAudio,
		mediaRecorder,
		setMediaRecorder,
	} = useContext(RecordingContext);
	const { analytics } = useContext(FirebaseContext);
	const [recordedAudioChunks, setRecordedAudioChunks] = useState<BlobPart[]>(
		[]
	);

	const handlePlay = () => {
		analytics.logEvent('recording_play_button_pressed');
		if (recordedAudio.readyState !== 4) return;
		recordedAudio.play();
		dispatch(playButtonClicked());
	};

	const handlePause = () => {
		analytics.logEvent('recording_pause_buton_pressed');
		if (recordedAudio.readyState !== 4) return;
		recordedAudio.pause();
		dispatch(pauseButtonClicked());
	};

	const handleRewind = () => {
		analytics.logEvent('recording_back_button_pressed');
		if (recordedAudio.readyState !== 4) return;
		const targetTime = Math.max(recordedAudio.currentTime - 5, 0);
		dispatch(rewindButtonClicked(targetTime / recordedAudio.duration));
		recordedAudio.currentTime = targetTime;
	};

	const handleAudioPositionChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (recordedAudio.readyState !== 4) return;
		const targetTime: number = Number(e.currentTarget.value);
		analytics.logEvent('recording_progress_bar_clicked', {
			targetTime,
		});
		dispatch(progressBarClicked(targetTime));
		recordedAudio.currentTime = recordedAudio.duration * targetTime;
	};

	const handleForward = () => {
		analytics.logEvent('recording_forward_button_pressed');
		if (recordedAudio.readyState !== 4) return;
		const targetTime = Math.min(
			recordedAudio.currentTime + 5,
			recordedAudio.duration - 0.01
		);
		dispatch(forwardButtonClicked(targetTime / recordedAudio.duration));
		recordedAudio.currentTime = targetTime;
	};

	const handleBeginning = () => {
		analytics.logEvent('recording_beginning_button_pressed');
		if (recordedAudio.readyState !== 4) return;
		recordedAudio.currentTime = 0;
	};

	const handleSpeedChange = () => {
		const targetSpeed = Math.max((recordingSettings.speed + 0.25) % 2.25, 0.5);
		analytics.logEvent('recording_speed_button_pressed', {
			targetSpeed,
		});
		recordedAudio.playbackRate = targetSpeed;
		dispatch(speedButtonClicked(targetSpeed));
		storePlaySpeed(targetSpeed);
	};

	const initMediaRecorderEventListeners = (mediaRecorder: MediaRecorder) => {
		mediaRecorder.addEventListener('dataavailable', (e) => {
			console.log('Audio data being pushed to chunk');
			setRecordedAudioChunks((prevState) => {
				const newRecordedAudioChunks = [...prevState];
				newRecordedAudioChunks.push(e.data);
				console.log(e.data);
				return newRecordedAudioChunks;
			});
		});

		mediaRecorder.addEventListener('stop', () => {
			console.log('Recording stopped');
			const recordedAudioBlob = new Blob(recordedAudioChunks, {
				type: 'audio/ogg; codecs=opus',
			});
			const recordedAudioURL = URL.createObjectURL(recordedAudioBlob);
			const recordedAudio = new Audio(recordedAudioURL);
			setRecordedAudio(recordedAudio);
		});
	};

	const stopRecording = () => {
		if (mediaRecorder == null) return;
		mediaRecorder.stop();
		console.log('Stopping recording');
		dispatch(recordingStopped());
	};

	const startRecording = () => {
		if (mediaRecorder == null) return;
		mediaRecorder.start();
		console.log('Starting recording');
		dispatch(recordingStarted());
	};

	const handleRecordingButtonClick = () => {
		console.log('Record button clicked');
		//Stop Recording
		if (mediaRecorder && mediaRecorder.state === 'recording') {
			stopRecording();
		}

		//Start Recording
		else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			console.log('getUserMedia() function is supported');
			console.log('Requesting permission to record audio');
			navigator.mediaDevices
				.getUserMedia({ audio: true })
				.then((stream) => {
					console.log('Audio Recording Enabled');
					const mediaRecorder = new MediaRecorder(stream);
					initMediaRecorderEventListeners(mediaRecorder);
					setMediaRecorder(mediaRecorder);
				})
				.catch((err) => {
					console.log('Audio Recording Disabled');
					console.log(err);
					setMediaRecorder(null);
					return err;
				});
		} else {
			console.log('getUserMedia() function is not supported.');
		}
	};

	//Once new mediaRecorder is instantiated,
	//Begin recording
	useEffect(() => {
		console.log('!!!!!', mediaRecorder?.state);
		if (mediaRecorder == null || mediaRecorder.state === 'recording') return;
		startRecording();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mediaRecorder]);

	return (
		<div className={styles.Controls}>
			{/* RECORDING BUTTON */}
			<div className={styles.recordingContainer}>
				<button
					onClick={() => handleRecordingButtonClick()}
					aria-label='record'
					className={['button', styles.recordingButton].join(' ')}>
					<div
						className={[
							styles.recordingButtonIcon,
							recordingSettings.isRecording ? styles.recordingTrue : '',
						].join(' ')}></div>
				</button>
			</div>

			{/* PROGRESS BAR */}
			<ProgressBar handleClick={handleAudioPositionChange} />

			{/* BUTTON CONTAINER */}
			<div className={styles.buttonContainer}>
				<button
					data-info='skip to beginning'
					className={styles.buttons}
					onMouseDown={handleBeginning}>
					<img
						src={beginningIcon}
						alt={'go to beginning'}
						className={styles.icon}
					/>
				</button>

				<button
					data-info='back 5s'
					className={styles.buttons}
					onMouseDown={handleRewind}>
					<img
						src={rewindIcon}
						alt={'back 5 seconds'}
						className={styles.icon}
					/>
				</button>

				{/* PLAY BUTTON */}
				{recordingSettings.hasError ? (
					/* HAS ERROR */
					<button data-info='error' className={styles.buttons} disabled={true}>
						<img src={errorIcon} alt={'loading'} className={styles.icon} />
					</button>
				) : recordingSettings.isReady ? (
					recordingSettings.isPlaying ? (
						/* NO ERROR, IS READY AND PLAYING */
						<button
							data-info='pause'
							className={styles.buttons}
							onMouseDown={handlePause}>
							<img src={pauseIcon} alt={'pause'} className={styles.icon} />
						</button>
					) : (
						/* NO ERROR, IS READY AND PAUSED */
						<button
							data-info='play'
							className={styles.buttons}
							onMouseDown={handlePlay}>
							<img src={playIcon} alt={'play'} className={styles.icon} />
						</button>
					)
				) : (
					/* NO ERROR, IS NOT READY (LOADING) */
					<button
						data-info='loading'
						className={styles.buttons}
						disabled={true}>
						<img src={loadingIcon} alt={'loading'} className={styles.loading} />
					</button>
				)}
				<button
					data-info='forward 5s'
					className={styles.buttons}
					onMouseDown={handleForward}>
					<img src={forwardIcon} alt={'forward 5s'} className={styles.icon} />
				</button>
				<button
					data-info='playback speed'
					className={styles.playSpeedButton}
					onMouseDown={handleSpeedChange}>
					<p className={styles.icon}>x{recordingSettings.speed}</p>
				</button>
			</div>
		</div>
	);
};
