import condenseText from './condenseText';

describe('Condense Text Function', () => {
	test('Should condense words to their first letter', () => {
		expect(condenseText('Seeing the crowds he went up on the mountain')).toBe(
			'Stchwuotm'
		);
		expect(condenseText('This is a test')).toBe('Tiat');
	});

	test('Should delete all spaces', () => {
		expect(
			condenseText(
				'   Seeing  the    crowds  he                  went  up  on  the     mountain        '
			)
		).toBe('Stchwuotm');
	});

	test('Should preserve non-letter characters', () => {
		expect(condenseText('Seeing the crowds, he went up on the mountain.')).toBe(
			'Stc,hwuotm.\n'
		);

		expect(condenseText('(This test is in parentheses)')).toBe('(Ttiip)');

		expect(condenseText(',||""`*&^@#$%^&*(')).toBe(',||""`*&^@#$%^&*(');
	});

	test('Should replace I with i', () => {
		expect(
			condenseText(
				'This was to fulfill what was spoken by the prophet Isaiah: “He took our illnesses and bore our diseases.”'
			)
		).toBe('Twtfwwsbtpi:“Htoiabod.”\n');
	});

	test('Should break any length line after . or ”', () => {
		expect(condenseText('This is an example. This is another example.')).toBe(
			'Tiae.\nTiae.\n'
		);

		expect(condenseText('“This” is an example. This is another example.')).toBe(
			'“T”\niae.\nTiae.\n'
		);
	});

	test('Should NOT add a line break when the following character is a ”', () => {
		expect(condenseText('“This is an example. This is another example.”')).toBe(
			'“Tiae.\nTiae.”\n'
		);

		expect(condenseText('”””””')).toBe('”””””\n');

		expect(condenseText('......”””””')).toBe('.\n.\n.\n.\n.\n.”””””\n');
	});

	test('Should break a line of more than 75 characters on , . ” ? or !', () => {
		expect(
			condenseText(
				'Now after Jesus was born in Bethlehem of Judea in the days of Herod the king, ' +
					'behold, wise men from the east came to Jerusalem saying, ' +
					'“Where is he who has been born king of the Jews? ' +
					'For we saw his star when it rose and have come to worship him.” ' +
					'When Herod the king heard this he was troubled and all Jerusalem with him'
			)
		).toBe(
			'NaJwbiBoJitdoHtk,b,wmftectJs,\n' +
				'“WihwhbbkotJ?\n' +
				'Fwshswirahctwh.”\n' +
				'WHtkhthwtaaJwh'
		);
	});

	test('Should NOT break a line of more than 75 characters that does not contain , . ” ? !', () => {
		expect(
			condenseText(
				'Now after Jesus was born in Bethlehem of Judea in the days of Herod the king ' +
					'behold wise men from the east came to Jerusalem saying ' +
					'Where is he who has been born king of the Jews ' +
					'For we saw his star when it rose and have come to worship him ' +
					'When Herod the king heard this he was troubled and all Jerusalem with him ' +
					'and assembling all the chief priests and scribes of the people ' +
					'he inquired of them where the Christ was to be born ' +
					'They told him In Bethlehem of Judea ' +
					'for so it is written by the prophet'
			)
		).toBe(
			'NaJwbiBoJitdoHtk' +
				'bwmftectJs' +
				'WihwhbbkotJ' +
				'Fwshswirahctwh' +
				'WHtkhthwtaaJwh' +
				'aaatcpasotp' +
				'hiotwtCwtbb' +
				'TthiBoJ' +
				'fsiiwbtp'
		);
	});

	test('Should NOT break a line of more than 75 characters on , . ” ? ! when the next character is ”', () => {
		expect(
			condenseText(
				'Now after Jesus was born in Bethlehem of Judea in the days of Herod the king ' +
					'behold wise men from the east came to Jerusalem saying ' +
					'Where is he who has been born king of the Jews ' +
					'For we saw his star when it rose and have come to worship him.” ' +
					'When Herod the king heard this he was troubled and all Jerusalem with him ' +
					'and assembling all the chief priests and scribes of the people ' +
					'he inquired of them where the Christ was to be born ' +
					'They told him In Bethlehem of Judea.” ' +
					'for so it is written by the prophet'
			)
		).toBe(
			'NaJwbiBoJitdoHtk' +
				'bwmftectJs' +
				'WihwhbbkotJ' +
				'Fwshswirahctwh.”\n' +
				'WHtkhthwtaaJwh' +
				'aaatcpasotp' +
				'hiotwtCwtbb' +
				'TthiBoJ.”\n' +
				'fsiiwbtp'
		);
	});
});
