import React from 'react';
import { SetAudioType } from './types';

interface Context {
	textAudio: HTMLAudioElement;
	setTextAudio: SetAudioType;
}

export const AudioContext = React.createContext<Context>({
	textAudio: new Audio(),
	setTextAudio: () => {},
});
