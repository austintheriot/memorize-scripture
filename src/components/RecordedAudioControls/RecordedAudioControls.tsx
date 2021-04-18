import React from 'react';
import styles from './RecordedAudioControls.module.scss';
import flipIcon from 'icons/flip.svg';
import beginningIcon from 'icons/beginning.svg';
import rewindIcon from 'icons/rewind.svg';
import pauseIcon from 'icons/pause.svg';
import playIcon from 'icons/play.svg';
import forwardIcon from 'icons/forward.svg';
import loadingIcon from 'icons/loading.svg';
import errorIcon from 'icons/error.svg';
import { useFirebaseContext } from 'hooks/useFirebaseContext';
import { useRecordedAudio } from 'hooks/useAudioRecorder';

export const RecordedAudioControls = () => {
	const { analytics } = useFirebaseContext();
	const {
		url,
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
	} = useRecordedAudio();

	const handlePlay = () => {
		analytics.logEvent('play_button_clicked');
		play();
	};

	const handlePause = () => {
		analytics.logEvent('pause_buton_clicked');
		pause();
	};

	const handleRewind = () => {
		analytics.logEvent('back_button_clicked');
		rewind();
	};

	const handleForward = () => {
		analytics.logEvent('forward_button_clicked');
		forward();
	};

	const handleBeginning = () => {
		analytics.logEvent('beginning_button_clicked');
		beginning();
	};

	const handleAudioPositionChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const targetTime: number = Number(e.currentTarget.value);
		setAudioPosition(targetTime);
		analytics.logEvent('progress_bar_clicked', {
			targetTime,
		});
	};

	const handleSpeedChange = () => {
		const targetSpeed = Math.max((audioSpeed + 0.25) % 2.25, 0.5);
		setAudioSpeed(targetSpeed);
		analytics.logEvent('speed_button_clicked', {
			targetSpeed,
		});
	};

	const handleViewChange = () => {
		// analytics.logEvent('flip_view_button_clicked', {
		// 	showCondensed: showCondensed,
		// });
		// const targetShowCondensed = !showCondensed;
		// dispatch(viewChangeButtonClicked(targetShowCondensed));
		// storeShowCondensed(targetShowCondensed);
	};

	return (
		<div className={styles.Controls}>
			{/* RECORDING CONTROLS  */}
			<div className={styles.recordingContainer}>
				<div>
					<button />
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
					onMouseDown={handleSpeedChange}
				>
					<p className={styles.icon}>x{audioSpeed}</p>
				</button>
				<button
					aria-label="beginning"
					data-info="skip to beginning"
					data-testid="beginning"
					className={styles.buttons}
					onMouseDown={handleBeginning}
				>
					<img
						src={beginningIcon}
						alt={'go to beginning'}
						className={styles.icon}
					/>
				</button>

				<button
					aria-label="rewind"
					data-info="back 5s"
					data-testid="rewind"
					className={styles.buttons}
					onMouseDown={handleRewind}
				>
					<img
						src={rewindIcon}
						alt={'back 5 seconds'}
						className={styles.icon}
					/>
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
					</button>
				) : isReady ? (
					isPlaying ? (
						/* NO ERROR, IS READY AND PLAYING */
						<button
							aria-label="pause"
							data-info="pause"
							data-testid="pause"
							className={styles.buttons}
							onMouseDown={handlePause}
						>
							<img src={pauseIcon} alt={'pause'} className={styles.icon} />
						</button>
					) : (
							/* NO ERROR, IS READY AND PAUSED */
							<button
								aria-label="play"
								data-info="play"
								data-testid="play"
								className={styles.buttons}
								onMouseDown={handlePlay}
							>
								<img src={playIcon} alt={'play'} className={styles.icon} />
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
							</button>
						)}
				<button
					data-info="forward 5s"
					aria-label="forward"
					data-testid="forward"
					className={styles.buttons}
					onMouseDown={handleForward}
				>
					<img src={forwardIcon} alt={'forward 5s'} className={styles.icon} />
				</button>
				<button
					data-testid="flip"
					data-info="change view"
					className={styles.buttons}
					onMouseDown={handleViewChange}
				>
					<img src={flipIcon} alt={'change view'} className={styles.icon} />
				</button>
			</div>
		</div>
	);
};
