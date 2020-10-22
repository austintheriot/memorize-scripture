import React from 'react';
import styles from './Footer.module.scss';

import chiRho from '../../images/chirho-light.svg';

export const Footer = () => {
	return (
		<footer>
			<img src={chiRho} alt='Memorize Scripture Logo: Chi Rho' />
		</footer>
	);
};
