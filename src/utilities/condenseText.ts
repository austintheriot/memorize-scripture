export default (string: string) => {
	const MAX_LINE_LENGTH = 75;

	let lines = string.split('\n');
	for (let i = 0; i < lines.length; i++) {
		//iterate through text broken by /n
		let characterCount = 0;
		let words = lines[i].split(' ');
		for (let j = 0; j < words.length; j++) {
			//iterate through every word in each line (replace word with new, single-letter only version)
			let word = words[j];
			let newWord = '';
			let validCharacterNotYetFound = true;
			for (let k = 0; k < word.length; k++) {
				//iterate through every letter in the word
				const ch = word[k];
				characterCount++;

				//matches non-letter characters and numbers
				if (ch.match(/[^A-Za-z0-9_]/)) {
					//skip over intra-word apostrophes, hyphens, and commas (important for longer numbers)
					if (
						(ch === '’' || ch === '-' || ch === ',') &&
						word[k + 1] && //make sure word[k + 1] is defined before testing to see if it's a letter
						word[k + 1].match(/\w/) //matches for english letters
					) {
						continue;
					}

					//adds symbol to word
					newWord += ch;

					if (characterCount <= MAX_LINE_LENGTH && ch === '—' && word[k + 1]) {
						//special case for word—word (add in the first letter of the next word--SHORT LINES)
						newWord += word[k + 1];
					}

					//ensuring sensible line breaks:
					//SHORTER LINES ONLY BREAK FOR . ! ? ” ’
					if (
						characterCount < MAX_LINE_LENGTH && //short line
						(ch === '.' || ch === '!' || ch === '?' || ch === '”') &&
						word[k + 1] !== '’' && //the following character is not a ’
						word[k + 1] !== '”' && //the following characters are not ”
						word[k + 2] !== '”' &&
						word[k + 3] !== '”'
					) {
						if (words[j + 1]) newWord += '\n'; //only add line break not the last word in the line
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
						word[k + 1] !== '’' && //the following character is not a ’
						word[k + 1] !== '”' && //the following characters are not ”
						word[k + 1] !== ')' && //the following character is not )
						word[k + 1] !== ',' && //the following character is not ,
						word[k + 2] !== '”' &&
						word[k + 3] !== '”'
					) {
						if (words[j + 1]) newWord += '\n'; //only add line break not the last word in the line
						characterCount = 0;
						if (ch === '—' && word[k + 1]) {
							//special case for word—word (add in the first letter of the next word--LONG LINES)
							newWord += word[k + 1];
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
			words[j] = newWord;
		}
		lines[i] = words.join('');
	}
	let finalText = lines.join('\n'); //join back into a single string
	finalText = finalText.split('I').join('i'); //get rid of capital 'I's
	return finalText;
};
