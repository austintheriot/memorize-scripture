//DEFAULTS
const MAX_LINE_LENGTH = 125;
const PRIMARY_PUNCTUATION_DISTANCE = 50;
const SECONDARY_PUNCTUATION_DISTANCE = 50;
const PRIMARY_PUNCTUATION = /[.!?”—]/;
const SECONDARY_PUNCTUATION = /[^A-Za-z0-9 .!?”’\-_]/;

//account for instances of combined punctuation

const findItemIndexes = (
	s: string,
	regex: any,
	i: number,
	characterCount: number,
	findingSpaces: boolean = false
) => {
	//create substring to analyze
	const itemIndexes: number[] = [];
	const startingIndex = i + 1 - characterCount;
	const substring = s.substr(startingIndex, characterCount);

	//search substring for given regex & add location to array
	for (
		let subStringIndex = 0;
		subStringIndex < substring.length;
		subStringIndex++
	) {
		const ch = substring[subStringIndex];
		if (ch.match(regex)) {
			//if finding closest spaces, simply add location to array
			if (findingSpaces) {
				itemIndexes.push(startingIndex + subStringIndex);
			}

			//if finding punctuation, search for nearest next space
			else {
				//don't look for a space when an em dash is found
				if (ch === '—') {
					itemIndexes.push(startingIndex + subStringIndex);
					continue;
				}
				//if the item is found, search for the nearest next space
				const tinystring = substring.substr(subStringIndex);
				const indexOfNextSpace = tinystring.indexOf(' ');
				itemIndexes.push(startingIndex + subStringIndex + indexOfNextSpace);
			}
		}
	}
	return itemIndexes;
};

const findPrimaryPunctuationIndexes = (
	s: string,
	i: number,
	characterCount: number
) => {
	const regex = new RegExp(PRIMARY_PUNCTUATION);
	return findItemIndexes(s, regex, i, characterCount);
};

const findSecondaryPunctuationIndexes = (
	s: string,
	i: number,
	characterCount: number
) => {
	const regex = new RegExp(SECONDARY_PUNCTUATION);
	return findItemIndexes(s, regex, i, characterCount);
};

const findSpaceIndexes = (s: string, i: number, characterCount: number) => {
	const regex = new RegExp(' ');
	return findItemIndexes(s, regex, i, characterCount, true);
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
	return findClosest(string, findSpaceIndexes, i, characterCount);
};

const findBestBreakPoint = (
	string: string,
	primaryPunctuationDistance: number,
	secondaryPunctuationDistance: number
) => {
	//prioritize primary puncutation, then secondary punctuation, and then spaces
	const i: number = string.length - 1;
	const characterCount: number = string.length;
	let searchParams: [string, number, number] = [string, i, characterCount];

	let primaryPunctuation = findClosestPrimaryPunctuation(...searchParams);
	let secondaryPunctuation = findClosestSecondayPunctuation(...searchParams);
	let spaces = findClosestSpaces(...searchParams);

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

export const condenseText = (stringArray: string[]) => {
	return stringArray;
};
