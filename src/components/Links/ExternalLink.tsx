import FocusLine from 'components/FocusLine/FocusLine';
import { useFirebaseContext } from 'hooks/useFirebaseContext';
import React, { FC, useRef } from 'react';
import { conditionalStyles } from 'utils/conditionalStyles';
import styles from './Links.module.scss';

interface Props {
	to: string;
	className?: string;
}

export const ExternalLink: FC<Props> = ({children = null, to, className = ''}) => {
	const { analytics } = useFirebaseContext();
	const anchor = useRef<HTMLAnchorElement | null>(null);

	const handleClick = (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		anchor: React.MutableRefObject<HTMLAnchorElement | null>
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
			rel='noreferrer noopener'
			className={conditionalStyles([
				styles.Link,
				className,
			])}>
			{children}
			<FocusLine />
		</a>
	);
};
