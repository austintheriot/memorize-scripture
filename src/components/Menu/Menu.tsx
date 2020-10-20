import React from 'react';
import styles from './Menu.module.scss';

export const Menu = (props: any) => {
	return (
		<header
			className={[styles.header, props.menuOpen ? styles.menuOpen : ''].join(
				' '
			)}>
			Menu
		</header>
	);
};
