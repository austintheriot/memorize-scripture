import React from 'react';
import { SetAudioType } from '../utilities/types';

interface Context {
	textAudio: HTMLAudioElement;
	setTextAudio: SetAudioType;
	userAudio: HTMLAudioElement;
	setUserAudio: SetAudioType;
}

export const AudioContext = React.createContext<Context>({
	textAudio: new Audio(),
	setTextAudio: () => {},
	userAudio: new Audio(),
	setUserAudio: () => {},
});
