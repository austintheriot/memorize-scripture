import React from 'react';
import styles from './Footer.module.scss';

//Custom icons
import flipIcon from '../../icons/flip.svg';
import beginningIcon from '../../icons/beginning.svg';
import rewindIcon from '../../icons/rewind.svg';
import pauseIcon from '../../icons/pause.svg';
import playIcon from '../../icons/play.svg';

export const Footer = (props: any) => {
	return (
		<footer className={styles.Footer}>
			<div className={styles.ButtonContainer}>
				<button className={styles.buttons} onClick={props.flipView}>
					<img src={flipIcon} alt={'change view'} />
				</button>
				<button className={styles.buttons}>
					<img src={beginningIcon} alt={'go to beginning'} />
				</button>
				<button className={styles.buttons}>
					<img src={rewindIcon} alt={'rewind'} />
				</button>
				<button className={styles.buttons}>
					<img src={playIcon} alt={'play'} />
				</button>
				<button className={styles.buttons}>
					<img src={pauseIcon} alt={'pause'} />
				</button>
			</div>
		</footer>
	);
};
