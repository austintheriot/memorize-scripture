import useIsKeyboardUser from 'hooks/useIsKeyboardUser';
import React, { FC, MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { conditionalStyles } from 'utils/conditionalStyles';
import styles from './Links.module.scss';

interface Props {
	to: string;
	children?: ReactNode;
	className?: string;
	tabIndex?: -1 | 0;
	onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export const InternalLink: FC<Props> = ({
	to,
	children = null,
	className = '',
	tabIndex,
	...rest
}) => {
	const isKeyboardUser = useIsKeyboardUser();

	return (
		<Link
			to={to}
			className={conditionalStyles([
				styles.Link,
				[styles.LinkFocus, isKeyboardUser],
				className,
			])}
			tabIndex={tabIndex}
			{...rest}
		>
			{children}
		</Link>
	);
};
