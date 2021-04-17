import React from 'react';
import styles from './Transition.module.scss';
import { useAppSelector } from 'store/store';

export const Transition = (props: any) => {
	const { menuIsOpen } = useAppSelector(s => s.app);

	return (
		<div
			className={[
				styles.Transition,
				menuIsOpen ? styles.menuOpen : '',
			].join(' ')}>
			{props.children}
		</div>
	);
};
