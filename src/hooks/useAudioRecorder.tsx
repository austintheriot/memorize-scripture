import React, { KeyboardEvent, MutableRefObject, useCallback, useContext, useEffect } from 'react';
import { createContext, ReactNode, useRef, useState } from 'react';
import { useFirebaseContext } from './useFirebaseContext';
import useStateIfMounted from './useStateIfMounted';

const ERROR_UNSUPPORTED =
  'Your browser does not support recording audio. ' +
  'Try using the latest version of Chrome on a desktop computer.';

export type RecordingStates = MediaRecorder['state'];

export type BrowserSupport = 'supported' | 'notSupported' | 'unknown';

interface RecordedAudioContext {
  url: string;
  recordedAudioRef: MutableRefObject<HTMLAudioElement>,
  recordingState: RecordingStates;
  supported: BrowserSupport;
  hasError: boolean;
  isReady: boolean;
  isPlaying: boolean;
  position: number;
  speed: number;
  startRecording: () => void;
  stopRecording: () => void;
  togglePlayPause: () => void,
  play: () => void,
  pause: () => void,
  rewind: () => void,
  forward: () => void,
  beginning: () => void,
  setAudioPosition: (targetTime: number) => void,
  setAudioSpeed: (targetSpeed: number) => void,
  handleKeyPress: (e: KeyboardEvent<HTMLDivElement>) => void,
}

// audio context value when no provider given
export const RecordedAudioContext = createContext<RecordedAudioContext>({
  url: '',
  recordedAudioRef: { current: new Audio('') },
  recordingState: 'inactive',
  supported: 'unknown',
  hasError: false,
  isReady: false,
  isPlaying: false,
  position: 0,
  speed: 1,
  startRecording: () => { },
  stopRecording: () => { },
  togglePlayPause: () => { },
  play: () => { },
  pause: () => { },
  rewind: () => { },
  forward: () => { },
  beginning: () => { },
  setAudioPosition: () => { },
  setAudioSpeed: () => { },
  handleKeyPress: () => { },
});

export const RecordedAudioProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { analytics } = useFirebaseContext();
  const mediaRecorder = useRef<MediaRecorder | undefined>();
  const chunks = useRef<Blob[]>([]);
  const stream = useRef<MediaStream | undefined>();
  const [supported, setIsSupported] = useState<BrowserSupport>('unknown');
  const [url, setUrl] = useState('');
  const [recordingState, setRecordingState] = useState<RecordingState>('inactive');
  const [hasError, setHasError] = useStateIfMounted(false);
  const [isReady, setIsReady] = useStateIfMounted(false);
  const [isPlaying, setIsPlaying] = useStateIfMounted(false);
  const [speed, setSpeed] = useStateIfMounted(1);
  const [position, setPosition] = useStateIfMounted(0);
  const recordedAudioRef = useRef(new Audio(''));
  const recordedAudio = recordedAudioRef.current;

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
    if (!stream.current || !mediaRecorder.current) await initializeStream();
    if (mediaRecorder.current?.state === 'recording') return;
    if (!stream.current)
      return alert('Could not get local stream from mic/camera');
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
      setRecordingState(mediaRecorder.current?.state || 'inactive');
    };

    mediaRecorder.current.onstop = function () {
      setRecordingState(mediaRecorder.current?.state || 'inactive');
      const recording = new Blob(chunks.current, {
        type: mediaRecorder.current?.mimeType,
      });
      setUrl(URL.createObjectURL(recording));
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

  const stopRecording = () => {
    if (supported === 'notSupported') return alert(ERROR_UNSUPPORTED);
    if (mediaRecorder.current) {
      if (mediaRecorder.current.state === 'inactive') return;
      mediaRecorder.current.stop();
      if (stream.current) {
        stream.current.getTracks().forEach((track) => track.stop());
        mediaRecorder.current = undefined;
        stream.current = undefined;
      }
    }
  };

  const prepareAudioForPlayback = useCallback(() => {
    recordedAudio.load(); // necessary on mobile
    recordedAudio.pause();
    recordedAudio.currentTime = 0;
    recordedAudio.playbackRate = 1; //load recordedAudio settings

    //loaded enough to play
    recordedAudio.addEventListener('canplay', () => {
      setIsReady(true);
    });
    recordedAudio.addEventListener('pause', () => {
      setIsPlaying(false);
    });
    recordedAudio.addEventListener('play', () => {
      setIsPlaying(true);
    });
    recordedAudio.addEventListener('error', () => {
      setHasError(true);
    });
    //not enough data
    recordedAudio.addEventListener('waiting', () => {
      //No action currently selected for this event
    });
    //ready to play after waiting
    recordedAudio.addEventListener('playing', () => {
      setIsReady(true);
    });
    //recordedAudio is over
    recordedAudio.addEventListener('ended', () => {
      recordedAudio.pause();
      recordedAudio.currentTime = 0;
    });
    //as time is updated
    recordedAudio.addEventListener('timeupdate', () => {
      const targetPosition = recordedAudio.currentTime / recordedAudio.duration;
      setPosition(targetPosition)
    });
    //when speed is changed
    recordedAudio.addEventListener('ratechange', () => {
      setSpeed(recordedAudio.playbackRate);
    });
  }, [recordedAudio, setHasError, setIsReady,
    setIsPlaying, setPosition, setSpeed]);

  /**
   * Plays audio if audio is paused.
   * Pauses audio if audio is playing.
   */
  const togglePlayPause = useCallback(() => {
    if (recordedAudio.readyState < 2) return;
    if (recordedAudio.paused) {
      recordedAudio.play();
    } else {
      recordedAudio.pause();
    }
  }, [recordedAudio]);

  /**
   * Plays audio if audio is ready to be interacted with.
   */
  const play = useCallback(() => {
    if (recordedAudio.readyState < 2) return;
    recordedAudio.play();
    setIsPlaying(true);
  }, [recordedAudio, setIsPlaying]);

  /**
   * Pauses audio if audio is ready to be interacted with.
   */
  const pause = useCallback(() => {
    if (recordedAudio.readyState < 2) return;
    recordedAudio.pause();
    setIsPlaying(false);
  }, [recordedAudio, setIsPlaying]);

  /**
   * Rewinds audio if audio is ready to be interacted with.
   */
  const rewind = useCallback(() => {
    if (recordedAudio.readyState < 2) return;
    const targetTime = Math.max(recordedAudio.currentTime - 5, 0);
    recordedAudio.currentTime = targetTime;

  }, [recordedAudio]);

  /**
   * Moves audio forward if audio is ready to be interacted with.
   */
  const forward = useCallback(() => {
    if (recordedAudio.readyState < 2) return;
    const targetTime = Math.min(
      recordedAudio.currentTime + 5,
      recordedAudio.duration - 0.01
    );
    recordedAudio.currentTime = targetTime;
  }, [recordedAudio]);

  /**
   * Sends current position of audio to the beginning.
   */
  const beginning = useCallback(() => {
    if (recordedAudio.readyState < 2) return;
    recordedAudio.currentTime = 0;
  }, [recordedAudio]);

  /**
   * Moves current audio position to a designated time between 0 and 1
   * if audio is ready to be interacted with.
   */
  const setAudioPosition = useCallback((targetTime: number) => {
    if (recordedAudio.readyState < 2) return;
    recordedAudio.currentTime = recordedAudio.duration * targetTime;
  }, [recordedAudio.currentTime, recordedAudio.duration, recordedAudio.readyState]);

  /**
   * Changes the current audio speed to the designated speed if audio 
   * is ready to be interacted with.
   */
  const setAudioSpeed = useCallback((targetSpeed: number) => {
    if (recordedAudio.readyState < 2) return;
    recordedAudio.playbackRate = targetSpeed;
  }, [recordedAudio.playbackRate, recordedAudio.readyState]);

  /**
   * Enables toggling the audio on/off and rewinding/fast-forwarding
   * via keyboard navigation if audio is ready to be interacted with.
   */
  const handleKeyPress = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const key = e.key;
    if (recordedAudio.readyState < 2) return;
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
  }, [analytics, forward, rewind, recordedAudio.readyState, togglePlayPause])


  useEffect(() => {
    prepareAudioForPlayback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  return (
    <RecordedAudioContext.Provider
      value={{
        recordedAudioRef,
        startRecording,
        stopRecording,
        url,
        recordingState,
        supported,
        hasError,
        isReady,
        isPlaying,
        position,
        speed,
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
      {children}
    </RecordedAudioContext.Provider>
  );
};

export const useRecordedAudio = () => {
  return useContext(RecordedAudioContext);
};

