import { BibleBook } from "pages/Learn/bible";
import { Psalm23 } from 'app/Psalm23';


export const localStorageVersion = '1.0.0' as const;
export const DEFAULT_LOCAL_STORAGE_VERSION = localStorageVersion;
export const DEFAULT_CLICKED_LINE = -1 as const;
export const DEFAULT_SHOW_CONDENSED = false as const;
export const DEFAULT_TEXTS = [{ title: 'Psalm 23', body: Psalm23 }];
export const DEFAULT_SPEED = 1 as const;

export type TextsObject = { title: string; body: string };
export type TextsArray = TextsObject[];

/**
 * Used to type check the actual values assigned to local storage as default.
 */
interface LocalStorageDefaults {
	clickedLine: typeof DEFAULT_CLICKED_LINE,
	showCondensed: typeof DEFAULT_SHOW_CONDENSED,
	texts: typeof DEFAULT_TEXTS,
	recent: undefined,
	localStorageVersion: typeof DEFAULT_LOCAL_STORAGE_VERSION,
	speed: typeof DEFAULT_SPEED,
}

/**
 * More general types that can be returned from local storage.
 */
interface LocalStorageTypes {
	clickedLine: number,
	showCondensed: boolean,
	texts: TextsArray,
	recent: undefined,
	localStorageVersion: string,
	speed: number,
}
type LocalStorageKeys = keyof LocalStorageDefaults;
type LocalStorageValues<K extends LocalStorageKeys = LocalStorageKeys> = LocalStorageTypes[K];

export const removeLocalStorage = (key: LocalStorageKeys) => {
	window.localStorage.removeItem(key);
};

export type SetLocalStorage = <K extends LocalStorageKeys>(
	key: K,
	value: LocalStorageTypes[K],
) => void;
export const setLocalStorage: SetLocalStorage = (key, value) => {
	console.log(`Storing ${key} as ${value} in local storage`);
	const keyString = JSON.stringify(key);
	const valueString = JSON.stringify(value);
	window.localStorage.setItem(keyString, valueString);
};

export type GetLocalStorage = <K extends LocalStorageKeys>(
	key: K,
) => LocalStorageValues<K> | null;
export const getLocalStorage: GetLocalStorage = (key) => {
	try {
		const stringValue = window.localStorage.getItem(key);
		return stringValue ? JSON.parse(stringValue) : null;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export type GetLocalStorageAndLog = <K extends LocalStorageKeys>(
	key: K, defaultValue: LocalStorageDefaults[K]
) => LocalStorageValues<K>;
export const getLocalStorageValueAndLog: GetLocalStorageAndLog = (key, defaultValue) => {
	console.log(`Retrieving ${key} from local storage`);
	const value = getLocalStorage(key) || defaultValue;
	console.log(`localStorage: ${key} = ${value}`);
	return value;
}

export const getPlaySpeed = () => getLocalStorageValueAndLog('speed', DEFAULT_SPEED);
export const getShowCondensed = () => getLocalStorageValueAndLog('showCondensed', DEFAULT_SHOW_CONDENSED);
export const getTextArray = () => getLocalStorageValueAndLog('texts', DEFAULT_TEXTS);
export const getMostRecentText = () => getTextArray()[0];
export const getUserSettings = () => {
	const targetSpeed = getPlaySpeed();
	const showCondensed = getShowCondensed();
	return {
		targetSpeed,
		showCondensed,
	};
};

export const storePlaySpeed = (speed: number) => setLocalStorage('speed', speed);
export const storeShowCondensed = (boolean: boolean) => setLocalStorage('showCondensed', boolean);

export const splitTitleIntoBookAndChapter = (
	title: string,
): {
	book: BibleBook;
	chapter: string;
} => {
	const wordArray = title.split(' ');
	const book = wordArray.slice(0, wordArray.length - 1).join(' ') as BibleBook;
	const chapter = wordArray[wordArray.length - 1];
	return { book, chapter };
};

const shiftArrayByOne = (
	originalArray: TextsArray,
	title: string,
	body: string,
): TextsArray => {
	try {
		const array = [...originalArray].map((el) => ({ ...el }));
		//store no more than 5 passages at a time
		if (array.length === 5) array.pop();
		array.unshift({
			title,
			body,
		});
		return array;
	} catch (err) {
		console.log(err);
		return [{ title: '', body: '' }];
	}
};

const movePassageToFrontOfArray = (title: string): TextsArray | typeof DEFAULT_TEXTS => {
	try {
		console.log(`Moving ${title} to the front of the text body array`);
		const array = getTextArray();
		const titleIndex = array.findIndex((el) => el.title === title);
		if (titleIndex <= 0) return array;
		const extractedText = array.splice(titleIndex, 1)[0]; //extract and move to front
		array.unshift(extractedText);
		return array;
	} catch (err) {
		console.log(err);
		return [{ title: '', body: '' }];
	}
};

export const getTextBody = (title: string): string => {
	try {
		const textArray = getTextArray();
		const text = textArray.find((el) => el.title === title);
		return text?.body || '';
	} catch (err) {
		console.log(err);
		return '';
	}
};

/**
 * Saves a chapter title and the body of its text in local storage.
 * If passage is alreadty in local storage, moves the passage to 
 * the most recent position.
 */
export const addToTextArray = (title: string, body: string) => {
	console.log(
		`Checking if ${title} text body already exists in local storage array`,
	);
	let passageIsInLocalStorage = !!getTextBody(title);
	if (passageIsInLocalStorage) {
		console.log(`${title} text body already exists in local storage array`);
		const shiftedArray = movePassageToFrontOfArray(title);
		setLocalStorage('texts', shiftedArray);
		return;
	} else {
		console.log(`${title} text body does not exist in local storage array`);
		console.log(
			`Adding ${title} text body to local storage array as most recent`,
		);
		const textArray = getTextArray();
		let shiftedArray: TextsArray = [{ title: '', body: '' }];

		//no true item has been added yet
		if (textArray.length === 1 && textArray[0].title === '') {
			shiftedArray[0] = { title, body };
		}
	
		//other, real items have been added
		else {
			shiftedArray = shiftArrayByOne(textArray, title, body);
		}

		setLocalStorage('texts', shiftedArray);
	}
};
