import React from 'react';

export const AudioContext = React.createContext<HTMLAudioElement>(
	new Audio(require('audio/Psalm23.mp3'))
);
