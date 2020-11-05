import React from 'react';
import { SetAudioType } from './types';

interface Context {
	recordingAudio: HTMLAudioElement;
	setRecordingAudio: SetAudioType;
}

export const AudioContext = React.createContext<Context>({
	recordingAudio: new Audio(),
	setRecordingAudio: () => {},
});
