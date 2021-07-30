import useIsKeyboardUser from 'hooks/useIsKeyboardUser';
import React, { FC } from 'react';
import { conditionalStyles } from 'utils/conditionalStyles';
import { EmptyObject } from 'utils/typeUtils';
import styles from './FocusLine.module.scss';


const FocusLine: FC<EmptyObject> = () => {
	const isKeyboardUser = useIsKeyboardUser();
	return isKeyboardUser ? (
		<span
      className={conditionalStyles([
        'focus-line',
				styles.FocusLine,
			])}
		/>
	) : null;
};

export default FocusLine;
