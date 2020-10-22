import React from 'react';
import styles from './Footer.module.scss';

import chiRho from '../../images/chirho-light.svg';

export const Footer = () => {
	return (
		<footer className={styles.Footer}>
			<img src={chiRho} alt='Memorize Scripture Logo: Chi Rho' />
		</footer>
	);
};
