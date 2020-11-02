import React from 'react';
import styles from './CloseButton.module.scss';

export const CloseButton = (props: any) => {
	return (
		<button className={['button', styles.CloseButton].join(' ')} {...props}>
			<div className={styles.spanContainer}>
				<span className={styles.span1} aria-label='close'></span>
				<span className={styles.span2} aria-label='close'></span>
			</div>
		</button>
	);
};
