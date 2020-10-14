import React from 'react';
import styles from './Footer.module.scss';

//Custom icons
import flipIcon from '../../icons/flip.svg';
import beginningIcon from '../../icons/beginning.svg';
import rewindIcon from '../../icons/rewind.svg';
import pauseIcon from '../../icons/pause.svg';
import playIcon from '../../icons/play.svg';
import forwardIcon from '../../icons/forward.svg';
import loadingIcon from '../../icons/loading.svg';
import errorIcon from '../../icons/error.svg';

export const Footer = (props: any) => {
	return (
		<footer className={styles.Footer}>
			{/* PROGRESS BAR */}
			<div
				className={styles.progressBarOuter}
				onMouseDown={props.progressClick}>
				<div
					className={styles.progressBarInner}
					style={{ width: `${props.currentTime * 100}%` }}></div>
			</div>

			{/* BUTTON CONTAINER */}
			<div className={styles.buttonContainer}>
				<button className={styles.buttons} onMouseDown={props.speedChange}>
					<p className={styles.icon}>x{props.speed}</p>
				</button>
				<button className={styles.buttons} onMouseDown={props.beginning}>
					<img
						src={beginningIcon}
						alt={'go to beginning'}
						className={styles.icon}
					/>
				</button>

				<button className={styles.buttons} onMouseDown={props.rewind}>
					<img
						src={rewindIcon}
						alt={'jump back 5 seconds'}
						className={styles.icon}
					/>
				</button>

				{/* PLAY BUTTON */}
				{props.hasError ? (
					/* HAS ERROR */
					<button className={styles.buttons} disabled={true}>
						<img src={errorIcon} alt={'loading'} className={styles.loading} />
					</button>
				) : props.isReady ? (
					props.isPlaying ? (
						/* NO ERROR, IS READY AND PLAYING */
						<button className={styles.buttons} onMouseDown={props.pause}>
							<img src={pauseIcon} alt={'pause'} className={styles.icon} />
						</button>
					) : (
						/* NO ERROR, IS READY AND PAUSED */
						<button className={styles.buttons} onMouseDown={props.play}>
							<img src={playIcon} alt={'play'} className={styles.icon} />
						</button>
					)
				) : (
					/* NO ERROR, IS NOT READY (LOADING) */
					<button className={styles.buttons} disabled={true}>
						<img src={loadingIcon} alt={'loading'} className={styles.loading} />
					</button>
				)}
				<button className={styles.buttons} onMouseDown={props.forward}>
					<img
						src={forwardIcon}
						alt={'jump forward 5 seconds'}
						className={styles.icon}
					/>
				</button>
				<button className={styles.buttons} onMouseDown={props.flipView}>
					<img src={flipIcon} alt={'change view'} className={styles.icon} />
				</button>
			</div>
		</footer>
	);
};
