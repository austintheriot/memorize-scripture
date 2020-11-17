import { UtilityConfig } from './types';
import {
	spacebarPressed,
	leftArrowPressed,
	rightArrowPressed,
	playButtonClicked,
	pauseButtonClicked,
	progressBarClicked,
	speedButtonClicked,
} from './audioSlice';
import { storePlaySpeed } from './storage';

export const togglePlayPause = (config: UtilityConfig) => {
	if (config.textAudio.readyState !== 4) return;
	if (config.textAudio.paused) {
		config.textAudio.play();
	} else {
		config.textAudio.pause();
	}
	config.dispatch(spacebarPressed());
};

export const play = (config: UtilityConfig) => {
	if (config.textAudio.readyState !== 4) return;
	config.textAudio.play();
	config.dispatch(playButtonClicked());
};

export const pause = (config: UtilityConfig) => {
	if (config.textAudio.readyState !== 4) return;
	config.textAudio.pause();
	config.dispatch(pauseButtonClicked());
};

export const rewind = (config: UtilityConfig) => {
	if (config.textAudio.readyState !== 4) return;
	const targetTime = Math.max(config.textAudio.currentTime - 5, 0);
	config.dispatch(leftArrowPressed(targetTime / config.textAudio.duration));
	config.textAudio.currentTime = targetTime;
};

export const forward = (config: UtilityConfig) => {
	if (config.textAudio.readyState !== 4) return;
	const targetTime = Math.min(
		config.textAudio.currentTime + 5,
		config.textAudio.duration - 0.01
	);
	config.dispatch(rightArrowPressed(targetTime / config.textAudio.duration));
	config.textAudio.currentTime = targetTime;
};

export const beginning = (config: UtilityConfig) => {
	if (config.textAudio.readyState !== 4) return;
	config.textAudio.currentTime = 0;
};

export const position = (config: UtilityConfig, targetTime: number) => {
	if (config.textAudio.readyState !== 4) return;
	config.dispatch(progressBarClicked(targetTime));
	config.textAudio.currentTime = config.textAudio.duration * targetTime;
};

export const speed = (config: UtilityConfig, targetSpeed: number) => {
	if (config.textAudio.readyState !== 4) return;
	config.textAudio.playbackRate = targetSpeed;
	config.dispatch(speedButtonClicked(targetSpeed));
	storePlaySpeed(targetSpeed);
};

export const handleKeyPress = (
	e: React.KeyboardEvent<HTMLDivElement>,
	config: UtilityConfig
) => {
	const key = e.key;
	if (config.textAudio.readyState !== 4) return;
	if (key === ' ') {
		e.preventDefault();
		config.analytics.logEvent('space_bar_pressed');
		togglePlayPause(config);
	}
	if (key === 'ArrowLeft') {
		config.analytics.logEvent('left_arrow_pressed');
		rewind(config);
	}
	if (key === 'ArrowRight') {
		config.analytics.logEvent('right_arrow_pressed');
		forward(config);
	}
};
