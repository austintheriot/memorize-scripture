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
	//Iterate through each line of the text
	for (let i = 0; i < stringArray.length; i++) {
		let words = stringArray[i].split(' ');

		//Iterate through every word
		//Replace full word with condensed version of the word
		//Combine condensed words with no spaces
		for (let j = 0; j < words.length; j++) {
			let word = words[j];
			let condensedWord = '';
			let validCharacterNotYetFound = true;

			//Iterate through every letter in the word, adding characters to the new, condensedWord
			for (let k = 0; k < word.length; k++) {
				const ch = word[k];
				const nextCh = word[k + 1];

				//SYMBOLS:
				//Add in any characters that aren't a letter or number
				if (ch.match(/[^A-Za-z0-9_]/)) {
					//skip over intra-word apostrophes, hyphens, and commas (important for longer numbers)
					if (
						(ch === '’' || ch === '-' || ch === ',') &&
						nextCh && //make sure nextCh is defined before testing to see if it's a letter
						nextCh.match(/\w/) //matches for english letters
					) {
						continue;
					}

					//Adds symbol to word
					condensedWord += ch;

					//In the situation of word—word, add in the first letter of the next word
					if (ch === '—' && nextCh) {
						condensedWord += nextCh;
					}
					continue;
				}

				//LETTERS:
				//If character is not a symbol, only add the first letter found in the word
				if (validCharacterNotYetFound) {
					if (ch === 'I') {
						condensedWord += 'i'; //replace capital I with i
					} else {
						condensedWord += ch;
					}
					validCharacterNotYetFound = false;
				}
			}
			words[j] = condensedWord;
		}
		stringArray[i] = words.join('');
	}
	return stringArray;
};
