import React from 'react';
import styles from './Footer.module.scss';

export const Footer = () => {
	return (
		<footer className={styles.Footer}>
			<button className={styles.buttons}>Flip</button>
		</footer>
	);
};
