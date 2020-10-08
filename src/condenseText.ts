export default (string: string) => {
	const MAX_LINE_LENGTH = 75;

	let lines = string.split('\n');
	for (let i = 0; i < lines.length; i++) {
		let characterCount = 0;
		let words = lines[i].split(' ');
		for (let i = 0; i < words.length; i++) {
			let word = words[i];
			let newWord = '';
			let letterNotYetFound = true;
			for (let i = 0; i < word.length; i++) {
				const ch = word[i];
				characterCount++;

				//add symbol (non-letter character) to word
				if (ch.match(/[^A-Za-z_]/)) {
					newWord += ch;

					//ensuring sensible line breaks:
					if (
						characterCount < MAX_LINE_LENGTH && //short line
						(ch === '.' ||
							ch === '!' ||
							ch === '?' ||
							ch === '”' ||
							ch === '’') && //break on . or ”
						word[i + 1] !== '”' && //the following character is not a ”
						word[i + 1] !== '’' //the following character is not a ’
					) {
						newWord += '\n';
						characterCount = 0;
					} else if (
						characterCount > MAX_LINE_LENGTH && //long line
						(ch === '.' ||
							ch === ',' ||
							ch === '”' ||
							ch === '’' ||
							ch === '!' ||
							ch === '—' ||
							ch === '?') && //break on . , or ”
						word[i + 1] !== '”' && //the following character is not a ”
						word[i + 1] !== '’' //the following character is not a ’
					) {
						newWord += '\n';
						characterCount = 0;
					}
					continue;
				}

				//only add the first letter found in the word
				if (letterNotYetFound) {
					newWord += ch;
					letterNotYetFound = false;
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
