import React from 'react';
import styles from './ProgressBar.module.scss';

//State
import { useSelector } from 'react-redux';
import { selectAudioSettings } from '../../app/audioSlice';

export const ProgressBar = (props: {
	handleClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	const audioSettings = useSelector(selectAudioSettings);

	return (
		<>
			<input
				aria-label='audio position'
				className={styles.progressBar}
				type='range'
				min='0'
				max='1'
				step='0.000000001'
				value={audioSettings.position.toString()}
				onChange={props.handleClick}
			/>
			<div
				className={styles.progressIndicator}
				style={{ width: `${audioSettings.position * 100}%` }}
			/>
		</>
	);
};
