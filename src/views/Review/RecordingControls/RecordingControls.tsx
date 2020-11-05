import React, { useContext } from 'react';
import styles from './RecordingControls.module.scss';

//State
import { FirebaseContext } from '../../../app/firebaseContext';
import { AudioContext } from '../../../app/audioContext';
import { useSelector, useDispatch } from 'react-redux';
import {
	selectAudioSettings,
	rewindButtonClicked,
	forwardButtonClicked,
	playButtonClicked,
	pauseButtonClicked,
	speedButtonClicked,
	progressBarClicked,
} from '../../../app/audioSlice';

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
	const audioSettings = useSelector(selectAudioSettings);
	const { textAudio } = useContext(AudioContext);
	const { analytics } = useContext(FirebaseContext);

	const handlePlay = () => {
		analytics.logEvent('play_button_pressed');
		if (textAudio.readyState !== 4) return;
		textAudio.play();
		dispatch(playButtonClicked());
	};

	const handlePause = () => {
		analytics.logEvent('pause_buton_pressed');
		if (textAudio.readyState !== 4) return;
		textAudio.pause();
		dispatch(pauseButtonClicked());
	};

	const handleRewind = () => {
		analytics.logEvent('back_button_pressed');
		if (textAudio.readyState !== 4) return;
		const targetTime = Math.max(textAudio.currentTime - 5, 0);
		dispatch(rewindButtonClicked(targetTime / textAudio.duration));
		textAudio.currentTime = targetTime;
	};

	const handleAudioPositionChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const targetTime: number = Number(e.currentTarget.value);
		analytics.logEvent('progress_bar_clicked', {
			targetTime,
		});
		dispatch(progressBarClicked(targetTime));
		textAudio.currentTime = textAudio.duration * targetTime;
	};

	const handleForward = () => {
		analytics.logEvent('forward_button_pressed');
		if (textAudio.readyState !== 4) return;
		const targetTime = Math.min(
			textAudio.currentTime + 5,
			textAudio.duration - 0.01
		);
		dispatch(forwardButtonClicked(targetTime / textAudio.duration));
		textAudio.currentTime = targetTime;
	};

	const handleBeginning = () => {
		analytics.logEvent('beginning_button_pressed');
		if (textAudio.readyState !== 4) return;
		textAudio.currentTime = 0;
	};

	const handleSpeedChange = () => {
		const targetSpeed = Math.max((audioSettings.speed + 0.25) % 2.25, 0.5);
		analytics.logEvent('speed_button_pressed', {
			targetSpeed,
		});
		textAudio.playbackRate = targetSpeed;
		dispatch(speedButtonClicked(targetSpeed));
		storePlaySpeed(targetSpeed);
	};

	return (
		<div className={styles.Controls}>
			{/* RECORDING BUTTON */}
			<div className={styles.recordingContainer}>
				<button
					aria-label='record'
					className={['button', styles.recordingButton].join(' ')}>
					<div
						className={[
							styles.recordingButtonIcon,
							'styles.recordingTrue',
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
				{audioSettings.hasError ? (
					/* HAS ERROR */
					<button data-info='error' className={styles.buttons} disabled={true}>
						<img src={errorIcon} alt={'loading'} className={styles.icon} />
					</button>
				) : audioSettings.isReady ? (
					audioSettings.isPlaying ? (
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
					<p className={styles.icon}>x{audioSettings.speed}</p>
				</button>
			</div>
		</div>
	);
};
