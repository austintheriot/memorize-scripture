import React, { useEffect, useState } from 'react';
import styles from './Message.module.scss';

import { CloseButton } from '../CloseButton/CloseButton';

interface Props {
	hide: boolean;
	message: string;
	handleHide: () => void;
}

export const Message = ({ message, hide, handleHide }: Props) => {
	return (
		<div className={[styles.Message, hide ? styles.hideMessage : ''].join(' ')}>
			<CloseButton onClick={handleHide} />
			<p>{message}</p>
		</div>
	);
};
