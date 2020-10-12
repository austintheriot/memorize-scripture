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

	test('Should delete intraword apostrophes, hyphens, and commas (in numbers)', () => {
		expect(
			condenseText(
				`If Cain’s revenge is sevenfold, then Lamech’s is seventy-sevenfold.”`
			)
		).toBe(`iCris,tLis.”\n`);

		expect(
			condenseText(
				`And I heard the number of the sealed, 144,000, sealed from every tribe of the sons of Israel:`
			)
		).toBe(`Aihtnots,1,sfetotsoi:`);
	});

	test('Should only keep first number of longer number', () => {
		expect(condenseText(`When Adam had lived 130 years`)).toBe(`WAhl1y`);
	});

	test('Should replace double line breaks with single line breaks', () => {
		expect(
			condenseText(`When Adam\n\n had lived \n\n\n130 \n\n\n\nyears`)
		).toBe(`WA\nhl\n\n1\n\ny`);
	});

	test('Should treat word—word as two separate words within a line', () => {
		expect(
			condenseText(
				'For this reason I bow my knees before the Father, from whom every family in heaven and on earth is named, ' +
					'that according to the riches of his glory he may grant you to be strengthened with power ' +
					'through his Spirit in your inner being, so that Christ may dwell in your hearts through faith—' +
					'that you, being rooted and grounded in love, may have strength to comprehend with all the saints ' +
					'what is the breadth and length and height and depth, and to know the love of Christ that surpasses knowledge, ' +
					'that you may be filled with all the fullness of God.'
			)
		).toBe(
			'FtribmkbtF,fwefihaoein,\n' +
				'tattrohghmgytbswpthSiyib,\n' +
				'stCmdiyhtf—ty,bragil,\n' +
				'mhstcwatswitbalahad,\n' +
				'atktloCtsk,tymbfwatfoG.\n'
		);
	});

	expect(
		condenseText(
			'For this reason I, Paul, a prisoner of Christ Jesus on behalf of you Gentiles—' +
				'assuming that you have heard of the stewardship of God’s grace that was given to me for you,'
		)
	).toBe('Ftri,P,apoCJoboyG—atyhhotsoGgtwgtmfy,\n');

	expect(
		condenseText(
			'so that Christ may dwell in your hearts through faith—that you, being rooted and grounded in love,'
		)
	).toBe('stCmdiyhtf—ty,bragil,\n');
});

test('Should treat word—word as two separate words across line breaks', () => {
	expect(
		condenseText(
			'And you were dead in the trespasses and sins in which you once walked, ' +
				'following the course of this world, following the prince of the power of the air, ' +
				'the spirit that is now at work in the sons of disobedience—' +
				'among whom we all once lived in the passions of our flesh, ' +
				'carrying out the desires of the body and the mind, ' +
				'and were by nature children of wrath, like the rest of mankind.'
		)
	).toBe(
		'Aywdittasiwyow,ftcotw,\n' +
			'ftpotpota,tstinawitsod—\n' +
			'awwaolitpoof,cotdotbatm,\n' +
			'awbncow,ltrom.\n'
	);
});
