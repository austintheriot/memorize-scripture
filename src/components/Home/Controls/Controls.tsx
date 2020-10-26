import React from 'react';
import styles from './Controls.module.scss';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectAudioSettings } from '../../../state/audioSlice';

//Custom icons
import flipIcon from '../../../icons/flip.svg';
import beginningIcon from '../../../icons/beginning.svg';
import rewindIcon from '../../../icons/rewind.svg';
import pauseIcon from '../../../icons/pause.svg';
import playIcon from '../../../icons/play.svg';
import forwardIcon from '../../../icons/forward.svg';
import loadingIcon from '../../../icons/loading.svg';
import errorIcon from '../../../icons/error.svg';

export const Controls = (props: {
	progressClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	speedChange: () => void;
	beginning: () => void;
	rewind: () => void;
	pause: () => void;
	play: () => void;
	forward: () => void;
	flipView: () => void;
}) => {
	const audioSettings = useSelector(selectAudioSettings);

	return (
		<div className={styles.Controls}>
			{/* PROGRESS BAR */}
			<div
				className={styles.progressBarOuter}
				onMouseDown={props.progressClick}>
				<div
					className={styles.progressBarInner}
					style={{ width: `${audioSettings.position * 100}%` }}></div>
			</div>

			{/* BUTTON CONTAINER */}
			<div className={styles.buttonContainer}>
				<button
					data-info='playback speed'
					className={styles.playSpeedButton}
					onMouseDown={props.speedChange}>
					<p className={styles.icon}>x{audioSettings.speed}</p>
				</button>
				<button
					data-info='skip to beginning'
					className={styles.buttons}
					onMouseDown={props.beginning}>
					<img
						src={beginningIcon}
						alt={'go to beginning'}
						className={styles.icon}
					/>
				</button>

				<button
					data-info='back 5s'
					className={styles.buttons}
					onMouseDown={props.rewind}>
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
						<img src={errorIcon} alt={'loading'} className={styles.loading} />
					</button>
				) : audioSettings.isReady ? (
					audioSettings.isPlaying ? (
						/* NO ERROR, IS READY AND PLAYING */
						<button
							data-info='pause'
							className={styles.buttons}
							onMouseDown={props.pause}>
							<img src={pauseIcon} alt={'pause'} className={styles.icon} />
						</button>
					) : (
						/* NO ERROR, IS READY AND PAUSED */
						<button
							data-info='play'
							className={styles.buttons}
							onMouseDown={props.play}>
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
					onMouseDown={props.forward}>
					<img src={forwardIcon} alt={'forward 5s'} className={styles.icon} />
				</button>
				<button
					data-info='change view'
					className={styles.buttons}
					onMouseDown={props.flipView}>
					<img src={flipIcon} alt={'change view'} className={styles.icon} />
				</button>
			</div>
		</div>
	);
};
