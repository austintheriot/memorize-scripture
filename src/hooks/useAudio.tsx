import React, {
	KeyboardEvent,
	MutableRefObject,
	useCallback,
	useContext,
	useEffect,
} from 'react';
import { createContext, ReactNode, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useFirebaseContext } from './useFirebaseContext';
import usePrevious from './usePrevious';
import useStateIfMounted from './useStateIfMounted';
import psalm23 from 'audio/Psalm23.mp3';
import { useAppSelector } from 'store/store';
import { ErrorBoundary } from 'components/ErrorBoundary/ErrorBoundary';

const ERROR_UNSUPPORTED =
	'Your browser does not support recording audio. ' +
	'Try using the latest version of Chrome on a desktop computer.';

export type RecordingStates = MediaRecorder['state'];

export type BrowserSupport = 'supported' | 'notSupported' | 'unknown';

interface AudioContextType {
	url: string;
	audioRef: MutableRefObject<HTMLAudioElement>;
	recordingState: RecordingStates;
	supported: BrowserSupport;
	hasError: boolean;
	isReady: boolean;
	isPlaying: boolean;
	position: number;
	speed: number;
	usingRecordedAudio: boolean;
	startRecording: () => void;
	stopRecording: () => void;
	deleteRecording: () => void;
	togglePlayPause: () => void;
	play: () => void;
	pause: () => void;
	rewind: () => void;
	forward: () => void;
	beginning: () => void;
	setAudioPosition: (targetTime: number) => void;
	setAudioSpeed: (targetSpeed: number) => void;
	handleKeyPress: (e: KeyboardEvent<HTMLDivElement>) => void;
}

// audio context value when no provider given
export const AudioContext = createContext<AudioContextType>({
	url: '',
	audioRef: { current: new Audio(psalm23) },
	recordingState: 'inactive',
	supported: 'unknown',
	hasError: false,
	isReady: false,
	isPlaying: false,
	position: 0,
	speed: 1,
	usingRecordedAudio: false,
	startRecording: () => {},
	stopRecording: () => {},
	deleteRecording: () => {},
	togglePlayPause: () => {},
	play: () => {},
	pause: () => {},
	rewind: () => {},
	forward: () => {},
	beginning: () => {},
	setAudioPosition: () => {},
	setAudioSpeed: () => {},
	handleKeyPress: () => {},
});

export const AudioProvider = ({ children }: { children: ReactNode }) => {
	const bibleAudioUrl = useAppSelector((state) => state.bibleAudio.url);
	const location = useLocation();
	const prevLocation = usePrevious(location);
	const { analytics } = useFirebaseContext();
	const mediaRecorder = useRef<MediaRecorder | undefined>();
	const chunks = useRef<Blob[]>([]);
	const stream = useRef<MediaStream | undefined>();
	const [supported, setIsSupported] = useState<BrowserSupport>('unknown');
	const [url, setUrl] = useState(bibleAudioUrl);
	const [recordingState, setRecordingState] = useState<RecordingState>(
		'inactive',
	);
	const [hasError, setHasError] = useStateIfMounted(false);
	const [isReady, setIsReady] = useStateIfMounted(false);
	const [isPlaying, setIsPlaying] = useStateIfMounted(false);
	const [speed, setSpeed] = useStateIfMounted(1);
	const [position, setPosition] = useStateIfMounted(0);
	const [usingRecordedAudio, setUsingRecordedAudio] = useStateIfMounted(false);
	const audioRef = useRef(new Audio(psalm23));
	const audio = audioRef.current;

	/**
	 * Requests access to the user's audio device and creates an
	 * audio stream if the user grants access.
	 */
	const initializeStream = async () => {
		try {
			if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
				alert(ERROR_UNSUPPORTED);
				setIsSupported('notSupported');
			} else {
				stream.current = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				setIsSupported('supported');
			}
		} catch (error) {
			console.log(error);
			setIsSupported('notSupported');
			alert(ERROR_UNSUPPORTED);
		}
	};

	const startRecording = async () => {
		if (supported === 'notSupported') return alert(ERROR_UNSUPPORTED);
		if (mediaRecorder.current?.state === 'recording') return;

		// set up audio stream (request microphone access)
		if (!stream.current || !mediaRecorder.current) await initializeStream();
		if (!stream.current) {
			return alert('Could not get local stream from mic/camera');
		}

		audio.pause();
		audio.currentTime = 0;
		setHasError(false);
		setIsReady(false);

		chunks.current = [];

		/* ser up media recorder from stream */
		console.log('Starting recording');
		mediaRecorder.current = new MediaRecorder(stream.current);

		mediaRecorder.current.ondataavailable = (e) => {
			if (e.data.size > 0) {
				console.log('Pushing chunks: ', e.data.size);
				chunks.current.push(e.data);
			}
		};

		mediaRecorder.current.onerror = (e) => {
			console.log('mediaRecorder.onerror: ' + e);
		};

		mediaRecorder.current.onstart = function () {
			setRecordingState(mediaRecorder.current?.state || 'inactive');
		};

		mediaRecorder.current.onstop = function () {
			setRecordingState(mediaRecorder.current?.state || 'inactive');
			const recording = new Blob(chunks.current);
			console.log('Creating recording from blobs: ', recording);
			const url = URL.createObjectURL(recording);
			console.log('Setting new url: ', url);
			setUrl(url);
		};

		mediaRecorder.current.onpause = () => {
			setRecordingState(mediaRecorder.current?.state || 'inactive');
		};

		mediaRecorder.current.onresume = () => {
			setRecordingState(mediaRecorder.current?.state || 'inactive');
		};

		// records chunks in blobs of 1 second
		mediaRecorder.current.start(1000);
	};

	const stopRecording = useCallback(() => {
		if (supported === 'notSupported') return alert(ERROR_UNSUPPORTED);
		if (mediaRecorder.current) {
			if (mediaRecorder.current.state === 'inactive') return;
			console.log('Stopping recording');
			mediaRecorder.current.stop();
			setUsingRecordedAudio(true);
			if (stream.current) {
				stream.current.getTracks().forEach((track) => track.stop());
				mediaRecorder.current = undefined;
				stream.current = undefined;
			}
		}
	}, [supported, setUsingRecordedAudio]);

  const prepareAudioForPlayback = useCallback(() => {
		console.log('Preparing audio for playback');
		audio.load(); // necessary on mobile
		audio.pause();
		audio.currentTime = 0;
		audio.playbackRate = speed;

		//loaded enough to play
		audio.addEventListener('canplay', () => {
			setIsReady(true);
		});
		audio.addEventListener('pause', () => {
			setIsPlaying(false);
		});
		audio.addEventListener('play', () => {
			setIsPlaying(true);
		});
		audio.addEventListener('error', (e) => {
			console.error('Audio experienced an error: ', e);
			setHasError(true);
		});
		//not enough data
		audio.addEventListener('waiting', () => {
			setIsReady(false);
			setIsPlaying(false);
		});
		//ready to play after waiting
		audio.addEventListener('playing', () => {
			setIsReady(true);
		});
		//audio is over
		audio.addEventListener('ended', () => {
			audio.pause();
			audio.currentTime = 0;
		});
		//as time is updated
		audio.addEventListener('timeupdate', () => {
			const targetPosition = audio.currentTime / audio.duration;
			setPosition(targetPosition);
		});
		//when speed is changed
		audio.addEventListener('ratechange', () => {
			setSpeed(audio.playbackRate);
		});
	}, [
		audio,
		setHasError,
		setIsReady,
		setIsPlaying,
		setPosition,
		setSpeed,
		speed,
	]);

	/**
	 * Plays audio if audio is paused.
	 * Pauses audio if audio is playing.
	 */
	const togglePlayPause = useCallback(() => {
		if (audio.readyState < 2) return;
		if (audio.paused) {
			audio.play();
		} else {
			audio.pause();
		}
	}, [audio]);

	/**
	 * Plays audio if audio is ready to be interacted with.
	 */
	const play = useCallback(() => {
		if (audio.readyState < 2 || !audio.paused) return;
		audio.play();
		setIsPlaying(true);
	}, [audio, setIsPlaying]);

	/**
	 * Pauses audio if audio is ready to be interacted with.
	 */
	const pause = useCallback(() => {
		if (audio.readyState < 2 || audio.paused) return;
		audio.pause();
		setIsPlaying(false);
	}, [audio, setIsPlaying]);

	/**
	 * Rewinds audio if audio is ready to be interacted with.
	 */
	const rewind = useCallback(() => {
		if (audio.readyState < 2) return;
		const targetTime = Math.max(audio.currentTime - 5, 0);
		audio.currentTime = targetTime;
	}, [audio]);

	/**
	 * Moves audio forward if audio is ready to be interacted with.
	 */
	const forward = useCallback(() => {
		if (audio.readyState < 2) return;
		const targetTime = Math.min(audio.currentTime + 5, audio.duration - 0.01);
		audio.currentTime = targetTime;
	}, [audio]);

	/**
	 * Sends current position of audio to the beginning.
	 */
	const beginning = useCallback(() => {
		if (audio.readyState < 2) return;
		audio.currentTime = 0;
	}, [audio]);

	/**
	 * Moves current audio position to a designated time between 0 and 1
	 * if audio is ready to be interacted with.
	 */
	const setAudioPosition = useCallback(
		(targetTime: number) => {
			if (audio.readyState < 2) return;
			audio.currentTime = audio.duration * targetTime;
		},
		[audio],
	);

	/**
	 * Changes the current audio speed to the designated speed if audio
	 * is ready to be interacted with.
	 */
	const setAudioSpeed = useCallback(
		(targetSpeed: number) => {
			if (audio.readyState < 2) return;
			audio.playbackRate = targetSpeed;
		},
		[audio],
	);

	/**
	 * Enables toggling the audio on/off and rewinding/fast-forwarding
	 * via keyboard navigation if audio is ready to be interacted with.
	 */
	const handleKeyPress = useCallback(
		(e: KeyboardEvent<HTMLDivElement>) => {
			const key = e.key;
			if (audio.readyState < 2) return;
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
		},
		[analytics, forward, rewind, audio.readyState, togglePlayPause],
	);

	const deleteRecording = useCallback(() => {
		pause();
		stopRecording();
		chunks.current = [];
		setUrl(bibleAudioUrl);
		setUsingRecordedAudio(false);
	}, [stopRecording, pause, setUrl, bibleAudioUrl, setUsingRecordedAudio]);

	useEffect(() => {
		prepareAudioForPlayback();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [url]);

	useEffect(() => {
		if (location !== prevLocation) {
			if (mediaRecorder.current?.state === 'recording') {
				console.log('Location changed while recording. Stopping recording.');
				stopRecording();
			}
			if (!audioRef.current?.paused) {
				console.log(
					'Location changed while playing audio. Pausing audio playback.',
				);
				pause();
			}
		}
	}, [location, prevLocation, pause, stopRecording]);

	console.log({ url });

	return (
		<AudioContext.Provider
			value={{
				audioRef,
				startRecording,
				stopRecording,
				deleteRecording,
				url,
				recordingState,
				supported,
				hasError,
				isReady,
				isPlaying,
				position,
				speed,
				usingRecordedAudio,
				togglePlayPause,
				play,
				pause,
				rewind,
				forward,
				beginning,
				setAudioPosition,
				setAudioSpeed,
				handleKeyPress,
			}}
		>
			<ErrorBoundary>{children}</ErrorBoundary>
		</AudioContext.Provider>
	);
};

export const useAudio = () => {
	return useContext(AudioContext);
};
