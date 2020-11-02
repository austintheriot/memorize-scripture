import React from 'react';
import styles from './Message.module.scss';

import { CloseButton } from '../CloseButton/CloseButton';

interface Props {
	show: boolean;
	message: string;
	handleHide: () => void;
}

export const Message = ({ message, show, handleHide }: Props) => {
	return (
		<div className={[styles.Message, show ? '' : styles.hideMessage].join(' ')}>
			<CloseButton onClick={handleHide} />
			<p>{message}</p>
		</div>
	);
};
