//UtilityConfig
import axios from 'axios';
import { ESVApiKey } from '../../app/config';
import { UtilityConfig } from '../../app/types';
import { addToTextArray } from './storage';
import {
	textFetchedFromESVAPI,
	textFetchFailed,
} from '../../app/state/textSlice';

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
			//Text State
			config.dispatch(
				textFetchedFromESVAPI({
					book: book === 'Psalms' ? 'Psalm' : book,
					chapter,
					body,
				})
			);
			const newAudioUrl = `https://audio.esv.org/hw/mq/${book} ${chapter}.mp3`;
			config.setTextAudio(new Audio(newAudioUrl));
			addToTextArray(title, body);
		})
		.catch((error) => {
			console.log(error);
			config.dispatch(
				textFetchFailed({
					book: '',
					chapter: '',
					body: '',
				})
			);
		});
};
