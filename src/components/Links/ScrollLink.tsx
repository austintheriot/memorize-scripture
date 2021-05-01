import FocusLine from 'components/FocusLine/FocusLine';
import useIsKeyboardUser from 'hooks/useIsKeyboardUser';
import React from 'react';
import { Link } from 'react-scroll';
import { conditionalStyles } from 'utils/conditionalStyles';
import styles from './Links.module.scss';

interface Props {
	to: string;
	onClick: (link: string) => void;
	children: string;
}

export const ScrollLink = ({ to, onClick, children }: Props) => {
	const isKeyboardUser = useIsKeyboardUser();

	return (
		<Link
			to={to}
			smooth={true}
			offset={-75}
			duration={500}
			onClick={() => onClick(children)}
			className={conditionalStyles([
				styles.Link,
				[styles.LinkFocus, isKeyboardUser]
			])}
		>
			{children}
			<FocusLine />
		</Link>
	);
};
