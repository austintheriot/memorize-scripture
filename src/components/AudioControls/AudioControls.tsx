import React, { useCallback } from 'react';
import styles from './AudioControls.module.scss';
import flipIcon from 'icons/flip.svg';
import beginningIcon from 'icons/beginning.svg';
import rewindIcon from 'icons/rewind.svg';
import pauseIcon from 'icons/pause.svg';
import playIcon from 'icons/play.svg';
import forwardIcon from 'icons/forward.svg';
import loadingIcon from 'icons/loading.svg';
import errorIcon from 'icons/error.svg';
import { useFirebaseContext } from 'hooks/useFirebaseContext';
import { conditionalStyles } from 'utils/conditionalStyles';
import FocusRing from 'components/FocusRing/FocusRing';
import { useAppDispatch, useAppSelector } from 'store/store';
import { toggleCondensedTextView } from 'store/textSlice';
import { useAudio } from 'hooks/useAudio';

export const AudioControls = () => {
	const { analytics } = useFirebaseContext();
	const dispatch = useAppDispatch();
	const {
		recordingState,
		startRecording,
		stopRecording,
		play,
		pause,
		rewind,
		forward,
		speed: audioSpeed,
		position: audioPosition,
		hasError,
		isReady,
		isPlaying,
		beginning,
		setAudioPosition,
		setAudioSpeed,
		deleteRecording,
		usingRecordedAudio,
	} = useAudio();

	const { condensedState } = useAppSelector((state) => state.text);
	const playButtonsDisabled = recordingState === 'recording' || recordingState === 'paused';
	const showDeleteRecordingButton = recordingState === 'inactive' && usingRecordedAudio;

	const handleRecord = useCallback(() => {
		analytics.logEvent('recording_button_clicked');
		if (showDeleteRecordingButton) deleteRecording();
		else if (recordingState === 'recording') stopRecording();
		else startRecording();
	}, [analytics, deleteRecording, recordingState, showDeleteRecordingButton, startRecording, stopRecording])

	const handlePlay = useCallback(() => {
		analytics.logEvent('play_button_clicked');
		play();
	}, [analytics, play]);

	const handlePause = useCallback(() => {
		analytics.logEvent('pause_button_clicked');
		pause();
	}, [analytics, pause]);

	const handleRewind = useCallback(() => {
		analytics.logEvent('back_button_clicked');
		rewind();
	}, [analytics, rewind]);

	const handleForward = useCallback(() => {
		analytics.logEvent('forward_button_clicked');
		forward();
	}, [analytics, forward]);

	const handleBeginning = useCallback(() => {
		analytics.logEvent('beginning_button_clicked');
		beginning();
	}, [analytics, beginning]);

	const handleAudioPositionChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const targetTime: number = Number(e.currentTarget.value);
		setAudioPosition(targetTime);
		analytics.logEvent('progress_bar_clicked', {
			targetTime,
		});
	};

	const handleSpeedChange = useCallback(() => {
		const targetSpeed = Math.max((audioSpeed + 0.25) % 2.25, 0.5);
		setAudioSpeed(targetSpeed);
		analytics.logEvent('speed_button_clicked', {
			targetSpeed,
		});
	}, [analytics, audioSpeed, setAudioSpeed]);

	const handleViewChange = useCallback(() => {
		analytics.logEvent('flip_view_button_clicked', {
			condensedState,
		});
		dispatch(toggleCondensedTextView());
	}, [analytics, dispatch, condensedState]);

	return (
		<div className={styles.Controls}>
			{/* RECORDING CONTROLS  */}
			<div className={styles.recordingContainer}>
				<div>
					<button
						className={conditionalStyles([
							styles.recordingButton,
							[styles.recording, recordingState === 'recording'],
							[styles.deleteRecording, showDeleteRecordingButton],
						])}
						onClick={handleRecord}
						aria-label={
							showDeleteRecordingButton
								? 'delete recording'
								: recordingState === 'recording'
									? 'stop recording'
									: 'start recording'
						}
					>
						<span />
						<span />
						<FocusRing rounded />
					</button>
				</div>
			</div>

			{/* PROGRESS BAR */}
			<input
				aria-label="audio position"
				data-testid="position"
				className={styles.progressBar}
				type="range"
				min="0"
				max="1"
				step="0.000000001"
				value={audioPosition.toString()}
				onChange={handleAudioPositionChange}
				disabled={playButtonsDisabled}
			/>
			<div
				className={styles.progressIndicator}
				style={{ width: `${audioPosition * 100}%` }}
			/>

			{/* BUTTON CONTAINER */}
			<div className={styles.buttonContainer}>
				<button
					aria-label="speed"
					data-info="playback speed"
					data-testid="speed"
					className={styles.playSpeedButton}
					onClick={handleSpeedChange}
					disabled={playButtonsDisabled}
				>
					<p className={styles.icon}>x{audioSpeed}</p>
					<FocusRing />
				</button>
				<button
					aria-label="beginning"
					data-info="skip to beginning"
					data-testid="beginning"
					className={styles.buttons}
					onClick={handleBeginning}
					disabled={playButtonsDisabled}
				>
					<img
						src={beginningIcon}
						alt={'go to beginning'}
						className={styles.icon}
					/>
					<FocusRing />
				</button>

				<button
					aria-label="rewind"
					data-info="back 5s"
					data-testid="rewind"
					className={styles.buttons}
					onClick={handleRewind}
					disabled={playButtonsDisabled}
				>
					<img
						src={rewindIcon}
						alt={'back 5 seconds'}
						className={styles.icon}
					/>
					<FocusRing />
				</button>

				{/* PLAY BUTTON */}
				{hasError ? (
					/* HAS ERROR */
					<button
						data-info="error"
						aria-label="error"
						data-testid="error"
						className={styles.buttons}
						disabled={true}
					>
						<img src={errorIcon} alt={'loading'} className={styles.icon} />
						<FocusRing />
					</button>
				) : isReady ? (
					isPlaying ? (
						/* NO ERROR, IS READY AND PLAYING */
						<button
							aria-label="pause"
							data-info="pause"
							data-testid="pause"
							className={styles.buttons}
							onClick={handlePause}
							disabled={playButtonsDisabled}
						>
							<img src={pauseIcon} alt={'pause'} className={styles.icon} />
							<FocusRing />
						</button>
					) : (
						/* NO ERROR, IS READY AND PAUSED */
						<button
							aria-label="play"
							data-info="play"
							data-testid="play"
							className={styles.buttons}
							onClick={handlePlay}
							disabled={playButtonsDisabled}
						>
							<img src={playIcon} alt={'play'} className={styles.icon} />
							<FocusRing />
						</button>
					)
				) : (
					/* NO ERROR, IS NOT READY (LOADING) */
					<button
						data-info="loading"
						aria-label="loading"
						data-testid="loading"
						className={styles.buttons}
						disabled={true}
					>
						<img src={loadingIcon} alt={'loading'} className={styles.loading} />
						<FocusRing />
					</button>
				)}
				<button
					data-info="forward 5s"
					aria-label="forward"
					data-testid="forward"
					className={styles.buttons}
					onClick={handleForward}
					disabled={playButtonsDisabled}
				>
					<img src={forwardIcon} alt={'forward 5s'} className={styles.icon} />
					<FocusRing />
				</button>
				<button
					data-testid="flip"
					data-info="change view"
					className={styles.buttons}
					onClick={handleViewChange}
				>
					<img src={flipIcon} alt={'change view'} className={styles.icon} />
					<FocusRing />
				</button>
			</div>
		</div>
	);
};
