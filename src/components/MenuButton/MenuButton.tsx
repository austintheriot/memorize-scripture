import React from 'react';
import styles from './MenuButton.module.scss';

export const MenuButton = (props: any) => {
	return (
		<button
			className={[styles.button, props.menuOpen ? styles.menuOpen : ''].join(
				' '
			)}
			onClick={props.handleClick}></button>
	);
};
