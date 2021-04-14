import { useCallback, useEffect, useRef } from 'react';
import useStateIfMounted from './useStateIfMounted';

export const NOT_SUPPORTED_MESSAGE =
	'Sorry, audio recording is not supported by your browser. ' +
	'If you are on a mobile device, try using a desktop computer instead.';

export enum RecordinStateEnum {
	RECORDING = 'recording',
	STOPPED = 'stopped',
}

/**
 * Allows the user to record, play, and delete audio from their own device.
 * Returns a src url to play the audio from an <audio> component.
 */
export const useAudioRecorder = () => {
	// updates the DOM with a new audio recording
	const [isSupported, setIsSupported] = useStateIfMounted(false);
	const [recordingState, setRecordingState] = useStateIfMounted<RecordinStateEnum>(
		RecordinStateEnum.STOPPED,
	);
	const [src, setSrc] = useStateIfMounted<string | null>(null);
	const chunks = useRef<Blob[]>([]);
	const mediaRecorder = useRef<MediaRecorder | null>();

	const checkIsSupported = useCallback(() => {
		if (!isSupported) {
			alert(NOT_SUPPORTED_MESSAGE);
			return false;
		} else {
			return true;
		}
	}, [isSupported])

	// stop recording
	const stopRecording = useCallback(() => {
		if (!checkIsSupported()) return;
		if (
			mediaRecorder?.current?.state &&
			mediaRecorder.current.state !== 'inactive'
		) {
			setRecordingState(RecordinStateEnum.STOPPED);
			mediaRecorder.current.stop();
		}
	}, [checkIsSupported, setRecordingState]);

	// pause any existing playback
	// delete any existing saved data
	const deleteRecording = useCallback(() => {
		if (!checkIsSupported()) return;
		stopRecording();
		chunks.current = [];
		setRecordingState(RecordinStateEnum.STOPPED);
		setSrc(null);
	}, [stopRecording, checkIsSupported, setRecordingState, setSrc]);

	// pause any existing playback
	// delete any existing saved data
	// start recording
	const startRecording = useCallback(() => {
		if (!checkIsSupported()) return;
		deleteRecording();
		if (
			mediaRecorder?.current?.state &&
			mediaRecorder?.current?.state !== 'recording'
		) {
			setRecordingState(RecordinStateEnum.RECORDING);
			mediaRecorder.current.start();
		}
	}, [deleteRecording, checkIsSupported, setRecordingState]);

	// typically called after recording or stops or when a
	// blob becomes large enough to save
	const onDataAvailable = useCallback((e: BlobEvent) => {
		chunks.current.push(e.data);
	}, []);

	const onStop = useCallback(() => {
		const blob = new Blob(chunks.current, { type: 'audio/ogg; codecs=opus' });
		const audioURL = window.URL.createObjectURL(blob);
		setSrc(audioURL);
	}, [setSrc]);

	const initStream = useCallback(async () => {
		try {
			if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
				console.log('getUserMedia supported.');
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				const newMediaRecorder = new MediaRecorder(stream);
				newMediaRecorder.ondataavailable = onDataAvailable;
				newMediaRecorder.onstop = onStop;
				mediaRecorder.current = newMediaRecorder;
				setIsSupported(true);
			} else {
				setIsSupported(false);
			}
		} catch (err) {
			console.log(err);
			setIsSupported(false);
		}
	}, [onDataAvailable, onStop, setIsSupported]);

	/* Set up audio stream for recording */
	useEffect(() => {
		initStream();
	}, [initStream]);

	return {
		isSupported,
		startRecording,
		stopRecording,
		deleteRecording,
		recordingState,
		mediaRecorder: mediaRecorder.current,
		src,
	};
};
