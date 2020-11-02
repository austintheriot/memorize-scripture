//UtilityConfig
import axios from 'axios';
import { ESVApiKey } from '../../app/config';
import { UtilityConfig } from '../../app/types';
import { addToTextArray } from './storage';
import { updateResults } from './updateState';

export const fetchTextFromESVAPI = (
	book: string,
	chapter: string,
	config: UtilityConfig
) => {
	const title = `${book} ${chapter}`;
	console.log(`Fetching text body file of ${title} from ESV API`);

	config.analytics.logEvent('fetched_text_from_ESV_API', {
		book,
		chapter,
		title,
	});

	const textURL =
		'https://api.esv.org/v3/passage/text/?' +
		`q=${title}` +
		'&include-passage-references=false' +
		'&include-verse-numbers=false' +
		'&include-first-verse-numbers=false' +
		'&include-footnotes=false' +
		'&include-footnote-body=false' +
		'&include-headings=false' +
		'&include-selahs=false' +
		'&indent-paragraphs=10' +
		'&indent-poetry-lines=5' +
		'&include-short-copyright=false';

	axios
		.get(textURL, {
			headers: {
				Authorization: ESVApiKey,
			},
		})
		.then((response) => {
			console.log(`Text body of ${title} received from ESV API`);
			const body = response.data.passages[0];
			updateResults(book, chapter, body, config);
			addToTextArray(title, body);
		})
		.catch((error) => {
			console.log(error);
			updateResults('', '', '', config);
		});
};
