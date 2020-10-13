import React from 'react';
import styles from './Footer.module.scss';

//Custom icons
import flipIcon from '../../icons/flip.svg';
import beginningIcon from '../../icons/beginning.svg';
import rewindIcon from '../../icons/rewind.svg';
import pauseIcon from '../../icons/pause.svg';
import playIcon from '../../icons/play.svg';
import loadingIcon from '../../icons/loading.svg';

export const Footer = (props: any) => {
	return (
		<footer className={styles.Footer}>
			<div className={styles.ButtonContainer}>
				<button className={styles.buttons} onClick={props.flipView}>
					<img src={flipIcon} alt={'change view'} className={styles.icon} />
				</button>
				<button className={styles.buttons}>
					<img
						src={beginningIcon}
						alt={'go to beginning'}
						className={styles.icon}
					/>
				</button>
				<button className={styles.buttons}>
					<img src={rewindIcon} alt={'rewind'} className={styles.icon} />
				</button>
				{props.isReady ? (
					props.isPlaying ? (
						<button className={styles.buttons} onClick={props.pause}>
							<img src={pauseIcon} alt={'pause'} className={styles.icon} />
						</button>
					) : (
						<button className={styles.buttons} onClick={props.play}>
							<img src={playIcon} alt={'play'} className={styles.icon} />
						</button>
					)
				) : (
					<button
						className={styles.buttons}
						onClick={props.play}
						disabled={true}>
						<img src={loadingIcon} alt={'loading'} className={styles.loading} />
					</button>
				)}
			</div>
		</footer>
	);
};
