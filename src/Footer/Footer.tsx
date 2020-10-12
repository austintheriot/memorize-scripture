import React from 'react';
import styles from './Footer.module.scss';

//Custom icons
import flipIcon from '../icons/flip.svg';

export const Footer = (props: any) => {
	return (
		<footer className={styles.Footer}>
			<div className={styles.ButtonContainer}>
				<button className={styles.buttons} onClick={props.flipView}>
					<img src={flipIcon} alt={'change view'}></img>
				</button>
			</div>
		</footer>
	);
};
