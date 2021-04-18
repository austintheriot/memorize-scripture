import { storePlaySpeed } from 'utils/storageUtils';
import React, { KeyboardEvent, MutableRefObject, useCallback, useContext, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
//State
import {
	canPlayEvent,
	pauseEvent,
	playEvent,
	errorEvent,
	playingEvent,
	timeupdateEvent,
	ratechangeEvent,
	spacebarPressed,
	playButtonClicked,
	pauseButtonClicked,
	leftArrowPressed,
	rightArrowPressed,
	progressBarClicked,
	speedButtonClicked,
} from 'store/bibleAudioSlice';
import { useAppSelector } from 'store/store';
import { useFirebaseContext } from './useFirebaseContext';
const psalm23 = require('audio/Psalm23.mp3');

interface BibleAudioContextType {
	bibleAudioRef: MutableRefObject<HTMLAudioElement>,
	togglePlayPause: () => void,
	play: () => void,
	pause: () => void,
	rewind: () => void,
	forward: () => void,
	beginning: () => void,
	position: (targetTime: number) => void,
	speed: (targetSpeed: number) => void,
	handleKeyPress: (e: KeyboardEvent<HTMLDivElement>) => void,
}


// audio context value when no provider given
export const BibleAudioContext = React.createContext<BibleAudioContextType>({
	bibleAudioRef: { current: new Audio(psalm23) },
	togglePlayPause: () => { },
	play: () => { },
	pause: () => { },
	rewind: () => { },
	forward: () => { },
	beginning: () => { },
	position: () => { },
	speed: () => { },
	handleKeyPress: () => { },
});

export const BibleAudioProvider = ({ children }: { children: any }) => {
	const dispatch = useDispatch();
	const audioSpeed = useAppSelector((state) => state.bibleAudio.speed);
	const { analytics } = useFirebaseContext();
	const bibleAudioRef = useRef(new Audio(psalm23));
	const { url } = useAppSelector(state => state.bibleAudio)
	const bibleAudio = bibleAudioRef.current;

	const prepareAudioForPlayback = useCallback(() => {
		bibleAudio.load(); // necessary on mobile
		bibleAudio.pause();
		bibleAudio.currentTime = 0;
		bibleAudio.playbackRate = audioSpeed; //load bibleAudio settings

		//loaded enough to play
		bibleAudio.addEventListener('canplay', () => {
			dispatch(canPlayEvent());
		});
		bibleAudio.addEventListener('pause', () => {
			dispatch(pauseEvent());
		});
		bibleAudio.addEventListener('play', () => {
			dispatch(playEvent());
		});
		bibleAudio.addEventListener('error', () => {
			dispatch(errorEvent());
		});
		//not enough data
		bibleAudio.addEventListener('waiting', () => {
			//No action currently selected for this event
		});
		//ready to play after waiting
		bibleAudio.addEventListener('playing', () => {
			dispatch(playingEvent());
		});
		//bibleAudio is over
		bibleAudio.addEventListener('ended', () => {
			bibleAudio.pause();
			bibleAudio.currentTime = 0;
		});
		//as time is updated
		bibleAudio.addEventListener('timeupdate', () => {
			const targetPosition = bibleAudio.currentTime / bibleAudio.duration;
			dispatch(timeupdateEvent(targetPosition));
		});
		//when speed is changed
		bibleAudio.addEventListener('ratechange', () => {
			dispatch(ratechangeEvent(bibleAudio.playbackRate));
		});
	}, [audioSpeed, bibleAudio, dispatch]);

	/**
	 * Plays audio if audio is paused.
	 * Pauses audio if audio is playing.
	 */
	const togglePlayPause = useCallback(() => {
		if (bibleAudio.readyState < 2) return;
		if (bibleAudio.paused) {
			bibleAudio.play();
		} else {
			bibleAudio.pause();
		}
		dispatch(spacebarPressed());
	}, [bibleAudio, dispatch]);

	/**
	 * Plays audio if audio is ready to be interacted with.
	 */
	const play = useCallback(() => {
		if (bibleAudio.readyState < 2) return;
		bibleAudio.play();
		dispatch(playButtonClicked());
	}, [bibleAudio, dispatch]);

	/**
	 * Pauses audio if audio is ready to be interacted with.
	 */
	const pause = useCallback(() => {
		if (bibleAudio.readyState < 2) return;
		bibleAudio.pause();
		dispatch(pauseButtonClicked());
	}, [bibleAudio, dispatch]);

	/**
	 * Rewinds audio if audio is ready to be interacted with.
	 */
	const rewind = useCallback(() => {
		if (bibleAudio.readyState < 2) return;
		const targetTime = Math.max(bibleAudio.currentTime - 5, 0);
		dispatch(leftArrowPressed(targetTime / bibleAudio.duration));
		bibleAudio.currentTime = targetTime;
	}, [bibleAudio, dispatch]);

	/**
	 * Moves audio forward if audio is ready to be interacted with.
	 */
	const forward = useCallback(() => {
		if (bibleAudio.readyState < 2) return;
		const targetTime = Math.min(
			bibleAudio.currentTime + 5,
			bibleAudio.duration - 0.01
		);
		dispatch(rightArrowPressed(targetTime / bibleAudio.duration));
		bibleAudio.currentTime = targetTime;
	}, [bibleAudio, dispatch]);

	/**
	 * Sends current position of audio to the beginning.
	 */
	const beginning = useCallback(() => {
		if (bibleAudio.readyState < 2) return;
		bibleAudio.currentTime = 0;
	}, [bibleAudio]);

	/**
	 * Moves current audio position to a designated time between 0 and 1
	 * if audio is ready to be interacted with.
	 */
	const position = useCallback((targetTime: number) => {
		if (bibleAudio.readyState < 2) return;
		dispatch(progressBarClicked(targetTime));
		bibleAudio.currentTime = bibleAudio.duration * targetTime;
	}, [bibleAudio.currentTime, bibleAudio.duration, bibleAudio.readyState, dispatch]);

	/**
	 * Changes the current audio speed to the designated speed if audio 
	 * is ready to be interacted with.
	 */
	const speed = useCallback((targetSpeed: number) => {
		if (bibleAudio.readyState < 2) return;
		bibleAudio.playbackRate = targetSpeed;
		dispatch(speedButtonClicked(targetSpeed));
		storePlaySpeed(targetSpeed);
	}, [bibleAudio.playbackRate, bibleAudio.readyState, dispatch]);

	/**
	 * Enables toggling the audio on/off and rewinding/fast-forwarding
	 * via keyboard navigation if audio is ready to be interacted with.
	 */
	const handleKeyPress = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
		const key = e.key;
		if (bibleAudio.readyState < 2) return;
		if (key === ' ') {
			e.preventDefault();
			analytics.logEvent('space_bar_pressed');
			togglePlayPause();
		}
		if (key === 'ArrowLeft') {
			analytics.logEvent('left_arrow_pressed');
			rewind();
		}
		if (key === 'ArrowRight') {
			analytics.logEvent('right_arrow_pressed');
			forward();
		}
	}, [analytics, forward, rewind, bibleAudio.readyState, togglePlayPause])


	useEffect(() => {
		prepareAudioForPlayback();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [url])

	return (
		<BibleAudioContext.Provider value={{
			bibleAudioRef,
			togglePlayPause,
			play,
			pause,
			rewind,
			forward,
			beginning,
			position,
			speed,
			handleKeyPress,
		}}>{children}</BibleAudioContext.Provider>
	);
};

export const useBibleAudio = () => {
	return useContext(BibleAudioContext);
};
