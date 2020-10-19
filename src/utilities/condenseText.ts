//ADD line breaks to existing string
//Original string should be able to be broken up

//FIRST split text up into good line breaks

//MIN LINE_LENGTH
//TARGET LINE_LENGTH
//maxLineLength

//Split original text into an array, separated by \n
//Scan until first punctuation -- how many characters?
//<= MIN_LINE_LENGTH? keep scanning for punctuation
//>= maxLineLength?
//If NO punctuation inside the line, split line directly in the middle
//If punctuation inside the line, split along punctuation

//currentCharacterCount number of characters in between punctuation
//Add chunks of numbers in to fill up each line:
//

//THEN condense the text

const insertBreak = (string: string, i: number) => {
	return string.slice(0, i + 1) + '\n' + string.slice(i + 1);
};

const findItemIndexes = (
	s: string,
	regex: any,
	i?: number,
	currentCharacterCount?: number
) => {
	if (i === undefined) i = 0; //analyze from beginning of string by default
	if (currentCharacterCount === undefined) currentCharacterCount = s.length; //analyze rest of the string by default
	const string = s.substr(i, i + currentCharacterCount);
	const itemIndexes: number[] = [];
	for (let j = 0; j < string.length; j++) {
		const ch = string[j];
		//search first for punctuation only
		if (ch.match(regex)) {
			itemIndexes.push(i + j);
		}
	}
	return itemIndexes;
};

const findPunctuationIndexes = (
	s: string,
	i?: number,
	currentCharacterCount?: number
) => {
	const regex = new RegExp(/[^A-Za-z0-9 _]/);
	return findItemIndexes(s, regex, i, currentCharacterCount);
};

const findSpaceIndexes = (
	s: string,
	i?: number,
	currentCharacterCount?: number
) => {
	const regex = new RegExp(' ');
	return findItemIndexes(s, regex, i, currentCharacterCount);
};

const findClosest = (
	string: string,
	callback: Function,
	i?: number,
	currentCharacterCount?: number
) => {
	if (i === undefined) i = 0; //analyze from beginning of string by default
	if (currentCharacterCount === undefined)
		currentCharacterCount = string.length; //analyze rest of the string by default
	const center = i + Math.floor(currentCharacterCount / 2);
	const indexesInString: number[] = callback(string, i, currentCharacterCount);

	const distancesFromCenter = indexesInString.map(
		(punctuation) => punctuation - center
	);

	let smallestDistanceFromCenter = Infinity;
	let arrayIndexOfClosestLocation = -1;
	distancesFromCenter.forEach((distance, i) => {
		if (Math.abs(distance) < smallestDistanceFromCenter) {
			arrayIndexOfClosestLocation = i;
			smallestDistanceFromCenter = Math.abs(distance);
		}
	});
	let stringIndexOfClosestItem = indexesInString[arrayIndexOfClosestLocation];
	let characterAtIndex = string[stringIndexOfClosestItem];

	return {
		smallestDistanceFromCenter,
		indexesInString,
		distancesFromCenter,
		stringIndexOfClosestItem,
		characterAtIndex,
	};
};

const findClosestPunctuation = (
	string: string,
	i?: number,
	currentCharacterCount?: number
) => {
	if (i === undefined) i = 0; //analyze from beginning of string by default
	if (currentCharacterCount === undefined)
		currentCharacterCount = string.length; //analyze rest of the string by default
	return findClosest(string, findPunctuationIndexes, i, currentCharacterCount);
};

const findClosestSpaces = (
	string: string,
	i?: number,
	currentCharacterCount?: number
) => {
	if (i === undefined) i = 0; //analyze from beginning of string by default
	if (currentCharacterCount === undefined)
		currentCharacterCount = string.length; //analyze rest of the string by default
	return findClosest(string, findSpaceIndexes, i, currentCharacterCount);
};

const findBestBreakPoint = (
	string: string,
	i?: number,
	currentCharacterCount?: number
) => {
	if (i === undefined) i = 0; //analyze from beginning of string by default
	if (currentCharacterCount === undefined)
		currentCharacterCount = string.length; //analyze rest of the string by default

	let punctuation = findClosestPunctuation(string, i, currentCharacterCount);
	let spaces = findClosestSpaces(string, i, currentCharacterCount);

	//if there is no punctuation with 10 characters of the middle, break the line on a space
	return punctuation.smallestDistanceFromCenter < 10
		? punctuation.stringIndexOfClosestItem
		: spaces.stringIndexOfClosestItem;
};

export const breakLines = (
	s: string,
	minLineLength?: number,
	maxLineLength?: number
) => {
	let string = s;
	if (minLineLength === undefined) minLineLength = 85;
	if (maxLineLength === undefined) maxLineLength = 115;

	let currentCharacterCount = 0;

	for (let i = string.length - 1; i >= 0; i--) {
		const ch = string[i];
		currentCharacterCount++;

		//TRUE for punctuation (not spaces)
		if (ch.match(/[^A-Za-z0-9 _]/)) {
			if (currentCharacterCount > minLineLength) {
				//long enough, not too long: break on the punctuation
				if (currentCharacterCount < maxLineLength) {
					string = insertBreak(string, i);
					currentCharacterCount = 0;
				}

				//too long: break on mid-point of the line, either on a space or on punctuation
				else {
					//Break in the middle
					string = insertBreak(
						string,
						findBestBreakPoint(string, i, currentCharacterCount)
					);
					//Break at the long point
					string = insertBreak(string, i);
					currentCharacterCount = 0;
				}

				//if not long enough
			}
		}
	}
	console.log(string);
	return string;
};

const Ephesians1 =
	'Blessed be the God and Father of our Lord Jesus Christ, ' +
	'who has blessed us in Christ with every spiritual blessing in the heavenly places, ' +
	'even as he chose us in him before the foundation of the world, ' +
	'that we should be holy and blameless before him. ' +
	'In love he predestined us for adoption to himself as sons through Jesus Christ, ' +
	'according to the purpose of his will, to the praise of his glorious grace, ' +
	'with which he has blessed us in the Beloved. ' +
	'In him we have redemption through his blood, the forgiveness of our trespasses, ' +
	'according to the riches of his grace, which he lavished upon us, ' +
	'in all wisdom and insight making known to us the mystery of his will, ' +
	'according to his purpose, which he set forth in Christ as a plan for the fullness of time, ' +
	'to unite all things in him, things in heaven and things on earth.\n\n';

breakLines(Ephesians1, 100, 150);
breakLines('This is a dumb example');

export const condenseText = (string: string) => {
	const array: string[] = [''];
	return array;
};
