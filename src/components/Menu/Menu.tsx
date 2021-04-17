import React from 'react';
import styles from './Menu.module.scss';

import { Link } from 'react-router-dom';

import chiRho from '../../images/chirho-light.svg';

//Menu State
import { useDispatch } from 'react-redux';
import { navLinkClicked } from '../../store/appSlice';
import { ExternalLink } from '../Links/ExternalLink';
import { useAppSelector } from 'store/store';

export const Menu = () => {
	const dispatch = useDispatch();
	const { menuIsOpen } = useAppSelector((state) => state.app)

	const closeMenu = () => {
		dispatch(navLinkClicked());
	};

	return (
		<nav
			data-testid='menu'
			className={[styles.nav, menuIsOpen ? styles.menuOpen : ''].join(' ')}>
			<ExternalLink to='https://memorizescripture.org'>
				<img
					src={chiRho}
					alt='Memorize Scripture Logo: Chi Rho'
					className='ChiRho'
				/>
			</ExternalLink>
			<ul className={styles.ul}>
				<li className={styles.li}>
					<Link
						to='/'
						className={styles.link}
						onClick={closeMenu}
						data-testid='learn'>
						Learn
					</Link>
				</li>
				<li className={styles.li}>
					<Link
						to='/review'
						className={styles.link}
						onClick={closeMenu}
						data-testid='review'>
						Review
					</Link>
				</li>
				<li className={styles.li}>
					<Link
						to='/tools'
						className={styles.link}
						onClick={closeMenu}
						data-testid='tools'>
						Tools
					</Link>
				</li>
				<li className={styles.li}>
					<Link
						to='/about'
						className={styles.link}
						onClick={closeMenu}
						data-testid='about'>
						About
					</Link>
				</li>
				<li className={styles.li}>
					<Link
						to='/contact'
						className={styles.link}
						onClick={closeMenu}
						data-testid='contact'>
						Contact
					</Link>
				</li>
			</ul>
		</nav>
	);
};
