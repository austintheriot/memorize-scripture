import FocusLine from 'components/FocusLine/FocusLine';
import React from 'react';
import { Link } from 'react-scroll';
import styles from './Links.module.scss';

interface Props {
	to: string;
	onClick: (link: string) => void;
	children: string;
}

export const ScrollLink = ({ to, onClick, children }: Props) => {

	return (
		<Link
			to={to}
			smooth={true}
			offset={-75}
			duration={500}
			onClick={() => onClick(children)}
			className={styles.Link}
		>
			{children}
			<FocusLine />
		</Link>
	);
};
