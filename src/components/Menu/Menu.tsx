import React from 'react';
import styles from './Menu.module.scss';

import { Link } from 'react-router-dom';

import chiRho from '../../images/chirho-light.svg';

//Menu State
import { useSelector, useDispatch } from 'react-redux';
import { selectMenu, setMenuIsOpen } from '../../state/menuSlice';

export const Menu = () => {
	const dispatch = useDispatch();
	const menu = useSelector(selectMenu);

	const closeMenu = () => {
		dispatch(setMenuIsOpen(false));
	};

	return (
		<header
			className={[styles.header, menu.isOpen ? styles.menuOpen : ''].join(' ')}>
			<a href='https://memorizescripture.org'>
				<img
					src={chiRho}
					alt='Memorize Scripture Logo: Chi Rho'
					className='ChiRho'
				/>
			</a>
			<ul className={styles.ul}>
				<li className={styles.li}>
					<Link to='/' className={styles.link} onClick={closeMenu}>
						Home
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
