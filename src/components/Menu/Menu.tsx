import React from 'react';
import styles from './Menu.module.scss';

import { Link } from 'react-router-dom';

import chiRho from '../../images/chirho-light.svg';

export const Menu = (props: any) => {
	return (
		<header
			className={[styles.header, props.menuOpen ? styles.menuOpen : ''].join(
				' '
			)}>
			<img src={chiRho} alt='Memorize Scripture Logo: Chi Rho' />
			<ul className={styles.ul}>
				<li className={styles.li}>
					<Link to='/' className={styles.link}>
						Home
					</Link>
				</li>
				<li className={styles.li}>
					<Link to='/about' className={styles.link}>
						About
					</Link>
				</li>
				<li className={styles.li}>
					<Link to='/contact' className={styles.link}>
						Contact
					</Link>
				</li>
			</ul>
		</header>
	);
};
