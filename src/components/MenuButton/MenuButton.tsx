import React from 'react';
import styles from './MenuButton.module.scss';

//Menu State
import { useSelector, useDispatch } from 'react-redux';
import { selectMenu, setMenuIsOpen } from '../../state/menuSlice';

export const MenuButton = () => {
	const dispatch = useDispatch();
	const menu = useSelector(selectMenu);

	const toggleMenuOpen = () => {
		dispatch(setMenuIsOpen(!menu.isOpen));
	};

	return (
		<button
			aria-label='Open Menu'
			className={[styles.button, menu.isOpen ? styles.menuOpen : ''].join(' ')}
			onClick={toggleMenuOpen}>
			<span
				className={[styles.span1, menu.isOpen ? styles.span1Open : ''].join(
					' '
				)}></span>
			<span
				className={[styles.span2, menu.isOpen ? styles.span2Open : ''].join(
					' '
				)}></span>
			<span
				className={[styles.span3, menu.isOpen ? styles.span3Open : ''].join(
					' '
				)}></span>
		</button>
	);
};
