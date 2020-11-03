import React from 'react';
import styles from './Transition.module.scss';

import { useSelector } from 'react-redux';
import { selectApp } from '../../app/appSlice';

export const Transition = (props: any) => {
	const app = useSelector(selectApp);

	return (
		<div
			className={[
				styles.Transition,
				app.menuIsOpen ? styles.menuOpen : '',
			].join(' ')}>
			{props.children}
		</div>
	);
};
