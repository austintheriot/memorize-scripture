import React from 'react';
import { SetAudioType } from './types';

interface Context {
	mediaRecorder: MediaRecorder | null;
	setMediaRecorder: React.Dispatch<React.SetStateAction<MediaRecorder | null>>;
	recordedAudio: HTMLAudioElement;
	setRecordedAudio: SetAudioType;
}

export const RecordingContext = React.createContext<Context>({
	mediaRecorder: null,
	setMediaRecorder: () => {},
	recordedAudio: new Audio(),
	setRecordedAudio: () => {},
});
