//State
import {
	setAudioHasError,
	setAudioIsReady,
	setAudioPosition,
	setAudioIsPlaying,
	setAudioSpeed,
} from './state/audioSlice';
import { setShowCondensed, setClickedLine } from './state/textSlice';
import {
	getShowCondensed,
	getClickedLine,
	getPlaySpeed,
	addToTextArray,
	getMostRecentText,
} from '../views/Home/storage';
import { updateSearchTerms, updateResults } from '../views/Home/updateState';
import { UtilityConfig, AudioState } from './types';
import { Psalm23 } from './state/Psalm23';

const splitTitleIntoBookAndChapter = (title: string) => {
	const wordArray = title.split(' ');
	const book = wordArray.slice(0, wordArray.length - 1).join(' ');
	const chapter = wordArray[wordArray.length - 1];
	return { book, chapter };
};

export const initializeMostRecentPassage = (config: UtilityConfig) => {
	console.log('Searching storage for most recent book and chapter.');
	const { title, body } = getMostRecentText();
	if (title && body) {
		console.log(`${title} is the most recent text accessed.`);
		const { book, chapter } = splitTitleIntoBookAndChapter(title);
		updateSearchTerms(book, chapter, config);
		updateResults(book, chapter, body, config);
		config.analytics.logEvent('fetched_text_from_local_storage', {
			book,
			chapter,
			title: `${book} ${chapter}`,
		});
	} else {
		console.log(
			'A most recent book and chapter do not exist in local storage.'
		);
		console.log(`Leaving Psalm 23 as initialized passage.`);
		addToTextArray('Psalms 23', Psalm23);
	}
};

export const initializeApp = (config: UtilityConfig) => {
	//Loading textAudio playback rate
	console.log(`Initializing user's settings.`);
	const targetSpeed = getPlaySpeed();
	config.dispatch(setAudioSpeed(targetSpeed));
	const showCondensed = getShowCondensed();
	config.dispatch(setShowCondensed(showCondensed));
	const clickedLine = getClickedLine();
	config.dispatch(setClickedLine(clickedLine));
	//Loading last-viewed book and chapter
	initializeMostRecentPassage(config);
};

export const prepareAudioForPlayback = (
	textAudio: HTMLAudioElement,
	audioState: AudioState,
	config: UtilityConfig
) => {
	//load the resource (necessary on mobile)
	textAudio.load();
	textAudio.currentTime = 0;
	textAudio.playbackRate = audioState.speed; //load textAudio settings

	//loaded enough to play
	textAudio.addEventListener('canplay', () => {
		config.dispatch(setAudioIsReady(true));
	});
	textAudio.addEventListener('pause', () => {
		config.dispatch(setAudioIsPlaying(false));
	});
	textAudio.addEventListener('play', () => {
		config.dispatch(setAudioIsPlaying(true));
	});
	textAudio.addEventListener('error', () => {
		config.dispatch(setAudioHasError(true));
	});
	//not enough data
	textAudio.addEventListener('waiting', () => {
		//No action currently selected for this event
	});
	//ready to play after waiting
	textAudio.addEventListener('playing', () => {
		config.dispatch(setAudioIsReady(true));
	});
	//textAudio is over
	textAudio.addEventListener('ended', () => {
		textAudio.pause();
		textAudio.currentTime = 0;
	});
	//as time is updated
	textAudio.addEventListener('timeupdate', () => {
		config.dispatch(
			setAudioPosition(textAudio.currentTime / textAudio.duration)
		);
	});
	//when speed is changed
	textAudio.addEventListener('ratechange', () => {
		config.dispatch(setAudioSpeed(textAudio.playbackRate));
	});
};
