import useIsKeyboardUser from 'hooks/useIsKeyboardUser';
import React, { FC } from 'react';
import { conditionalStyles } from 'utils/conditionalStyles';
import styles from './FocusRing.module.scss';

interface Props {
	rounded?: boolean;
}

const FocusRing: FC<Props> = ({ rounded = false }) => {
	const isKeyboardUser = useIsKeyboardUser();
	return isKeyboardUser ? (
		<span
      className={conditionalStyles([
        'focus-ring',
				styles.FocusRing,
				[styles.rounded, rounded],
			])}
		/>
	) : null;
};

export default FocusRing;
