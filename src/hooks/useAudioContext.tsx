import React, { MutableRefObject, useContext, useRef } from 'react';
const psalm23 = require('audio/Psalm23.mp3');

const AudioContext = React.createContext<MutableRefObject<HTMLAudioElement> | null>(
	null,
);

export const AudioProvider = ({ children }: { children: any }) => {
	const audioRef = useRef(new Audio(psalm23));
	return (
		<AudioContext.Provider value={audioRef}>{children}</AudioContext.Provider>
	);
};

export const useAudioContext = (): any => {
	return useContext(AudioContext);
};
