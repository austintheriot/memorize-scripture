//UtilityConfig
import axios from 'axios';
import { ESVApiKey } from './config';

//State
import {
	setAudioHasError,
	setAudioIsReady,
	setAudioPosition,
	setAudioIsPlaying,
	setAudioSpeed,
} from '../state/audioSlice';
import {
	setBook,
	setChapter,
	setBody,
	setSplit,
	setCondensed,
} from '../state/textSlice';
import {
	setSearchBook,
	setSearchChapter,
	setSearchNumberOfChapters,
} from '../state/searchSlice';

//Utilities
import { bookChapters } from './bibleBookInfo';
import { condenseText, breakFullTextIntoLines } from './condenseText';
import {
	getPlaySpeed,
	storeMostRecentPassage,
	getTextBody,
	addToTextArray,
} from './localStorage';

//types
import { UtilityConfig, AudioType, AudioState } from './types';

export const updateSearchTerms = (
	book: string,
	chapter: string,
	config: UtilityConfig
) => {
	config.dispatch(setSearchBook(book));
	config.dispatch(setSearchChapter(chapter));
	const newNumberOfChapters = bookChapters[book]; //get chapter numbers
	config.dispatch(setSearchNumberOfChapters(newNumberOfChapters)); //set chapter numbers
};

export const updateResults = (
	book: string,
	chapter: string,
	body: string,
	config: UtilityConfig
) => {
	//Auio Settings:
	config.textAudio.pause();
	config.dispatch(setAudioHasError(false));
	config.dispatch(setAudioIsReady(false));
	config.dispatch(setAudioPosition(0));
	config.setTextAudio(
		new Audio(`https://audio.esv.org/hw/mq/${book} ${chapter}.mp3`)
	);

	//Text Results:
	config.dispatch(setBook(book === 'Psalms' ? 'Psalm' : book));
	config.dispatch(setChapter(chapter));
	config.dispatch(setBody(body));
	const lineBrokenText = breakFullTextIntoLines(body);
	config.dispatch(setSplit(lineBrokenText));
	config.dispatch(setCondensed(condenseText(lineBrokenText)));
};

export const fetchTextFromESVAPI = (
	book: string,
	chapter: string,
	config: UtilityConfig
) => {
	const title = `${book}+${chapter}`;
	console.log(`Fetching text body file of ${title} from ESV API`);

	config.analytics.logEvent('fetched_text_from_ESV_API', {
		book,
		chapter,
		title: `${book} ${chapter}`,
	});

	const textURL =
		'https://api.esv.org/v3/passage/text/?' +
		`q=${book.split(' ').join('+')}+${chapter}` +
		'&include-passage-references=false' +
		'&include-verse-numbers=false' +
		'&include-first-verse-numbers=false' +
		'&include-footnotes=false' +
		'&include-footnote-body=false' +
		'&include-headings=false' +
		'&include-selahs=false' +
		'&indent-paragraphs=10' +
		'&indent-poetry-lines=5' +
		'&include-short-copyright=false';

	axios
		.get(textURL, {
			headers: {
				Authorization: ESVApiKey,
			},
		})
		.then((response) => {
			console.log(`Text body of ${title} received from ESV API`);
			const body = response.data.passages[0];
			updateResults(book, chapter, body, config);
			storeMostRecentPassage(title);
			addToTextArray(title, body);
		})
		.catch((error) => {
			console.log(error);
			updateResults('', '', '', config);
		});
};

export const initializeMostRecentPassage = (config: UtilityConfig) => {
	console.log('Checking for most recent book and chapter.');
	const recent = window.localStorage.getItem('recent');
	if (recent) {
		console.log(`${recent} is the most recent chapter accessed.`);
		const book = recent.split('+')[0];
		const chapter = recent.split('+')[1];
		updateSearchTerms(book, chapter, config);

		//retrieve text body from local storage using title of most recent book and chapter
		const title = `${book}+${chapter}`;
		console.log(`Searching storage for ${title}`);
		let body = getTextBody(title);
		if (body) {
			console.log(`Retrieved text body of ${title} from local storage`);
			updateResults(book, chapter, body, config);
			config.analytics.logEvent('fetched_text_from_local_storage', {
				book,
				chapter,
				title: `${book} ${chapter}`,
			});
		} else {
			console.log(`${title} not found in local storage`);
			console.log(`Initializing results with Psalm 23 instead`);
			updateSearchTerms('Psalms', '23', config);
			fetchTextFromESVAPI('Psalms', '23', config);
		}
	} else {
		console.log(
			'A most recent book and chapter do not exist in local storage.'
		);
		console.log(`Initializing results with Psalm 23 instead`);
		updateSearchTerms('Psalms', '23', config);
		fetchTextFromESVAPI('Psalms', '23', config);
	}
};

export const initializeApp = (config: UtilityConfig) => {
	//Loading textAudio playback rate
	console.log(`Initializing playspeed with user's previous settings`);
	const targetSpeed = getPlaySpeed();
	config.dispatch(setAudioSpeed(targetSpeed));

	//Loading last-viewed book and chapter
	initializeMostRecentPassage(config);

	//Prevent pinch zoom in Safari
	document.addEventListener('gesturestart', function (e) {
		e.preventDefault();
		// special hack to prevent zoom-to-tabs gesture in safari
		document.body.style.zoom = '0.99';
	});

	document.addEventListener('gesturechange', function (e) {
		e.preventDefault();
		// special hack to prevent zoom-to-tabs gesture in safari
		document.body.style.zoom = '0.99';
	});

	document.addEventListener('gestureend', function (e) {
		e.preventDefault();
		// special hack to prevent zoom-to-tabs gesture in safari
		document.body.style.zoom = '0.99';
	});
};

export const initializeAudio = (
	textAudio: AudioType,
	audioSettings: AudioState,
	config: UtilityConfig
) => {
	//load the resource (necessary on mobile)
	textAudio.load();
	textAudio.currentTime = 0;
	textAudio.playbackRate = audioSettings.speed; //load textAudio settings

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
