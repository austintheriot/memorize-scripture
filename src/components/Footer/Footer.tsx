import React from 'react';
import styles from './Footer.module.scss';

import chiRho from '../../images/chirho-light.svg';
import { ExternalLink } from '../Links/ExternalLink';

export const Footer = () => {
	return (
		<footer className={styles.Footer}>
			<ExternalLink to='https://memorizescripture.org'>
				<img
					src={chiRho}
					alt='Memorize Scripture Logo: Chi Rho'
					className='ChiRho'
				/>
			</ExternalLink>
		</footer>
	);
};
