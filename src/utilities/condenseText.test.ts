import condenseText from './condenseText';

describe('Condense Text Function', () => {
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
