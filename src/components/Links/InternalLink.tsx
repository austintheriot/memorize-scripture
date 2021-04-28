import FocusLine from 'components/FocusLine/FocusLine';
import React, { FC, useRef } from 'react';
import { Link } from 'react-router-dom';
import { conditionalStyles } from 'utils/conditionalStyles';
import styles from './Links.module.scss';

interface Props {
	to: string;
	className?: string;
}

export const InternalLink: FC<Props> = ({
	children = null,
	to,
	className = '',
}) => {
	const linkRef = useRef<HTMLAnchorElement | null>(null);

	return (
		<Link
			ref={linkRef}
			to={to}
			className={conditionalStyles([styles.Link, className])}
		>
			{children}
			<FocusLine />
		</Link>
	);
};
