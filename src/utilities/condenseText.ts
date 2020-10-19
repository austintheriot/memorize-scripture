//DEFAULTS
const MAX_LINE_LENGTH = 115;
const PRIMARY_PUNCTUATION_DISTANCE = 50;
const SECONDARY_PUNCTUATION_DISTANCE = 50;

//account for instances of combined punctuation

const findItemIndexes = (
	s: string,
	regex: any,
	i: number,
	characterCount: number
) => {
	//create substring to analyze
	const startingIndex = i + 1 - characterCount;
	const substring = s.substr(startingIndex, characterCount);
	const itemIndexes: number[] = [];
	for (let j = 0; j < substring.length; j++) {
		const ch = substring[j];
		//search first for punctuation only
		if (ch.match(regex)) {
			const tinystring = substring.substr(j);
			const indexOfNextSpace = tinystring.indexOf(' ');
			itemIndexes.push(startingIndex + j + indexOfNextSpace);
		}
	}
	return itemIndexes;
};

const findPrimaryPunctuationIndexes = (
	s: string,
	i: number,
	characterCount: number
) => {
	const regex = new RegExp(/[.!?”]/);
	return findItemIndexes(s, regex, i, characterCount);
};

const findSecondaryPunctuationIndexes = (
	s: string,
	i: number,
	characterCount: number
) => {
	const regex = new RegExp(/[^A-Za-z0-9 .!?”’\-_]/);
	return findItemIndexes(s, regex, i, characterCount);
};

const findSpaceIndexes = (s: string, i: number, characterCount: number) => {
	const regex = new RegExp(' ');
	return findItemIndexes(s, regex, i, characterCount);
};

const findClosest = (
	string: string,
	callback: Function,
	i: number,
	characterCount: number
) => {
	const center = i - Math.floor(characterCount / 2);
	const indexesInString: number[] = callback(string, i, characterCount);

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
	i: number,
	characterCount: number
) => {
	return findClosest(string, findPrimaryPunctuationIndexes, i, characterCount);
};

const findClosestSecondayPunctuation = (
	string: string,
	i: number,
	characterCount: number
) => {
	return findClosest(
		string,
		findSecondaryPunctuationIndexes,
		i,
		characterCount
	);
};

const findClosestSpaces = (
	string: string,
	i: number,
	characterCount: number
) => {
	//analyze whole string by default
	i = i ?? string.length - 1;
	characterCount = characterCount ?? string.length;

	return findClosest(string, findSpaceIndexes, i, characterCount);
};

const findBestBreakPoint = (
	string: string,
	primaryPunctuationDistance: number,
	secondaryPunctuationDistance: number
) => {
	const i: number = string.length - 1;
	const characterCount: number = string.length;

	let primaryPunctuation = findClosestPrimaryPunctuation(
		string,
		i,
		characterCount
	);
	let secondaryPunctuation = findClosestSecondayPunctuation(
		string,
		i,
		characterCount
	);
	let spaces = findClosestSpaces(string, i, characterCount);

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
	maxLineLength: number = MAX_LINE_LENGTH,
	primaryPunctuationDistance: number,
	secondaryPunctuationDistance: number
): string => {
	if (string.length < maxLineLength) return string;
	let breakPoint = findBestBreakPoint(string, 50, 50);
	const string1 = string.substring(0, breakPoint + 1);
	const string2 = string.substr(breakPoint + 1);
	return `${breakLines(
		string1,
		maxLineLength,
		primaryPunctuationDistance,
		secondaryPunctuationDistance
	)}\n${breakLines(
		string2,
		maxLineLength,
		primaryPunctuationDistance,
		secondaryPunctuationDistance
	)}`;
};

export const breakFullTextIntoLines = (
	string: string,
	maxLineLength: number = MAX_LINE_LENGTH,
	primaryPunctuationDistance: number = PRIMARY_PUNCTUATION_DISTANCE,
	secondaryPunctuationDistance: number = SECONDARY_PUNCTUATION_DISTANCE
): string[] => {
	return (
		string
			.split('\n') //break into array based on existing line breaks
			.map((
				innerString //split individual elements further recursively
			) =>
				breakLines(
					innerString,
					maxLineLength,
					primaryPunctuationDistance,
					secondaryPunctuationDistance
				)
			)
			//join & split here move the inner line breaks into the primary string,
			//creating a "shallow" array/string without any inner line breaks
			.join('\n')
			.split('\n')
	);
};

export const condenseText = (string: string) => {
	const array: string[] = [''];
	return array;
};
