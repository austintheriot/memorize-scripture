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

////////////////////////////////////// PUNCTUATION PRIORITY
//When breaking a text:
//Search for PRIMARY PUNCTUATION first . " ? ! etc. (search a long distance away)
//Search for SECONDARY PUNCTAION NEXT , (search a shorter distance away)

////////////////////////////////////// ORDER OF LINE SPLITTING
//Split an entire text "in half"
//Split texts more and more until each line fits under the MAX_LINE_LENGTH LIMIT?

//Split text linearly as the counter progresses through each line, counting max line length etc.

const insertBreak = (string: string, i: number) => {
	return string.slice(0, i + 1) + '\n' + string.slice(i + 1);
};

const findItemIndexes = (
	s: string,
	regex: any,
	i: number = s.length - 1, //analyze whole string by default
	currentCharacterCount: number = s.length
) => {
	//create substring to analyze
	const startingIndex = i + 1 - currentCharacterCount;
	const string = s.substr(startingIndex, currentCharacterCount);
	console.log(string);
	const itemIndexes: number[] = [];
	for (let j = 0; j < string.length; j++) {
		const ch = string[j];
		//search first for punctuation only
		if (ch.match(regex)) {
			itemIndexes.push(startingIndex + j);
		}
	}
	return itemIndexes;
};

const findPrimaryPunctuationIndexes = (
	s: string,
	i?: number,
	currentCharacterCount?: number
) => {
	const regex = new RegExp(/[.!?”’]/);
	return findItemIndexes(s, regex, i, currentCharacterCount);
};

const findSecondaryPunctuationIndexes = (
	s: string,
	i?: number,
	currentCharacterCount?: number
) => {
	const regex = new RegExp(/[^A-Za-z0-9 .!?”’_]/);
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
	i: number = string.length - 1, //analyze whole string by default
	currentCharacterCount: number = string.length
) => {
	const center = i - Math.floor(currentCharacterCount / 2);
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

const findClosestPrimaryPunctuation = (
	string: string,
	i?: number,
	currentCharacterCount?: number
) => {
	//analyze whole string by default
	i = i ?? string.length - 1;
	currentCharacterCount = currentCharacterCount ?? string.length;

	return findClosest(
		string,
		findPrimaryPunctuationIndexes,
		i,
		currentCharacterCount
	);
};

const findClosestSecondayPunctuation = (
	string: string,
	i?: number,
	currentCharacterCount?: number
) => {
	//analyze whole string by default
	i = i ?? string.length - 1;
	currentCharacterCount = currentCharacterCount ?? string.length;

	return findClosest(
		string,
		findSecondaryPunctuationIndexes,
		i,
		currentCharacterCount
	);
};

const findClosestSpaces = (
	string: string,
	i?: number,
	currentCharacterCount?: number
) => {
	//analyze whole string by default
	i = i ?? string.length - 1;
	currentCharacterCount = currentCharacterCount ?? string.length;

	return findClosest(string, findSpaceIndexes, i, currentCharacterCount);
};

const findBestBreakPoint = (
	string: string,
	i: number = string.length - 1,
	currentCharacterCount: number = string.length,
	primaryPunctuationDistance: number = 20,
	secondaryPunctuationDistance: number = 10
) => {
	let primaryPunctuation = findClosestPrimaryPunctuation(
		string,
		i,
		currentCharacterCount
	);
	let secondaryPunctuation = findClosestSecondayPunctuation(
		string,
		i,
		currentCharacterCount
	);
	let spaces = findClosestSpaces(string, i, currentCharacterCount);

	console.log({
		primaryPunctuation,
		secondaryPunctuation,
		spaces,
	});

	//prioritize primary puncutation, then secondary punctuation, and then spacesw
	return primaryPunctuation.smallestDistanceFromCenter <
		primaryPunctuationDistance
		? primaryPunctuation.stringIndexOfClosestItem
		: secondaryPunctuation.smallestDistanceFromCenter <
		  secondaryPunctuationDistance
		? secondaryPunctuation.stringIndexOfClosestItem
		: spaces.stringIndexOfClosestItem;
};

export const breakLines = (
	string: string,
	minLineLength?: number,
	maxLineLength?: number
) => {
	if (minLineLength === undefined) minLineLength = 85;
	if (maxLineLength === undefined) maxLineLength = 115;

	if (string.length < maxLineLength) return string;
	let breakPoint = findBestBreakPoint(string);
	let breakPointCharacter = string[breakPoint];
	let newString = insertBreak(
		string,
		findBestBreakPoint(string, undefined, undefined, 50, 25)
	);

	console.log({
		breakPoint,
		breakPointCharacter,
		newString,
	});
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

breakLines(Ephesians1, 85, 100);
breakLines('This is a dumb example');

export const condenseText = (string: string) => {
	const array: string[] = [''];
	return array;
};
