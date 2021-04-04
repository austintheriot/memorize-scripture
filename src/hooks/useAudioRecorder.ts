import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Allows the user to record, play, and delete audio from their own device.
 * Returns a src url to play the audio from an <audio> component.
 */
export const useAudioRecorder = () => {
	// updates the DOM with a new audio recording
	const [src, setSrc] = useState<string | null>(null);
	const chunks = useRef<Blob[]>([]);
	const mediaRecorder = useRef<MediaRecorder | null>();

	// stop recording
	const stopRecording = useCallback(() => {
		if (
			mediaRecorder?.current?.state &&
			mediaRecorder.current.state !== 'inactive'
		) {
			mediaRecorder.current.stop();
		}
	}, []);

	// pause any existing playback
	// delete any existing saved data
	const deleteRecording = useCallback(() => {
		stopRecording();
		chunks.current = [];
		setSrc(null);
	}, [stopRecording]);

	// pause any existing playback
	// delete any existing saved data
	// start recording
	const startRecording = useCallback(() => {
		deleteRecording();
		if (
			mediaRecorder?.current?.state &&
			mediaRecorder?.current?.state !== 'recording'
		) {
			mediaRecorder.current.start();
		}
	}, [deleteRecording]);

	// typically called after recording or stops or when a
	// blob becomes large enough to save
	const onDataAvailable = useCallback((e: BlobEvent) => {
		chunks.current.push(e.data);
	}, []);

	const onStop = useCallback(() => {
		const blob = new Blob(chunks.current, { type: 'audio/ogg; codecs=opus' });
		const audioURL = window.URL.createObjectURL(blob);
		setSrc(audioURL);
	}, []);

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
			} else {
				console.log('getUserMedia not supported on your browser!');
			}
		} catch (err) {
			console.log(err);
			alert('Sorry, audio recording is not supported by your browser.');
		}
	}, [onDataAvailable, onStop]);

	/* Set up audio stream for recording */
	useEffect(() => {
		initStream();
	}, [initStream]);

	return {
		startRecording,
		stopRecording,
		deleteRecording,
		src,
	};
};
