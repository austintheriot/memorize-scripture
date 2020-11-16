import React, { useContext } from 'react';
import styles from './Controls.module.scss';

//State
import { FirebaseContext } from 'app/firebaseContext';
import { AudioContext } from 'app/audioContext';
import { useSelector, useDispatch } from 'react-redux';
import { selectAudioSettings } from 'app/audioSlice';
import {
	play,
	pause,
	rewind,
	forward,
	beginning,
	position,
	speed,
} from 'app/audioCommands';
import { selectText, viewChangeButtonClicked } from 'app/textSlice';

//Custom icons
import flipIcon from 'icons/flip.svg';
import beginningIcon from 'icons/beginning.svg';
import rewindIcon from 'icons/rewind.svg';
import pauseIcon from 'icons/pause.svg';
import playIcon from 'icons/play.svg';
import forwardIcon from 'icons/forward.svg';
import loadingIcon from 'icons/loading.svg';
import errorIcon from 'icons/error.svg';

//Utilities
import { storeShowCondensed } from '../../app/storage';
import { UtilityConfig } from 'app/types';

export const Controls = () => {
	const dispatch = useDispatch();
	const audioSettings = useSelector(selectAudioSettings);
	const text = useSelector(selectText);
	const { textAudio, setTextAudio } = useContext(AudioContext);
	const { analytics } = useContext(FirebaseContext);

	const config: UtilityConfig = {
		textAudio,
		setTextAudio,
		analytics,
		dispatch,
	};

	const handlePlay = () => {
		analytics.logEvent('play_button_clicked');
		play(config);
	};

	const handlePause = () => {
		analytics.logEvent('pause_buton_clicked');
		pause(config);
	};

	const handleRewind = () => {
		analytics.logEvent('back_button_clicked');
		rewind(config);
	};

	const handleForward = () => {
		analytics.logEvent('forward_button_clicked');
		forward(config);
	};

	const handleBeginning = () => {
		analytics.logEvent('beginning_button_clicked');
		beginning(config);
	};

	const handleAudioPositionChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const targetTime: number = Number(e.currentTarget.value);
		position(config, targetTime);
		analytics.logEvent('progress_bar_clicked', {
			targetTime,
		});
	};

	const handleSpeedChange = () => {
		const targetSpeed = Math.max((audioSettings.speed + 0.25) % 2.25, 0.5);
		speed(config, targetSpeed);
		analytics.logEvent('speed_button_clicked', {
			targetSpeed,
		});
	};

	const handleViewChange = () => {
		analytics.logEvent('flip_view_button_clicked', {
			showCondensed: text.showCondensed,
		});
		const targetShowCondensed = !text.showCondensed;
		dispatch(viewChangeButtonClicked(targetShowCondensed));
		storeShowCondensed(targetShowCondensed);
	};

	return (
		<div className={styles.Controls}>
			{/* PROGRESS BAR */}
			<input
				aria-label='audio position'
				className={styles.progressBar}
				type='range'
				min='0'
				max='1'
				step='0.000000001'
				value={audioSettings.position.toString()}
				onChange={handleAudioPositionChange}
			/>
			<div
				className={styles.progressIndicator}
				style={{ width: `${audioSettings.position * 100}%` }}
			/>

			{/* BUTTON CONTAINER */}
			<div className={styles.buttonContainer}>
				<button
					aria-label='speed'
					data-info='playback speed'
					className={styles.playSpeedButton}
					onMouseDown={handleSpeedChange}>
					<p className={styles.icon}>x{audioSettings.speed}</p>
				</button>
				<button
					aria-label='beginning'
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
					aria-label='rewind'
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
					<button
						data-info='error'
						aria-label='error'
						className={styles.buttons}
						disabled={true}>
						<img src={errorIcon} alt={'loading'} className={styles.icon} />
					</button>
				) : audioSettings.isReady ? (
					audioSettings.isPlaying ? (
						/* NO ERROR, IS READY AND PLAYING */
						<button
							aria-label='pause'
							data-info='pause'
							className={styles.buttons}
							onMouseDown={handlePause}>
							<img src={pauseIcon} alt={'pause'} className={styles.icon} />
						</button>
					) : (
						/* NO ERROR, IS READY AND PAUSED */
						<button
							aria-label='play'
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
						aria-label='loading'
						className={styles.buttons}
						disabled={true}>
						<img src={loadingIcon} alt={'loading'} className={styles.loading} />
					</button>
				)}
				<button
					data-info='forward 5s'
					aria-label='forward'
					className={styles.buttons}
					onMouseDown={handleForward}>
					<img src={forwardIcon} alt={'forward 5s'} className={styles.icon} />
				</button>
				<button
					aria-label={
						text.showCondensed ? 'show original text' : 'show condensed text'
					}
					data-info='change view'
					className={styles.buttons}
					onMouseDown={handleViewChange}>
					<img src={flipIcon} alt={'change view'} className={styles.icon} />
				</button>
			</div>
		</div>
	);
};
