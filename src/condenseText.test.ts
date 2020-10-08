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

		expect(condenseText('......”””””')).toBe('.\n.\n.\n...”””””\n');
	});

	test('Should break a line of more than 75 characters on , . ” ’ ? — or ! ', () => {
		//testing ,
		expect(
			condenseText(
				'Now after Jesus was born in Bethlehem of Judea in the days of Herod the king ' +
					'behold wise men from the east came to Jerusalem saying ' +
					'Where is he who has been born king of the Jews ' +
					'For we saw his star when it rose and have come to worship him ' +
					'When Herod the king heard this he was troubled and all Jerusalem with him ' +
					'and assembling all the chief priests and scribes of the people ' +
					'he inquired of them where the Christ was to be born, ' +
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
				'hiotwtCwtbb,\n' +
				'TthiBoJ' +
				'fsiiwbtp'
		);

		//testing .
		expect(
			condenseText(
				'Now after Jesus was born in Bethlehem of Judea in the days of Herod the king ' +
					'behold wise men from the east came to Jerusalem saying ' +
					'Where is he who has been born king of the Jews ' +
					'For we saw his star when it rose and have come to worship him ' +
					'When Herod the king heard this he was troubled and all Jerusalem with him ' +
					'and assembling all the chief priests and scribes of the people ' +
					'he inquired of them where the Christ was to be born. ' +
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
				'hiotwtCwtbb.\n' +
				'TthiBoJ' +
				'fsiiwbtp'
		);

		//testing ”
		expect(
			condenseText(
				'Now after Jesus was born in Bethlehem of Judea in the days of Herod the king ' +
					'behold wise men from the east came to Jerusalem saying ' +
					'Where is he who has been born king of the Jews ' +
					'For we saw his star when it rose and have come to worship him ' +
					'When Herod the king heard this he was troubled and all Jerusalem with him ' +
					'and assembling all the chief priests and scribes of the people ' +
					'he inquired of them where the Christ was to be born” ' +
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
				'hiotwtCwtbb”\n' +
				'TthiBoJ' +
				'fsiiwbtp'
		);

		//testing ?
		expect(
			condenseText(
				'Now after Jesus was born in Bethlehem of Judea in the days of Herod the king ' +
					'behold wise men from the east came to Jerusalem saying ' +
					'Where is he who has been born king of the Jews ' +
					'For we saw his star when it rose and have come to worship him ' +
					'When Herod the king heard this he was troubled and all Jerusalem with him ' +
					'and assembling all the chief priests and scribes of the people ' +
					'he inquired of them where the Christ was to be born? ' +
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
				'hiotwtCwtbb?\n' +
				'TthiBoJ' +
				'fsiiwbtp'
		);

		//testing —
		expect(
			condenseText(
				'Now after Jesus was born in Bethlehem of Judea in the days of Herod the king ' +
					'behold wise men from the east came to Jerusalem saying ' +
					'Where is he who has been born king of the Jews ' +
					'For we saw his star when it rose and have come to worship him ' +
					'When Herod the king heard this he was troubled and all Jerusalem with him ' +
					'and assembling all the chief priests and scribes of the people ' +
					'he inquired of them where the Christ was to be born— ' +
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
				'hiotwtCwtbb—\n' +
				'TthiBoJ' +
				'fsiiwbtp'
		);

		//testing !
		expect(
			condenseText(
				'Now after Jesus was born in Bethlehem of Judea in the days of Herod the king ' +
					'behold wise men from the east came to Jerusalem saying ' +
					'Where is he who has been born king of the Jews ' +
					'For we saw his star when it rose and have come to worship him ' +
					'When Herod the king heard this he was troubled and all Jerusalem with him ' +
					'and assembling all the chief priests and scribes of the people ' +
					'he inquired of them where the Christ was to be born! ' +
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
				'hiotwtCwtbb!\n' +
				'TthiBoJ' +
				'fsiiwbtp'
		);

		//testing ’
		expect(
			condenseText(
				'Now after Jesus was born in Bethlehem of Judea in the days of Herod the king ' +
					'behold wise men from the east came to Jerusalem saying ' +
					'Where is he who has been born king of the Jews ' +
					'For we saw his star when it rose and have come to worship him ' +
					'When Herod the king heard this he was troubled and all Jerusalem with him ' +
					'and assembling all the chief priests and scribes of the people ' +
					'he inquired of them where the Christ was to be born’ ' +
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
				'hiotwtCwtbb’\n' +
				'TthiBoJ' +
				'fsiiwbtp'
		);
	});

	test('Should NOT break a line of more than 75 characters that does not contain , . ” ’ ? — or !', () => {
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

	test('Should NOT break a line of more than 75 characters on , . ” ’ ? or ! when the next character is ” or ’', () => {
		expect(
			condenseText(
				'Now after Jesus was born in Bethlehem of Judea in the days of Herod the king ' +
					'behold wise men from the east came to Jerusalem saying ' +
					'Where is he who has been born king of the Jews ' +
					'For we saw his star when it rose and have come to worship him.’ ' +
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
				'Fwshswirahctwh.’\n' +
				'WHtkhthwtaaJwh' +
				'aaatcpasotp' +
				'hiotwtCwtbb' +
				'TthiBoJ.”\n' +
				'fsiiwbtp'
		);
	});

	test('Should NOT break a line of more than 75 characters on , . ” ’ ? or ! when the NEXT NEXT character is ”', () => {
		expect(
			condenseText(
				`He said to the woman, “Did God actually say, ‘You shall not eat of any tree in the garden’?”`
			)
		).toBe(`Hsttw,“DGas,‘Ysneoatitg’?”\n`);
	});

	test('Should delete intraword apostrophes hyphens', () => {
		expect(
			condenseText(
				`If Cain’s revenge is sevenfold, then Lamech’s is seventy-sevenfold.”`
			)
		).toBe(`iCris,tLis.”\n`);
	});

	test('Should only keep first number of longer number', () => {
		expect(condenseText(`When Adam had lived 130 years`)).toBe(`WAhl1y`);
	});

	// test('Should NOT break a line for a minor character if a . or ” occurs up to 5 characters later', () => {
	// 	expect(
	// 		condenseText(
	// 			'Now the serpent was more crafty than any other beast of the field that the LORD God had made. ' +
	// 				'He said to the woman, “Did God actually say, ‘You shall not eat of any tree in the garden’?” ' +
	// 				'And the woman said to the serpent, “We may eat of the fruit of the trees in the garden, but God said, ' +
	// 				'‘You shall not eat of the fruit of the tree that is in the midst of the garden, neither shall you touch it, lest you die.’” '
	// 		)
	// 	).toBe(
	// 		'NtswmctaobotfttLGhm.Hsttw,\n' +
	// 			'“DGas,‘Ysneoatitg’?”\n' +
	// 			'Atwstts,“Wmeotfottitg,bGs,\n' +
	// 			'‘Ysneotfotttiitmotg,nsyti,lyd.’”\n'
	// 	);
	// });
});
