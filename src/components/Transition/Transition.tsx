import React from 'react';
import styles from './Transition.module.scss';

import { useSelector } from 'react-redux';
import { selectMenu } from '../../state/menuSlice';

export const Transition = (props: any) => {
	const menu = useSelector(selectMenu);

	return (
		<div
			className={[styles.Transition, menu.isOpen ? styles.menuOpen : ''].join(
				' '
			)}>
			{props.children}
		</div>
	);
};
