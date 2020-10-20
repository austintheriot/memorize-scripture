import React from 'react';
import styles from './Menu.module.scss';

import { Link } from 'react-router-dom';

export const Menu = (props: any) => {
	return (
		<header
			className={[styles.header, props.menuOpen ? styles.menuOpen : ''].join(
				' '
			)}>
			<ul className={styles.ul}>
				<li className={styles.li}>
					<Link to='/' className={styles.link}>
						Home
					</Link>
				</li>
				<li>
					<Link to='/about' className={styles.link}>
						About
					</Link>
				</li>
			</ul>
		</header>
	);
};
