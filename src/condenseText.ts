export default (string: string) => {
	const MAX_LINE_LENGTH = 75;

	let lines = string.split('\n');
	for (let i = 0; i < lines.length; i++) {
		//iterate through text broken by /n
		let characterCount = 0;
		let words = lines[i].split(' ');
		for (let i = 0; i < words.length; i++) {
			//iterate through every word in each line (replace word with new, single-letter only version)
			let word = words[i];
			let newWord = '';
			let validCharacterNotYetFound = true;
			for (let i = 0; i < word.length; i++) {
				//iterate through every letter in the word
				const ch = word[i];
				characterCount++;

				//matches non-letter characters and numbers
				if (ch.match(/[^A-Za-z0-9_]/)) {
					//skip over intra-word apostrophes, hyphens, and commas (important for longer numbers)
					if (
						(ch === '’' || ch === '-' || ch === ',') &&
						word[i + 1] && //make sure word[i + 1] is defined before testing to see if it's a letter
						word[i + 1].match(/\w/) //matches for english letters
					) {
						continue;
					}

					//adds symbol to word
					newWord += ch;

					if (characterCount < MAX_LINE_LENGTH && ch === '—' && word[i + 1]) {
						//special case for word—word (add in the first letter of the next word--SHORT LINES)
						newWord += word[i + 1];
					}

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
							ch === ')' ||
							ch === '?') && //break on . , or ”
						word[i + 1] !== '’' && //the following character is not a ’
						word[i + 1] !== '”' && //the following characters are not ”
						word[i + 1] !== ')' && //the following characters are not )
						word[i + 2] !== '”' &&
						word[i + 3] !== '”'
					) {
						newWord += '\n';
						characterCount = 0;
						if (ch === '—' && word[i + 1]) {
							//special case for word—word (add in the first letter of the next word--LONG LINES)
							newWord += word[i + 1];
						}
					}
					continue;
				}

				//if not a symbol and the character is not skipped over already:
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
	finalText = finalText.replace(/\n\n/g, '\n'); //replace double line breaks with single line breaks
	return finalText;
};
