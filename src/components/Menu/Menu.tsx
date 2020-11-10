import React from 'react';
import styles from './Menu.module.scss';

import { Link } from 'react-router-dom';

import chiRho from '../../images/chirho-light.svg';

//Menu State
import { useSelector, useDispatch } from 'react-redux';
import { selectApp, navLinkClicked } from '../../app/appSlice';
import { ExternalLink } from '../Links/ExternalLink';

export const Menu = () => {
	const dispatch = useDispatch();
	const app = useSelector(selectApp);

	const closeMenu = () => {
		dispatch(navLinkClicked());
	};

	return (
		<header
			className={[styles.header, app.menuIsOpen ? styles.menuOpen : ''].join(
				' '
			)}>
			<ExternalLink to='https://memorizescripture.org'>
				<img
					src={chiRho}
					alt='Memorize Scripture Logo: Chi Rho'
					className='ChiRho'
				/>
			</ExternalLink>
			<ul className={styles.ul}>
				<li className={styles.li}>
					<Link to='/' className={styles.link} onClick={closeMenu}>
						Learn
					</Link>
				</li>
				<li className={styles.li}>
					<Link to='/review' className={styles.link} onClick={closeMenu}>
						Review
					</Link>
				</li>
				<li className={styles.li}>
					<Link to='/about' className={styles.link} onClick={closeMenu}>
						About
					</Link>
				</li>
				<li className={styles.li}>
					<Link to='/contact' className={styles.link} onClick={closeMenu}>
						Contact
					</Link>
				</li>
			</ul>
		</header>
	);
};
