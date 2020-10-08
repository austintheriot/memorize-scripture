export default (string: string) => {
	const MAX_LINE_LENGTH = 75;

	let lines = string.split('\n');
	for (let i = 0; i < lines.length; i++) {
		let characterCount = 0;
		let words = lines[i].split(' ');
		for (let i = 0; i < words.length; i++) {
			let word = words[i];
			let newWord = '';
			let validCharacterNotYetFound = true;
			for (let i = 0; i < word.length; i++) {
				const ch = word[i];
				characterCount++;

				//matches non-letter characters and numbers
				if (ch.match(/[^A-Za-z0-9_]/)) {
					//skip over intra-word apostrophes and hypens
					if (
						(ch === '’' || ch === '-') &&
						word[i + 1] && //make sure word[i + 1] is defined before testing to see if it's a letter
						word[i + 1].match(/\w/) //matches for english letters
					) {
						continue;
					}

					//adds symbol to word
					newWord += ch;

					//ensuring sensible line breaks:
					//SHORTER LINES ONLY BREAK FOR . ! ? ” ’
					if (
						characterCount < MAX_LINE_LENGTH && //short line
						(ch === '.' || ch === '!' || ch === '?' || ch === '”') &&
						word[i + 1] !== '’' && //the following character is not a ’
						word[i + 1] !== '”' && //the following characters are not ”
						word[i + 2] !== '”' &&
						word[i + 3] !== '”'
					) {
						newWord += '\n';
						characterCount = 0;
					}

					//LONGER LINES BREAK FOR MORE MINOR PUNCTUATION
					else if (
						characterCount > MAX_LINE_LENGTH && //long line
						(ch === '.' ||
							ch === ',' ||
							ch === '”' ||
							ch === '’' ||
							ch === '!' ||
							ch === '—' ||
							ch === '?') && //break on . , or ”
						word[i + 1] !== '’' && //the following character is not a ’
						word[i + 1] !== '”' && //the following characters are not ”
						word[i + 2] !== '”' &&
						word[i + 3] !== '”'
					) {
						newWord += '\n';
						characterCount = 0;
					}
					continue;
				}

				//only add the first letter found in the word
				if (validCharacterNotYetFound) {
					newWord += ch;
					validCharacterNotYetFound = false;
				}
			}
			words[i] = newWord;
		}
		lines[i] = words.join('');
	}
	let finalText = lines.join('\n'); //join back into a single string
	finalText = finalText.split('I').join('i'); //get rid of capital I's
	return finalText;
};
