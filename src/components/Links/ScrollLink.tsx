import React from 'react';
import { Link } from 'react-scroll';

export const ScrollLink = (props: {
	to: string;
	onClick: (link: string) => void;
	children: string;
}) => {
	return (
		<Link
			to={props.to}
			smooth={true}
			offset={-75}
			duration={500}
			onClick={() => props.onClick(props.children)}>
			{props.children}
		</Link>
	);
};
