import { useRef, useState } from 'react';

const ERROR_UNSUPPORTED = 'Your browser does not support recording audio. ' +
  'Try using the latest version of Chrome on a desktop computer.';

enum RecordingStatesEnum {
  INACTIVE = 'inactive',
  RECORDING = 'recording',
  PAUSED = 'paused',
}

enum BrowserSupportEnum {
  SUPPORTED = 'supported',
  NOT_SUPPORTED = 'notSupported',
  UNKNOWN = 'unknown',
}

export const useAudioRecorder = () => {
  const mediaRecorder = useRef<MediaRecorder | undefined>();
  const chunks = useRef<Blob[]>([]);
  const stream = useRef<MediaStream | undefined>();
  const [supported, setIsSupported] = useState(BrowserSupportEnum.UNKNOWN);
  const [url, setUrl] = useState('');
  const [recordingState, setRecordingState] = useState<RecordingState | undefined>(RecordingStatesEnum.INACTIVE);

  const initializeStream = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        alert(ERROR_UNSUPPORTED);
        setIsSupported(BrowserSupportEnum.NOT_SUPPORTED);
      } else {
        stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsSupported(BrowserSupportEnum.SUPPORTED);
      }
    } catch (error) {
      console.log(error);
      setIsSupported(BrowserSupportEnum.NOT_SUPPORTED);
      alert(ERROR_UNSUPPORTED);
    }
  }

  const record = async () => {
    if (supported === BrowserSupportEnum.NOT_SUPPORTED) return alert(ERROR_UNSUPPORTED);
    if (!stream.current || !mediaRecorder.current) await initializeStream();
    if (mediaRecorder.current?.state === RecordingStatesEnum.RECORDING) return;
    if (!stream.current) return alert('Could not get local stream from mic/camera');
    chunks.current = [];

    /* use the stream */
    console.log('Start recording...');
    mediaRecorder.current = new MediaRecorder(stream.current);

    mediaRecorder.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    mediaRecorder.current.onerror = (e) => {
      console.log('mediaRecorder.onerror: ' + e);
    };

    mediaRecorder.current.onstart = function () {
      setRecordingState(mediaRecorder.current?.state);
    };

    mediaRecorder.current.onstop = function () {
      setRecordingState(mediaRecorder.current?.state);
      const recording = new Blob(chunks.current, {type: mediaRecorder.current?.mimeType});
      setUrl(URL.createObjectURL(recording));
    };

    mediaRecorder.current.onpause = () => {
      setRecordingState(mediaRecorder.current?.state);
    }

    mediaRecorder.current.onresume = () => {
      setRecordingState(mediaRecorder.current?.state);
    }
    
    // records chunks in blobs of 1 second
    mediaRecorder.current.start(1000);
  }

  const stop = () => {
    if (supported === BrowserSupportEnum.NOT_SUPPORTED) return alert(ERROR_UNSUPPORTED);
    if (mediaRecorder.current) {
      if (mediaRecorder.current.state === RecordingStatesEnum.INACTIVE) return;
      mediaRecorder.current.stop();
      if (stream.current) { 
        stream.current.getTracks().forEach(track => track.stop()); 
        mediaRecorder.current = undefined;
        stream.current = undefined;
      }
    }
  }

  return {
    record,
    stop,
    url,
    recordingState,
    supported,
    BrowserSupportEnum,
    RecordingStatesEnum,
  }
}