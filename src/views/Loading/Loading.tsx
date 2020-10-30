import React from 'react';
import styles from './Loading.module.scss';

import loading from './loading.svg';
import chiRho from './chirho-light.svg';

export const Loading = () => {
	return (
		<div className={styles.outerContainer}>
			<div className={styles.innerContainer}>
				<img src={chiRho} className={styles.chiRho} alt='' />
				<img src={loading} className={styles.loadingImg} alt='' />
				<p className={styles.loadingParagraph}>Loading...</p>
			</div>
		</div>
	);
};
