import { UtilityConfig } from './types';
import {
	spacebarPressed,
	leftArrowPressed,
	rightArrowPressed,
} from './audioSlice';

export const togglePlayPause = (config: UtilityConfig) => {
	if (config.textAudio.paused) {
		config.textAudio.play();
	} else {
		config.textAudio.pause();
	}
	config.dispatch(spacebarPressed());
};

export const rewind = (config: UtilityConfig) => {
	const targetTime = Math.max(config.textAudio.currentTime - 5, 0);
	config.dispatch(leftArrowPressed(targetTime / config.textAudio.duration));
	config.textAudio.currentTime = targetTime;
};

export const forward = (config: UtilityConfig) => {
	const targetTime = Math.min(
		config.textAudio.currentTime + 5,
		config.textAudio.duration - 0.01
	);
	config.dispatch(rightArrowPressed(targetTime / config.textAudio.duration));
	config.textAudio.currentTime = targetTime;
};

export const handleKeyPress = (
	e: React.KeyboardEvent<HTMLDivElement>,
	config: UtilityConfig
) => {
	const key = e.key;
	console.log(key);
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
