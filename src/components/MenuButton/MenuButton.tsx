import React from 'react';
import styles from './MenuButton.module.scss';

export const MenuButton = (props: any) => {
	return (
		<button
			className={[styles.button, props.menuOpen ? styles.menuOpen : ''].join(
				' '
			)}
			onClick={props.handleClick}>
			<span
				className={[styles.span1, props.menuOpen ? styles.span1Open : ''].join(
					' '
				)}></span>
			<span
				className={[styles.span2, props.menuOpen ? styles.span2Open : ''].join(
					' '
				)}></span>
			<span
				className={[styles.span3, props.menuOpen ? styles.span3Open : ''].join(
					' '
				)}></span>
		</button>
	);
};
