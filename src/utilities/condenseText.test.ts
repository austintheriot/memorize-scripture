import { breakFullTextIntoLines, condenseText } from './condenseText';

import {
	Genesis3,
	Habakkuk1,
	Matthew8,
	Ephesians3,
	Revelation7,
} from './testChapters';

// console.log(
// 	'Genesis 3: /////////////////////////////////\n ',
// 	breakFullTextIntoLines(Genesis3).join('\n')
// );
// console.log(
// 	'Habakkuk 1: /////////////////////////////////\n',
// 	breakFullTextIntoLines(Habakkuk1).join('\n')
// );
// console.log(
// 	'Matthew 8: /////////////////////////////////\n',
// 	breakFullTextIntoLines(Matthew8).join('\n')
// );
// console.log(
// 	'Ephesians 3: /////////////////////////////////\n',
// 	breakFullTextIntoLines(Ephesians3).join('\n')
// );
// console.log(
// 	'Revelation 7: /////////////////////////////////\n',
// 	breakFullTextIntoLines(Revelation7).join('\n')
// );

describe('Break Full Text Into Lines Function', () => {
	test('Should return an array', () => {
		expect(Array.isArray(breakFullTextIntoLines('example'))).toBe(true);
	});

	test('Should return an array of strings', () => {
		expect(typeof breakFullTextIntoLines(Habakkuk1)[0]).toBe('string');
	});
});

describe('Condense Text Function', () => {
	test('Should return an array', () => {
		expect(Array.isArray(condenseText('example'))).toBe(true);
	});

	test('Should return an array of strings', () => {
		expect(typeof condenseText('example')[0]).toBe('string');
	});

	test('Should condense words to their first letter', () => {});

	test('Should delete all spaces', () => {});

	test('Should preserve non-letter characters', () => {});

	test('Should replace I with i', () => {});

	test('Should break any length line after . or ”', () => {});

	test('Should NOT add a line break when the following character is a ”', () => {});

	test('Should break a line of more than 75 characters on , . ” ’ ? — or ! ', () => {
		//testing ,
		//testing .
		//testing ”
		//testing ?
		//testing —
		//testing !
		//testing ’
	});

	test('Should NOT break a line of more than 75 characters that does not contain , . ” ’ ? — or !', () => {});

	test('Should NOT break a line of more than 75 characters on , . ” ’ ? or ! when the next character is ” or ’', () => {});

	test('Should NOT break a line of more than 75 characters on , . ” ’ ? or ! when the next character is )', () => {});

	test('Should NOT break a line of more than 75 characters on , . ” ’ ? or ! when the next character is ,', () => {});

	test('Should NOT break a line of more than 75 characters on , . ” ’ ? or ! when the NEXT NEXT character is ”', () => {});

	test('Should delete intraword apostrophes, hyphens, and commas (in numbers)', () => {});

	test('Should only keep first number of longer number', () => {});

	test('Should preserve existing line breaks', () => {});

	test('Should only add line break when not already the end of a line', () => {});

	test('Should treat word—word as two separate words within a line', () => {});

	test('Should treat word—word as two separate words across line breaks', () => {});
});
