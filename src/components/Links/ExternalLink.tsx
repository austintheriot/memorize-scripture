import FocusLine from 'components/FocusLine/FocusLine';
import FocusRing from 'components/FocusRing/FocusRing';
import { useFirebaseContext } from 'hooks/useFirebaseContext';
import useIsKeyboardUser from 'hooks/useIsKeyboardUser';
import React, { ComponentProps, FC, useRef } from 'react';
import { conditionalStyles } from 'utils/conditionalStyles';
import styles from './Links.module.scss';

interface Props extends ComponentProps<'a'> {
	to: string;
	focus?: 'line' | 'ring';
}

export const ExternalLink: FC<Props> = ({
	children = null,
	to,
	className = '',
	focus = 'line',
	...rest
}) => {
	const { analytics } = useFirebaseContext();
	const anchor = useRef<HTMLAnchorElement | null>(null);
	const isKeyboardUser = useIsKeyboardUser();

	const handleClick = (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		anchor: React.MutableRefObject<HTMLAnchorElement | null>,
	) => {
		if (anchor == null) return;
		const href = anchor.current?.href;
		analytics.logEvent('external_link_clicked', {
			href,
		});
	};

	return (
		<a
			href={to}
			ref={anchor}
			onClick={(e) => handleClick(e, anchor)}
			rel="noreferrer noopener"
			className={conditionalStyles([
				styles.Link,
				[styles.LinkFocus, isKeyboardUser && focus === 'line'],
				className
			])}
			{...rest}
		>
			{children}
			{focus === 'ring' && <FocusRing />}
		</a>
	);
};
