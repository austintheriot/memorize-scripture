import React, { useContext } from 'react';
import styles from './Controls.module.scss';

//State
import { FirebaseContext } from '../../../state/firebaseContext';
import { AudioContext } from '../../../state/audioContext';
import { useSelector, useDispatch } from 'react-redux';
import {
	setAudioIsPlaying,
	setAudioPosition,
	setAudioSpeed,
	selectAudioSettings,
} from '../../../state/audioSlice';
import { setShowCondensed, selectText } from '../../../state/textSlice';

//Custom icons
import flipIcon from '../../../icons/flip.svg';
import beginningIcon from '../../../icons/beginning.svg';
import rewindIcon from '../../../icons/rewind.svg';
import pauseIcon from '../../../icons/pause.svg';
import playIcon from '../../../icons/play.svg';
import forwardIcon from '../../../icons/forward.svg';
import loadingIcon from '../../../icons/loading.svg';
import errorIcon from '../../../icons/error.svg';

//Utilities
import {
	storePlaySpeed,
	storeShowCondensed,
} from '../../../utilities/localStorage';

export const Controls = () => {
	const dispatch = useDispatch();
	const audioSettings = useSelector(selectAudioSettings);
	const text = useSelector(selectText);
	const { textAudio } = useContext(AudioContext);
	const { analytics } = useContext(FirebaseContext);

	const handlePlay = () => {
		analytics.logEvent('play_button_pressed');
		if (textAudio.readyState !== 4) return;
		textAudio.play();
		dispatch(setAudioIsPlaying(true));
	};

	const handlePause = () => {
		analytics.logEvent('pause_buton_pressed');
		if (textAudio.readyState !== 4) return;
		textAudio.pause();
		dispatch(setAudioIsPlaying(false));
	};

	const handleRewind = () => {
		analytics.logEvent('back_button_pressed');
		if (textAudio.readyState !== 4) return;
		const targetTime = Math.max(textAudio.currentTime - 5, 0);
		dispatch(setAudioPosition(targetTime / textAudio.duration));
		textAudio.currentTime = targetTime;
	};

	const handleForward = () => {
		analytics.logEvent('forward_button_pressed');
		if (textAudio.readyState !== 4) return;
		const targetTime = Math.min(
			textAudio.currentTime + 5,
			textAudio.duration - 0.01
		);
		dispatch(setAudioPosition(targetTime / textAudio.duration));
		textAudio.currentTime = targetTime;
	};

	const handleBeginning = () => {
		analytics.logEvent('beginning_button_pressed');
		if (textAudio.readyState !== 4) return;
		textAudio.currentTime = 0;
	};

	const handleProgressClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		e.stopPropagation();
		e.preventDefault();
		const targetTime = e.clientX / document.documentElement.offsetWidth;
		analytics.logEvent('progress_bar_clicked', {
			targetTime,
		});
		dispatch(setAudioPosition(targetTime));
		textAudio.currentTime = textAudio.duration * targetTime;
	};

	const handleProgressTouch = (e: React.TouchEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
		const targetTime =
			e.changedTouches[0].clientX / document.documentElement.offsetWidth;
		analytics.logEvent('progress_bar_touched', {
			targetTime,
		});
		dispatch(setAudioPosition(targetTime));
		textAudio.currentTime = textAudio.duration * targetTime;
	};

	const handleSpeedChange = () => {
		const targetSpeed = Math.max((audioSettings.speed + 0.25) % 2.25, 0.5);
		analytics.logEvent('speed_button_pressed', {
			targetSpeed,
		});
		textAudio.playbackRate = targetSpeed;
		dispatch(setAudioSpeed(targetSpeed));
		storePlaySpeed(targetSpeed);
	};

	const handleViewChange = () => {
		analytics.logEvent('flip_view_button_pressed', {
			showCondensed: text.showCondensed,
		});
		const targetShowCondensed = !text.showCondensed;
		dispatch(setShowCondensed(targetShowCondensed));
		storeShowCondensed(targetShowCondensed);
	};

	return (
		<div className={styles.Controls}>
			{/* PROGRESS BAR */}
			<div
				className={styles.progressBarOuter}
				onMouseDown={handleProgressClick}
				onTouchStart={handleProgressTouch}>
				<div
					className={styles.progressBarInner}
					style={{ width: `${audioSettings.position * 100}%` }}></div>
			</div>

			{/* BUTTON CONTAINER */}
			<div className={styles.buttonContainer}>
				<button
					data-info='playback speed'
					className={styles.playSpeedButton}
					onMouseDown={handleSpeedChange}>
					<p className={styles.icon}>x{audioSettings.speed}</p>
				</button>
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
					data-info='change view'
					className={styles.buttons}
					onMouseDown={handleViewChange}>
					<img src={flipIcon} alt={'change view'} className={styles.icon} />
				</button>
			</div>
		</div>
	);
};
