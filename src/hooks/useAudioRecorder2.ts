import { useEffect, useRef, useState } from 'react';

const constraints = { audio: true };

export default function useAudioRecorder() {
  const mediaRecorder = useRef<MediaRecorder | undefined>();
  const chunks = useRef<Blob[]>([]);
  const localStream = useRef<MediaStream | undefined>();
  const [enabled, setEnabled] = useState(false);
  const containerType = useRef("video/webm"); //defaults to webm but we switch to mp4 on Safari 14.0.2+
  const [url, setUrl] = useState('');

  const init = () => {
    if (!navigator.mediaDevices.getUserMedia) {
      alert(
        'navigator.mediaDevices.getUserMedia not supported on your browser, use the latest version of Firefox or Chrome',
      );
    } else {
      if (window.MediaRecorder === undefined) {
        alert(
          'MediaRecorder not supported on your browser, use the latest version of Firefox or Chrome',
        );
      } else {
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            localStream.current = stream;
    
            localStream.current.getTracks().forEach((track) => {
              if (track.kind === 'audio') {
                track.onended = (event) => {
                  console.log(
                    'audio track.onended Audio track.readyState=' +
                      track.readyState +
                      ', track.muted=' +
                      track.muted,
                  );
                };
              }
              if (track.kind === 'video') {
                track.onended = (event) => {
                  console.log(
                    'video track.onended Audio track.readyState=' +
                      track.readyState +
                      ', track.muted=' +
                      track.muted,
                  );
                };
              }
            });    
          })
          .catch(function (err) {
            /* handle the error */
            console.log('navigator.getUserMedia error: ' + err);
          });
      }
    }
    
  }

  const record = () => {
    if (!localStream.current) {
      alert('Could not get local stream from mic/camera');
    }else {
      setEnabled(false);
  
      chunks.current = [];
  
      /* use the stream */
      console.log('Start recording...');
      if (typeof MediaRecorder.isTypeSupported == 'function'){
        /*
          MediaRecorder.isTypeSupported is a function announced in https://developers.google.com/web/updates/2016/01/mediarecorder and later introduced in the MediaRecorder API spec http://www.w3.org/TR/mediastream-recording/
        */
        let options = { mimeType: '' };
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
          options = {mimeType: 'video/webm;codecs=vp9'};
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
          options = {mimeType: 'video/webm;codecs=h264'};
        } else  if (MediaRecorder.isTypeSupported('video/webm')) {
          options = {mimeType: 'video/webm'};
        } else  if (MediaRecorder.isTypeSupported('video/mp4')) {
          //Safari 14.0.2 has an EXPERIMENTAL version of MediaRecorder enabled by default
          containerType.current = "video/mp4";
          options = {mimeType: 'video/mp4'};
        }
        console.log('Using ' + options.mimeType);
        mediaRecorder.current = new MediaRecorder(localStream.current, options);
      }else{
        console.log('isTypeSupported is not supported, using default codecs for browser');
        mediaRecorder.current = new MediaRecorder(localStream.current);
      }
  
      mediaRecorder.current.ondataavailable = (e) => {
        console.log('mediaRecorder.ondataavailable, e.data.size='+e.data.size);
        if (e.data && e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };
  
      mediaRecorder.current.onerror = (e) => {
        console.log('mediaRecorder.onerror: ' + e);
      };
  
      mediaRecorder.current.onstart = function(){
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
  
      mediaRecorder.current.onstop = function(){
        console.log('mediaRecorder.onstop, mediaRecorder.state = ' + mediaRecorder.current?.state);
  
        //var recording = new Blob(chunks, {type: containerType});
        const recording = new Blob(chunks.current, {type: mediaRecorder.current?.mimeType});
        
  
        setUrl(URL.createObjectURL(recording));
      };
  
      mediaRecorder.current.onpause = () => {
        console.log('mediaRecorder.onpause, mediaRecorder.state = ' + mediaRecorder.current?.state);
      }
  
      mediaRecorder.current.onresume = () => {
        console.log('mediaRecorder.onresume, mediaRecorder.state = ' + mediaRecorder.current?.state);
      }
  
      mediaRecorder.current.start(1000);
  
      localStream.current.getTracks().forEach((track) => {
        console.log(track.kind+":"+JSON.stringify(track.getSettings()));
        console.log(track.getSettings());
      })
    }
  }

const stop = () => {
	if (mediaRecorder.current) mediaRecorder.current.stop();
}

  useEffect(() => {
    init();
  }, [])

  return {
    record,
    stop,
    url,
    enabled,
  }
}