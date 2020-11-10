import { breakFullTextIntoLines, condenseText } from '../app/condense';

import {
	Genesis3,
	Habakkuk1,
	Matthew8,
	Ephesians3,
	Revelation7,
} from './testChapters';

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

	test('Should not modify original array', () => {
		const body = Genesis3;
		const bodyBrokenArray = breakFullTextIntoLines(body);
		const bodyBrokenArrayCopy = [...bodyBrokenArray];
		condenseText(bodyBrokenArray);
		expect(bodyBrokenArray).toEqual(bodyBrokenArrayCopy);
	});

	test('Should condense words to their first letter', () => {
		expect(
			condenseText([
				'When he came down from the mountain, great crowds followed him.',
			])
		).toEqual(['Whcdftm,gcfh.']);
	});

	test('Should delete all spaces', () => {
		expect(
			condenseText([
				'    For this     reason   I,    Paul, a    prisoner of    Christ    Jesus on behalf of you Gentiles—           ',
			])
		).toEqual(['Ftri,P,apoCJoboyG—']);
	});

	test('Should preserve non-letter characters', () => {
		expect(
			condenseText([
				'?!After this I... saw four (angels), standing-- “at” the four corners— of the—earth, ',
			])
		).toEqual(['?!Ati...sf(a),s--“a”tfc—ot—e,']);
	});

	test('Should replace I with i', () => {
		expect(condenseText(['Isaiah Is Incredibly Illuminating'])).toEqual([
			'iiii',
		]);
	});

	test('Should delete intraword apostrophes, hyphens, and commas (in numbers)', () => {
		//testing '
		expect(condenseText(['If Cain’s revenge is sevenfold,'])).toEqual([
			'iCris,',
		]);

		//testing -
		expect(condenseText(['then Lamech’s is seventy-sevenfold.”'])).toEqual([
			'tLis.”',
		]);

		//testing ,
		expect(
			condenseText(['12,000 from the tribe of Judah were sealed,'])
		).toEqual(['1fttoJws,']);
	});

	test('Should only keep first number of longer number', () => {
		expect(condenseText(['123,456,789'])).toEqual(['1']);
	});

	test('Should treat word—word as two separate words within a line', () => {
		expect(
			condenseText([
				'the greater light to rule the day and the lesser light to rule the night—and the stars. ',
			])
		).toEqual(['tgltrtdatlltrtn—ats.']);
	});

	test('Should not reveal any lines when not given an array index', () => {
		expect(
			condenseText([
				'I thank my God in all my remembrance of you, always in every prayer of mine for you all making my prayer with joy, ',
				'because of your partnership in the gospel from the first day until now. ',
				'And I am sure of this, that he who began a good work in you will bring it to completion at the day of Jesus Christ. ',
			])
		).toEqual([
			'itmGiamroy,aiepomfyammpwj,',
			'boypitgftfdun.',
			'Aiasot,thwbagwiywbitcatdoJC.',
		]);
	});

	test('Should not reveal any lines when given an array index of -1', () => {
		expect(
			condenseText([
				'I thank my God in all my remembrance of you, always in every prayer of mine for you all making my prayer with joy, ',
				'because of your partnership in the gospel from the first day until now. ',
				'And I am sure of this, that he who began a good work in you will bring it to completion at the day of Jesus Christ. ',
			])
		).toEqual([
			'itmGiamroy,aiepomfyammpwj,',
			'boypitgftfdun.',
			'Aiasot,thwbagwiywbitcatdoJC.',
		]);
	});
});
