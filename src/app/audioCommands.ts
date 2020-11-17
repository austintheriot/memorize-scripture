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
	if (config.audioElement.readyState < 2) return;
	if (config.audioElement.paused) {
		config.audioElement.play();
	} else {
		config.audioElement.pause();
	}
	config.dispatch(spacebarPressed());
};

export const play = (config: UtilityConfig) => {
	if (config.audioElement.readyState < 2) return;
	config.audioElement.play();
	config.dispatch(playButtonClicked());
};

export const pause = (config: UtilityConfig) => {
	if (config.audioElement.readyState < 2) return;
	config.audioElement.pause();
	config.dispatch(pauseButtonClicked());
};

export const rewind = (config: UtilityConfig) => {
	if (config.audioElement.readyState < 2) return;
	const targetTime = Math.max(config.audioElement.currentTime - 5, 0);
	config.dispatch(leftArrowPressed(targetTime / config.audioElement.duration));
	config.audioElement.currentTime = targetTime;
};

export const forward = (config: UtilityConfig) => {
	if (config.audioElement.readyState < 2) return;
	const targetTime = Math.min(
		config.audioElement.currentTime + 5,
		config.audioElement.duration - 0.01
	);
	config.dispatch(rightArrowPressed(targetTime / config.audioElement.duration));
	config.audioElement.currentTime = targetTime;
};

export const beginning = (config: UtilityConfig) => {
	if (config.audioElement.readyState < 2) return;
	config.audioElement.currentTime = 0;
};

export const position = (config: UtilityConfig, targetTime: number) => {
	if (config.audioElement.readyState < 2) return;
	config.dispatch(progressBarClicked(targetTime));
	config.audioElement.currentTime = config.audioElement.duration * targetTime;
};

export const speed = (config: UtilityConfig, targetSpeed: number) => {
	if (config.audioElement.readyState < 2) return;
	config.audioElement.playbackRate = targetSpeed;
	config.dispatch(speedButtonClicked(targetSpeed));
	storePlaySpeed(targetSpeed);
};

export const handleKeyPress = (
	e: React.KeyboardEvent<HTMLDivElement>,
	config: UtilityConfig
) => {
	const key = e.key;
	if (config.audioElement.readyState < 2) return;
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
