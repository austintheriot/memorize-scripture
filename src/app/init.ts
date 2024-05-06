import {
	CondensedState,
	fetchTextFromESVAPI,
	textInitialized,
	toggleCondensedTextView,
} from '../store/textSlice';
import {
	getMostRecentText,
	splitTitleIntoBookAndChapter,
	getUserSettings,
	DEFAULT_LOCAL_STORAGE_VERSION,
} from '../utils/storageUtils';
import {
	searchInitialized,
	setAudioUrl,
	setBook,
	setChapter,
} from '../store/searchSlice';
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
  localStorageVersion,
  DEFAULT_CLICKED_LINE,
  DEFAULT_CONDENSED_STATE,
  DEFAULT_TEXTS,
} from "~/utils/storageUtils";
import { AppDispatch } from "~/store/store";
import { BibleBook, Chapter, Title } from "~/pages/Memorize/bible";
import { validateBookAndChapter } from "~/utils/validation";
import { batch } from 'react-redux';

/**
 * Gets any of the user's preferences that are saved in local storage.
 * Moves those settings into Redux.
 */
const initializeUserSettings = () => (dispatch: AppDispatch) => {
	//Loading textAudio playback rate
	console.log(`Initializing user's settings.`);
	const { condensedState } = getUserSettings();
	if (condensedState) dispatch(toggleCondensedTextView(condensedState));
};

/**
 * Updates Redux state with updated list of chapters,
 * the most recently used text, and the proper URL to load audio.
 */
const updateStateWithInitializedValues = (
	title: Title,
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
	dispatch(setAudioUrl({ book, chapter }));
};

/**
 * Searches local storage for the most recently stored passage.
 * If none is found, chooses Psalm 23.
 */
export const initializeMostRecentPassage = () => (dispatch: AppDispatch) => {
	console.log('Searching storage for most recent book and chapter.');
	const { title, body } = getMostRecentText();
	console.log(`${title} is the most recent text accessed.`);

	// check for any query parameters supplied
	const queryParameters = new URL(window.location.href).searchParams;
	const queryBook = queryParameters.get('book');
	const queryChapter = queryParameters.get('chapter');
	const queryCondensedTextView = queryParameters.get('view');
	const error = validateBookAndChapter(queryBook, queryChapter);

	if (queryCondensedTextView) {
		if (!['plain', 'condensed', 'hidden'].includes(queryCondensedTextView)) {
			console.log('View query parameter is not valid, ignoring');
		} else {
			console.log('Setting condensed text view to view query parameter');
			dispatch(toggleCondensedTextView(queryCondensedTextView as CondensedState));
		}
	}

	if (queryBook && queryChapter) {
		if (error) {
			console.log('Query parameter book and/or chapter are not valid');
		} else {
			console.log('Fetching bible text using query parameters');
			const validBook = queryBook as BibleBook;
			const validChapter = queryChapter as Chapter;
			batch(() => {
				dispatch(setBook(validBook));
				dispatch(setChapter(validChapter));
			});
			dispatch(fetchTextFromESVAPI(validBook, validChapter));
			return;
		}
	}
	console.log(
		'No query parameters supplied or they were not valid. Using most recent text',
	);
	updateStateWithInitializedValues(title, body, dispatch);
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
			console.log(
				`Local storage version ${returnedLocalStorageVersion} does not match ` +
					`app's storage version ${localStorageVersion}. Clearing and re-initializing local storage.`,
			);
			window.localStorage.clear();
			setLocalStorage('localStorageVersion', DEFAULT_LOCAL_STORAGE_VERSION);
			setLocalStorage('clickedLine', DEFAULT_CLICKED_LINE);
			setLocalStorage('condensedState', DEFAULT_CONDENSED_STATE);
			setLocalStorage('texts', DEFAULT_TEXTS);
			return;
		}

		removeLocalStorage('recent');

		const clickedLine = getLocalStorage('clickedLine');
		if (clickedLine === null || isNaN(Number(clickedLine)))
			setLocalStorage('clickedLine', DEFAULT_CLICKED_LINE);

		const condensedState = getLocalStorage('condensedState');
		if (condensedState === null || typeof condensedState !== 'boolean') {
			setLocalStorage('condensedState', DEFAULT_CONDENSED_STATE);
		}

		const texts = getLocalStorage('texts') as any;
		if (texts === null || (texts !== null && texts.includes('+'))) {
			setLocalStorage('texts', DEFAULT_TEXTS);
		}
	} catch (err) {
		console.log(err);
		window.localStorage.clear();
	}
};
export const initializeApp = () => (dispatch: AppDispatch) => {
	initLocalStorage();
	dispatch(initializeUserSettings());
	dispatch(initializeMostRecentPassage());
};
