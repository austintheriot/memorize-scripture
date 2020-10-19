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

describe('Break Full Text Into Lines:', () => {
	test('Should return an array', () => {
		expect(Array.isArray(breakFullTextIntoLines('example'))).toBe(true);
	});

	test('Should return an array of strings', () => {
		breakFullTextIntoLines(Habakkuk1).forEach((line) => {
			expect(typeof line).toBe('string');
		});
	});

	test('Should not return a line with more characters than the given maximum', () => {
		let chapter = Genesis3;
		let maxLineLength = 200;
		let lineBrokenText = breakFullTextIntoLines(chapter, maxLineLength);
		lineBrokenText.forEach((line) => {
			expect(line.length).toBeLessThan(maxLineLength);
		});

		chapter = Matthew8;
		maxLineLength = 125;
		lineBrokenText = breakFullTextIntoLines(chapter, maxLineLength);
		lineBrokenText.forEach((line) => {
			expect(line.length).toBeLessThan(maxLineLength);
		});

		chapter = Revelation7;
		maxLineLength = 100;
		lineBrokenText = breakFullTextIntoLines(chapter, maxLineLength);
		lineBrokenText.forEach((line) => {
			expect(line.length).toBeLessThan(maxLineLength);
		});
	});
});

describe('Condense Text:', () => {
	const lineBrokenGenesis3 = breakFullTextIntoLines(Genesis3);
	const lineBrokenHabakkuk1 = breakFullTextIntoLines(Habakkuk1);
	const lineBrokenMatthew8 = breakFullTextIntoLines(Matthew8);
	const lineBrokenEphesians3 = breakFullTextIntoLines(Ephesians3);
	const lineBrokenRevelation7 = breakFullTextIntoLines(Revelation7);

	test('Should return an array', () => {
		expect(Array.isArray(lineBrokenGenesis3)).toBe(true);
		expect(Array.isArray(lineBrokenHabakkuk1)).toBe(true);
		expect(Array.isArray(lineBrokenMatthew8)).toBe(true);
		expect(Array.isArray(lineBrokenEphesians3)).toBe(true);
		expect(Array.isArray(lineBrokenRevelation7)).toBe(true);
	});

	test('Should return an array of strings', () => {
		condenseText(lineBrokenGenesis3).forEach((line) => {
			expect(typeof line).toBe('string');
		});
		condenseText(lineBrokenHabakkuk1).forEach((line) => {
			expect(typeof line).toBe('string');
		});
		condenseText(lineBrokenMatthew8).forEach((line) => {
			expect(typeof line).toBe('string');
		});
		condenseText(lineBrokenEphesians3).forEach((line) => {
			expect(typeof line).toBe('string');
		});
		condenseText(lineBrokenRevelation7).forEach((line) => {
			expect(typeof line).toBe('string');
		});
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
