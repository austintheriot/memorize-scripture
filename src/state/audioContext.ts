import React from 'react';

const audio = new Audio();
type AudioType = typeof audio;
type SetAudioType = React.Dispatch<React.SetStateAction<HTMLAudioElement>>;

interface Context {
	textAudio: AudioType;
	setTextAudio: SetAudioType;
	userAudio: AudioType;
	setUserAudio: SetAudioType;
}

export const AudioContext = React.createContext<Context>({
	textAudio: new Audio(),
	setTextAudio: () => {},
	userAudio: new Audio(),
	setUserAudio: () => {},
});
