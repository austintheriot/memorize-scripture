import { useEffect, useRef, useState } from 'react';

const ERROR_UNSUPPORTED = 'Your browser does not support recording audio. ' +
  'Try using the latest version of Chrome on a desktop computer.';

enum RecordingStatesEnum {
  INACTIVE = 'inactive',
  RECORDING = 'recording',
  PAUSED = 'paused',
}

export const useAudioRecorder = () => {
  const mediaRecorder = useRef<MediaRecorder | undefined>();
  const chunks = useRef<Blob[]>([]);
  const localStream = useRef<MediaStream | undefined>();
  const [supported, setIsSupported] = useState(false);
  const [url, setUrl] = useState('');
  const [recordingState, setRecordingState] = useState<RecordingState | undefined>(RecordingStatesEnum.INACTIVE);

  const init = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        alert(ERROR_UNSUPPORTED);
        setIsSupported(false);
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStream.current = stream;
        setIsSupported(true);
      }
    } catch (error) {
      console.log(error);
      setIsSupported(false);
      alert(ERROR_UNSUPPORTED);
    }
  }

  const record = () => {
    if (!supported) return alert(ERROR_UNSUPPORTED);
    if (mediaRecorder.current?.state === RecordingStatesEnum.RECORDING) return;
    if (!localStream.current) return alert('Could not get local stream from mic/camera');
    chunks.current = [];

    /* use the stream */
    console.log('Start recording...');
    mediaRecorder.current = new MediaRecorder(localStream.current);

    mediaRecorder.current.ondataavailable = (e) => {
      console.log('mediaRecorder.ondataavailable, e.data.size='+e.data.size);
      if (e.data && e.data.size > 0) {
        chunks.current.push(e.data);
      }
    };

    mediaRecorder.current.onerror = (e) => {
      console.log('mediaRecorder.onerror: ' + e);
    };

    mediaRecorder.current.onstart = function () {
      setRecordingState(mediaRecorder.current?.state);
      console.log('mediaRecorder.onstart, mediaRecorder.state = ' + mediaRecorder.current?.state);
      
      if (localStream.current) localStream.current.getTracks().forEach(function(track) {
              if(track.kind == "audio"){
                console.log("onstart - Audio track.readyState="+track.readyState+", track.muted=" + track.muted);
              }
              if(track.kind == "video"){
                console.log("onstart - Video track.readyState="+track.readyState+", track.muted=" + track.muted);
              }
            });
      
    };

    mediaRecorder.current.onstop = function () {
      setRecordingState(mediaRecorder.current?.state);
      console.log('mediaRecorder.onstop, mediaRecorder.state = ' + mediaRecorder.current?.state);
      const recording = new Blob(chunks.current, {type: mediaRecorder.current?.mimeType});
      setUrl(URL.createObjectURL(recording));
    };

    mediaRecorder.current.onpause = () => {
      setRecordingState(mediaRecorder.current?.state);
      console.log('mediaRecorder.onpause, mediaRecorder.state = ' + mediaRecorder.current?.state);
    }

    mediaRecorder.current.onresume = () => {
      setRecordingState(mediaRecorder.current?.state);
      console.log('mediaRecorder.onresume, mediaRecorder.state = ' + mediaRecorder.current?.state);
    }
    
    // records chunks in blobs of 1 second
    mediaRecorder.current.start(1000);
  }

  const stop = () => {
    if (!supported) alert(ERROR_UNSUPPORTED);
    if (mediaRecorder.current) {
      if (mediaRecorder.current.state === RecordingStatesEnum.INACTIVE) return;
      mediaRecorder.current.stop();
    }
}

  useEffect(() => {
    init();
  }, [])

  return {
    supported,
    recordingState,
    record,
    stop,
    url,
  }
}