import React from 'react';
import { Link } from 'react-scroll';

export const ScrollLink = (props: { to: string; children: any }) => {
	return (
		<Link to={props.to} smooth={true} offset={-20} duration={500}>
			{props.children}
		</Link>
	);
};
