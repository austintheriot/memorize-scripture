//UtilityConfig
import axios from 'axios';
import { ESVApiKey } from './config';

//State
import {
	setAudioHasError,
	setAudioIsReady,
	setAudioPosition,
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
	storeMostRecentPassage,
	getTextBody,
	addToTextArray,
} from './localStorage';

//types
import { UtilityConfig } from './types';

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
