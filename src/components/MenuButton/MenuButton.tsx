import React from 'react';
import styles from './MenuButton.module.scss';

//Menu State
import { useDispatch } from 'react-redux';
import { menuButtonClicked } from '../../store/appSlice';
import { useAppSelector } from 'store/store';

export const MenuButton = () => {
	const dispatch = useDispatch();
	const { menuIsOpen } = useAppSelector((state) => state.app);

	const toggleMenuOpen = () => {
		dispatch(menuButtonClicked());
	};

	return (
		<button
			aria-label='Open Menu'
			data-testid='menu-button'
			className={[styles.button, menuIsOpen ? styles.menuOpen : ''].join(
				' '
			)}
			onClick={toggleMenuOpen}>
			<span
				className={[styles.span1, menuIsOpen ? styles.span1Open : ''].join(
					' '
				)}></span>
			<span
				className={[styles.span2, menuIsOpen ? styles.span2Open : ''].join(
					' '
				)}></span>
			<span
				className={[styles.span3, menuIsOpen ? styles.span3Open : ''].join(
					' '
				)}></span>
		</button>
	);
};
