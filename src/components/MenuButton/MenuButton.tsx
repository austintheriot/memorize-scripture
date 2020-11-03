import React from 'react';
import styles from './MenuButton.module.scss';

//Menu State
import { useSelector, useDispatch } from 'react-redux';
import { selectApp, menuButtonClicked } from '../../app/appSlice';

export const MenuButton = () => {
	const dispatch = useDispatch();
	const app = useSelector(selectApp);

	const toggleMenuOpen = () => {
		dispatch(menuButtonClicked());
	};

	return (
		<button
			aria-label='Open Menu'
			className={[styles.button, app.menuIsOpen ? styles.menuOpen : ''].join(
				' '
			)}
			onClick={toggleMenuOpen}>
			<span
				className={[styles.span1, app.menuIsOpen ? styles.span1Open : ''].join(
					' '
				)}></span>
			<span
				className={[styles.span2, app.menuIsOpen ? styles.span2Open : ''].join(
					' '
				)}></span>
			<span
				className={[styles.span3, app.menuIsOpen ? styles.span3Open : ''].join(
					' '
				)}></span>
		</button>
	);
};
