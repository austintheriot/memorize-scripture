import React from 'react';
import styles from './Menu.module.scss';

import { Link } from 'react-router-dom';

import chiRho from '../../images/chirho-light.svg';

export const Menu = (props: { menuOpen: boolean; closeMenu: () => void }) => {
	return (
		<header
			className={[styles.header, props.menuOpen ? styles.menuOpen : ''].join(
				' '
			)}>
			<a href='https://memorizescripture.org'>
				<img src={chiRho} alt='Memorize Scripture Logo: Chi Rho' />
			</a>
			<ul className={styles.ul}>
				<li className={styles.li}>
					<Link to='/' className={styles.link} onClick={props.closeMenu}>
						Home
					</Link>
				</li>
				<li className={styles.li}>
					<Link to='/about' className={styles.link} onClick={props.closeMenu}>
						About
					</Link>
				</li>
				<li className={styles.li}>
					<Link to='/contact' className={styles.link} onClick={props.closeMenu}>
						Contact
					</Link>
				</li>
			</ul>
		</header>
	);
};
