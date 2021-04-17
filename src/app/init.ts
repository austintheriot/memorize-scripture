//State
import { audioSettingsLoaded, audioInitialized } from '../store/audioSlice';
import { textInitialized, textSettingsLoaded } from '../store/textSlice';
import {
	addToTextArray,
	getMostRecentText,
	splitTitleIntoBookAndChapter,
	getUserSettings,
} from '../utils/storageUtils';
import { UtilityConfig } from './types';
import { Psalm23 } from './Psalm23';
import { searchInitialized } from '../store/searchSlice';
import {
	getLocalStorage,
	removeLocalStorage,
	setLocalStorage,
	localStorageVersion,
	DEFAULT_CLICKED_LINE,
	DEFAULT_SHOW_CONDENSED,
	DEFAULT_TEXTS,
} from 'utils/storageUtils';
import { AppDispatch } from 'store/store';

const initializeUserSettings = (dispatch: AppDispatch) => {
	//Loading textAudio playback rate
	console.log(`Initializing user's settings.`);
	const { targetSpeed, showCondensed } = getUserSettings();
	dispatch(audioSettingsLoaded(targetSpeed));
	dispatch(textSettingsLoaded(showCondensed));
};

/**
 * Updates Redux state with updated list of chapters,
 * the most recently used text, and the proper URL to load audio.
 */
const updateStateWithInitializedValues = (
	title: string,
	body: string,
	dispatch: AppDispatch,
) => {
	const { book, chapter } = splitTitleIntoBookAndChapter(title);
	//Search State
	dispatch(searchInitialized({ book, chapter }));
	//Text State
	dispatch(
		textInitialized({
			book,
			chapter,
			body,
		}),
	);
	//Audio State
	dispatch(audioInitialized({ book, chapter }));
};

/**
 * Searches local storage for the most recently stored passage. 
 * If none is found, chooses Psalm 23.
 */
export const initializeMostRecentPassage = (dispatch: AppDispatch) => {
	console.log('Searching storage for most recent book and chapter.');
	const { title, body } = getMostRecentText();
	if (title && body) {
		console.log(`${title} is the most recent text accessed.`);
		updateStateWithInitializedValues(title, body, dispatch);
	} else {
		console.log(
			'A most recent book and chapter do not exist in local storage.',
		);
		console.log(`Leaving Psalm 23 as initialized passage.`);
		addToTextArray('Psalms 23', Psalm23);
	}
};

/**
 * Checks local storage for the version storage and also checks for any faulty values.
 * If any problems occur, resets local storage.
 */
const initLocalStorage = () => {
	console.log('Initializing local storage and checking for errors');
	try {
		const returnedLocalStorageVersion = getLocalStorage('localStorageVersion');
		if (returnedLocalStorageVersion !== localStorageVersion) {
			console.log(`Local storage version ${returnedLocalStorageVersion} does not match ` + 
			`app's storage version ${localStorageVersion}. Clearing and re-initializing local storage.`);
			window.localStorage.clear();
			setLocalStorage('clickedLine', DEFAULT_CLICKED_LINE);
			setLocalStorage('showCondensed', DEFAULT_SHOW_CONDENSED);
			setLocalStorage('texts', DEFAULT_TEXTS);
			return;
		}

		removeLocalStorage('recent');

		const clickedLine = getLocalStorage('clickedLine');
		if (clickedLine === null || isNaN(Number(clickedLine)))
			setLocalStorage('clickedLine', DEFAULT_CLICKED_LINE);

		const showCondensed = getLocalStorage('showCondensed');
		if (showCondensed === null || typeof showCondensed !== 'boolean') {
			setLocalStorage('showCondensed', DEFAULT_SHOW_CONDENSED);
		}
		
		const texts = getLocalStorage('texts') as any;
		if (texts === null || (texts !== null && texts.includes('+'))) {
			setLocalStorage('texts', DEFAULT_TEXTS);
		}
	} catch (err) {
		console.log(err);
		console.log('Error detected in local storage. Clearing local storage');
		window.localStorage.clear();
	}
};

export const initializeApp = (dispatch: AppDispatch) => {
	initLocalStorage();
	initializeUserSettings(dispatch);
	initializeMostRecentPassage(dispatch);
};
