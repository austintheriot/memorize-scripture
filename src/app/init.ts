//State
import {
	canPlayEvent,
	pauseEvent,
	playEvent,
	errorEvent,
	playingEvent,
	timeupdateEvent,
	ratechangeEvent,
	audioSettingsLoaded,
	audioFileChanged,
} from './audioSlice';
import { textInitialized, textSettingsLoaded } from './textSlice';
import {
	addToTextArray,
	getMostRecentText,
	splitTitleIntoBookAndChapter,
	getUserSettings,
} from './storage';
import { UtilityConfig, AudioState } from './types';
import { Psalm23 } from './Psalm23';
import { searchInitialized } from './searchSlice';

const initializeUserSettings = (config: UtilityConfig) => {
	//Loading audio playback rate
	console.log(`Initializing user's settings.`);
	const { targetSpeed, showCondensed } = getUserSettings();
	config.dispatch(audioSettingsLoaded(targetSpeed));
	config.dispatch(textSettingsLoaded(showCondensed));
};

const updateStateWithInitializedValues = (
	title: string,
	body: string,
	config: UtilityConfig
) => {
	const { book, chapter } = splitTitleIntoBookAndChapter(title);
	//Search State
	config.dispatch(searchInitialized({ book, chapter }));
	//Text State
	config.dispatch(
		textInitialized({
			book: book === 'Psalms' ? 'Psalm' : book,
			chapter,
			body,
		})
	);
	const newAudioUrl = `https://audio.esv.org/hw/mq/${book} ${chapter}.mp3`;
	config.setAudio(new Audio(newAudioUrl));
};

export const initializeMostRecentPassage = (config: UtilityConfig) => {
	console.log('Searching storage for most recent book and chapter.');
	const { title, body } = getMostRecentText();
	if (title && body) {
		console.log(`${title} is the most recent text accessed.`);
		updateStateWithInitializedValues(title, body, config);
	} else {
		console.log(
			'A most recent book and chapter do not exist in local storage.'
		);
		console.log(`Leaving Psalm 23 as initialized passage.`);
		addToTextArray('Psalms 23', Psalm23);
	}
};

/* Wipes any faulty local storage settings from previous versions */
const initLocalStorage = () => {
	console.log('Initializing local storage and checking for errors');
	try {
		window.localStorage.removeItem('recent');
		const clickedLine = window.localStorage.getItem('clickedLine');
		if (isNaN(Number(clickedLine)))
			window.localStorage.setItem('clickedLine', '-1');
		const showCondensed = window.localStorage.getItem('showCondensed');
		if (showCondensed !== 'true' && showCondensed !== 'false')
			window.localStorage.setItem('showCondensed', 'false');
		const texts = window.localStorage.getItem('texts');
		if (texts === 'null' || texts === 'undefined')
			window.localStorage.setItem('texts', `[{title: '', body: ''}]`);
		if (texts !== null && typeof JSON.parse(texts) !== 'object')
			window.localStorage.setItem('texts', `[{title: '', body: ''}]`);
		if (texts !== null && texts.includes('+'))
			window.localStorage.setItem('texts', `[{title: '', body: ''}]`);
	} catch (err) {
		console.log(err);
		console.log('Error detected in local storage. Clearing local storage');
		window.localStorage.clear();
	}
};

export const initializeApp = (config: UtilityConfig) => {
	initLocalStorage();
	initializeUserSettings(config);
	initializeMostRecentPassage(config);
};

export const prepareAudioForPlayback = (
	audio: HTMLAudioElement,
	audioState: AudioState,
	config: UtilityConfig
) => {
	audio.pause();
	config.dispatch(
		audioFileChanged({
			hasErrors: false,
			isReady: false,
			position: 0,
		})
	);
	//load the resource (necessary on mobile)
	audio.load();
	audio.currentTime = 0;
	audio.playbackRate = audioState.speed; //load audio settings

	//loaded enough to play
	audio.addEventListener('canplay', () => {
		config.dispatch(canPlayEvent());
	});
	audio.addEventListener('pause', () => {
		config.dispatch(pauseEvent());
	});
	audio.addEventListener('play', () => {
		config.dispatch(playEvent());
	});
	audio.addEventListener('error', () => {
		config.dispatch(errorEvent());
	});
	//not enough data
	audio.addEventListener('waiting', () => {
		//No action currently selected for this event
	});
	//ready to play after waiting
	audio.addEventListener('playing', () => {
		config.dispatch(playingEvent());
	});
	//audio is over
	audio.addEventListener('ended', () => {
		audio.pause();
		audio.currentTime = 0;
	});
	//as time is updated
	audio.addEventListener('timeupdate', () => {
		const targetPosition = audio.currentTime / audio.duration;
		config.dispatch(timeupdateEvent(targetPosition));
	});
	//when speed is changed
	audio.addEventListener('ratechange', () => {
		config.dispatch(ratechangeEvent(audio.playbackRate));
	});
};
