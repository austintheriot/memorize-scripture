import { MutableRefObject, useCallback, useContext, useEffect } from "react";
import { createContext, ReactNode, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import usePrevious from "./usePrevious";
import psalm23 from "~/audio/Psalm23.mp3";
import { useAppSelector } from "~/store/store";
import { ErrorBoundary } from "~/components/ErrorBoundary/ErrorBoundary";

const ERROR_UNSUPPORTED =
	"Your browser does not support recording audio. " +
	"Try using the latest version of Chrome on a desktop computer.";

export type RecordingStates = MediaRecorder["state"];

export type BrowserSupport = "supported" | "notSupported" | "unknown";

interface AudioContextType {
	url: string;
	mimeType: MediaRecorderOptions["mimeType"] | undefined;
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
}

// audio context value when no provider given
export const AudioContext = createContext<AudioContextType>({
	url: "",
	mimeType: "audio/mpeg",
	audioRef: { current: new Audio(psalm23) },
	recordingState: "inactive",
	supported: "unknown",
	hasError: false,
	isReady: false,
	isPlaying: false,
	position: 0,
	speed: 1,
	usingRecordedAudio: false,
	startRecording: () => { },
	stopRecording: () => { },
	deleteRecording: () => { },
	togglePlayPause: () => { },
	play: () => { },
	pause: () => { },
	rewind: () => { },
	forward: () => { },
	beginning: () => { },
	setAudioPosition: () => { },
	setAudioSpeed: () => { },
});

export const AudioProvider = ({ children }: { children: ReactNode }) => {
	const bibleAudioUrl = useAppSelector((state) => state.search.audioUrl);
	const location = useLocation();
	const prevLocation = usePrevious(location);
	const mediaRecorder = useRef<MediaRecorder | undefined>();
	const chunks = useRef<Blob[]>([]);
	const stream = useRef<MediaStream | undefined>();
	const [supported, setIsSupported] = useState<BrowserSupport>("unknown");
	const [url, setUrl] = useState("");
	const [recordingState, setRecordingState] =
		useState<RecordingState>("inactive");
	const [hasError, setHasError] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [speed, setSpeed] = useState(1);
	const [position, setPosition] = useState(0);
	const [usingRecordedAudio, setUsingRecordedAudio] = useState(false);
	const [mimeType, setMimeType] = useState<
		MediaRecorderOptions["mimeType"] | undefined
	>(undefined);
	const audioRef = useRef(new Audio(psalm23));

	/**
	 * Requests access to the user's audio device and creates an
	 * audio stream if the user grants access.
	 */
	const initializeStream = useCallback(async () => {
		try {
			if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
				alert(ERROR_UNSUPPORTED);
				setIsSupported("notSupported");
			} else {
				stream.current = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				setIsSupported("supported");
			}
		} catch (error) {
			console.log(error);
			setIsSupported("notSupported");
			alert(ERROR_UNSUPPORTED);
		}
	}, []);

	const startRecording = useCallback(async () => {
		if (supported === "notSupported") return alert(ERROR_UNSUPPORTED);
		if (mediaRecorder.current?.state === "recording") return;

		// set up audio stream (request microphone access)
		if (!stream.current || !mediaRecorder.current) await initializeStream();
		if (!stream.current) {
			return alert("Could not get local stream from mic/camera");
		}

		const audio = audioRef.current;
		audio.pause();
		audio.currentTime = 0;
		setHasError(false);
		setIsReady(false);

		chunks.current = [];

		/* set up media recorder from stream */
		console.log("Starting recording");

		/*
		 * Chrome does NOT want a mimeType specified -- it chooses a mimeType by default.
		 * However, Safari WANTS a mimeType specified: typically "audio/mp4"
		 */
		let options;
		if (typeof MediaRecorder.isTypeSupported == "function") {
			if (MediaRecorder.isTypeSupported("audio/mp3")) {
				options = { mimeType: "audio/mp3" };
			} else if (MediaRecorder.isTypeSupported("audio/mp4")) {
				options = { mimeType: "audio/mp4" };
			} else if (MediaRecorder.isTypeSupported("audio/ogg")) {
				options = { mimeType: "audio/ogg" };
			} else {
				options = undefined;
			}
			console.log(
				"MediaRecorder mimeType:",
				options?.mimeType || "browser default",
			);
			setMimeType(options?.mimeType);
			mediaRecorder.current = new MediaRecorder(stream.current, options);
		} else {
			console.log(
				"isTypeSupported is not supported, using default mimeType for browser",
			);
			mediaRecorder.current = new MediaRecorder(stream.current);
		}

		mediaRecorder.current.ondataavailable = (e) => {
			if (e.data.size > 0) {
				console.log("Pushing chunks: ", e.data.size);
				chunks.current.push(e.data);
			}
		};

		mediaRecorder.current.onerror = (e) => {
			console.log("mediaRecorder.onerror: " + e);
		};

		mediaRecorder.current.onstart = function() {
			setRecordingState(mediaRecorder.current?.state || "inactive");
		};

		mediaRecorder.current.onstop = function() {
			setRecordingState(mediaRecorder.current?.state || "inactive");
			const recording = new Blob(chunks.current, {
				type: mediaRecorder.current?.mimeType,
			});
			console.log("Recording Blob created from chunks: ", recording);
			const url = URL.createObjectURL(recording);
			console.log("Setting new url: ", url);
			setUrl(url);
		};

		mediaRecorder.current.onpause = () => {
			setRecordingState(mediaRecorder.current?.state || "inactive");
		};

		mediaRecorder.current.onresume = () => {
			setRecordingState(mediaRecorder.current?.state || "inactive");
		};

		// records chunks in blobs of 1 second
		mediaRecorder.current.start(1000);
	}, [initializeStream, setHasError, setIsReady, setMimeType, supported]);

	const stopRecording = useCallback(() => {
		if (supported === "notSupported") return alert(ERROR_UNSUPPORTED);
		if (mediaRecorder.current) {
			if (mediaRecorder.current.state === "inactive") return;
			console.log("Stopping recording");
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
		console.log("Preparing audio for playback");
		const audio = audioRef.current;
		audio.load(); // necessary on mobile
		audio.pause();
		audio.currentTime = 0;
		audio.playbackRate = speed;

		//loaded enough to play
		audio.oncanplay = (e) => {
			console.log("oncanplay", e);
			setIsReady(true);
		};
		audio.onpause = () => setIsPlaying(false);
		audio.onplay = () => setIsPlaying(true);
		audio.onstalled = (e) => {
			console.warn("Audio stalled: ", e);
		};
		audio.onerror = (e) => {
			console.trace();
			console.error("Audio experienced an error: ", e);
			setHasError(true);
			let errorString = "";
			const audioError = audio.error;
			console.log(
				"Audio: ",
				audio,
				"Audio error: ",
				audio.error,
				"Error code: ",
				audioError?.code,
				"Error message: ",
				audioError?.message,
			);
			switch (audioError?.code) {
				case MediaError.MEDIA_ERR_ABORTED:
					errorString += "The user canceled the audio.";
					break;
				case MediaError.MEDIA_ERR_NETWORK:
					errorString += "A network error occurred while fetching the audio.";
					break;
				case MediaError.MEDIA_ERR_DECODE:
					errorString += "An error occurred while decoding the audio.";
					break;
				case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
					errorString +=
						"The audio is missing or is in a format not supported by your browser.";
					break;
				default:
					errorString += "An unknown error occurred.";
					break;
			}
			console.log("Error String: ", errorString);
		};
		//not enough data
		audio.onwaiting = () => {
			setIsReady(false);
			setIsPlaying(false);
		};
		//ready to play after waiting
		audio.onplaying = () => setIsReady(true);
		//audio is over
		audio.onended = () => {
			audio.pause();
			audio.currentTime = 0;
		};
		//as time is updated
		audio.ontimeupdate = (_e) => {
			const targetPosition = audio.currentTime / audio.duration;
			if (isNaN(targetPosition)) return;
			setPosition(targetPosition);
		};
		//when speed is changed
		audio.onratechange = () => setSpeed(audio.playbackRate);
	}, [setHasError, setIsReady, setIsPlaying, setPosition, setSpeed, speed]);

	/**
	 * Plays audio if audio is paused.
	 * Pauses audio if audio is playing.
	 */
	const togglePlayPause = useCallback(() => {
		const audio = audioRef.current;
		if (audio.readyState < 2) return;
		if (audio.paused) {
			audio.play();
		} else {
			audio.pause();
		}
	}, []);

	/**
	 * Plays audio if audio is ready to be interacted with.
	 */
	const play = useCallback(() => {
		const audio = audioRef.current;
		if (audio.readyState < 2) return;
		if (audio.paused) audio.play();
		setIsPlaying(true);
	}, [setIsPlaying]);

	/**
	 * Pauses audio if audio is ready to be interacted with.
	 */
	const pause = useCallback(() => {
		const audio = audioRef.current;
		if (audio.readyState < 2) return;
		if (!audio.paused) audio.pause();
		setIsPlaying(false);
	}, [setIsPlaying]);

	/**
	 * Rewinds audio if audio is ready to be interacted with.
	 */
	const rewind = useCallback(() => {
		const audio = audioRef.current;
		if (audio.readyState < 2) return;
		const targetTime = Math.max(audio.currentTime - 5, 0);
		audio.currentTime = targetTime;
	}, []);

	/**
	 * Moves audio forward if audio is ready to be interacted with.
	 */
	const forward = useCallback(() => {
		const audio = audioRef.current;
		if (audio.readyState < 2) return;
		const targetTime = Math.min(audio.currentTime + 5, audio.duration - 0.01);
		audio.currentTime = targetTime;
	}, []);

	/**
	 * Sends current position of audio to the beginning.
	 */
	const beginning = useCallback(() => {
		const audio = audioRef.current;
		if (audio.readyState < 2) return;
		audio.currentTime = 0;
	}, []);

	/**
	 * Moves current audio position to a designated time between 0 and 1
	 * if audio is ready to be interacted with.
	 */
	const setAudioPosition = useCallback((targetTime: number) => {
		const audio = audioRef.current;
		if (audio.readyState < 2) return;
		audio.currentTime = audio.duration * targetTime;
	}, []);

	/**
	 * Changes the current audio speed to the designated speed if audio
	 * is ready to be interacted with.
	 */
	const setAudioSpeed = useCallback((targetSpeed: number) => {
		const audio = audioRef.current;
		if (audio.readyState < 2) return;
		audio.playbackRate = targetSpeed;
	}, []);

	const deleteRecording = useCallback(() => {
		pause();
		setIsPlaying(false);
		setIsReady(false);
		setHasError(false);
		setMimeType("");
		setPosition(0);
		stopRecording();
		chunks.current = [];
		setUrl(bibleAudioUrl ?? "");
		setUsingRecordedAudio(false);
	}, [
		setPosition,
		setMimeType,
		stopRecording,
		pause,
		setUrl,
		setIsPlaying,
		bibleAudioUrl,
		setIsReady,
		setUsingRecordedAudio,
		setHasError,
	]);

	useEffect(() => {
		if (bibleAudioUrl) {
			pause();
			stopRecording();
			setUrl(bibleAudioUrl);
			setIsPlaying(false);
			setPosition(0);
		}
	}, [bibleAudioUrl, pause, setIsPlaying, setPosition, stopRecording]);

	const prevUrlRef = useRef<string | null>(null);
	useEffect(() => {
		console.log(
			`url = "${url}"`,
			`prevUrlRef.current = "${prevUrlRef.current}"`,
			"===",
			url === prevUrlRef.current,
		);
		if (url === prevUrlRef.current) return;
		prevUrlRef.current = url;

		prepareAudioForPlayback();
	}, [prepareAudioForPlayback, url]);

	useEffect(() => {
		if (location !== prevLocation) {
			if (mediaRecorder.current?.state === "recording") {
				console.log("Location changed while recording. Stopping recording.");
				stopRecording();
			}
			if (!audioRef.current?.paused) {
				console.log(
					"Location changed while playing audio. Pausing audio playback.",
				);
				pause();
			}
		}
	}, [location, pause, prevLocation, stopRecording]);

	return (
		<AudioContext.Provider
			value={{
				audioRef,
				startRecording,
				stopRecording,
				deleteRecording,
				url,
				mimeType,
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
			}}
		>
			<ErrorBoundary>{children}</ErrorBoundary>
		</AudioContext.Provider>
	);
};

export const useAudio = () => {
	return useContext(AudioContext);
};
