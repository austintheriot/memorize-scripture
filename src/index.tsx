import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { BibleBook, bookTitles, bookTitlesAndChapters } from 'pages/Memorize/bible';
import { ESVApiKey } from 'app/config';
import axios from 'axios';

// Function to download data to a file
function download(data: string, filename: string, type: string) {
	var file = new Blob([data], { type: type });
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Others
		var a = document.createElement("a"),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

const getEsvChapter = async (title: string, chapter: string | number): Promise<string> => {
	console.log("running script")

	const textURL =
		'https://api.esv.org/v3/passage/text/?' +
		`q=${title} ${chapter}` +
		'&include-passage-references=false' +
		'&include-verse-numbers=true' +
		'&include-first-verse-numbers=true' +
		'&include-footnotes=false' +
		'&include-footnote-body=false' +
		'&include-headings=false' +
		'&include-selahs=false' +
		'&indent-paragraphs=10' +
		'&indent-poetry-lines=5' +
		'&include-short-copyright=false';

	const response = await axios.get(textURL, {
		headers: {
			Authorization: ESVApiKey,
		},
	});


	console.log(response)

	return response.data.passages[0]

}

const wait = async (ms: number) => {
	return new Promise((res) => setTimeout(res, ms))
}

const MAX_WAIT = 10_000;

const getAllBooks = async () => {
	for (const title of bookTitles) {
		const chapters = bookTitlesAndChapters[title as BibleBook];
		for (let chapter = 1; chapter <= chapters; chapter++) {
			await wait(Math.random() * MAX_WAIT)
			const text = await getEsvChapter(title, chapter);

			download(text, `${title} ${chapter}`, "text/plain")
		}

	}
}

getAllBooks()

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,

	document.getElementById('root')
);
