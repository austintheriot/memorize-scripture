import React from 'react';
import styles from './Transition.module.scss';

export const Transition = (props: any) => {
	return (
		<div
			className={[
				styles.Transition,
				props.menuOpen ? styles.menuOpen : '',
			].join(' ')}>
			{props.children}
		</div>
	);
};
