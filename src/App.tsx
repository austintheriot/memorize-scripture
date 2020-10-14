import React, { useState, useEffect } from 'react';

//App
import './App.scss';
import styles from './App.module.scss';

//Config
import axios from 'axios';
import { ESVApiKey } from './utilities/config';

//Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';

//Custom components
import { Footer } from './components/Footer/Footer';
import { LargeSpacer } from './components/Spacers/Spacers';

//Custom functions
import condenseText from './utilities/condenseText';
import { bookTitles, bookChapters } from './utilities/bibleBookInfo';

interface TextObject {
	title: string;
	body: string;
}

type TextArray = TextObject[];

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	iconButton: {
		width: 'max-content',
	},
	label: {
		color: 'var(--light)',
	},
	select: {
		padding: '0.25rem 1rem',
		backgroundColor: 'var(--dark)',
		color: 'var(--light)',
	},
}));

export default function App() {
	const classes = useStyles();

	//state
	const [showCondensed, setShowCondensed] = useState(true);

	//search terms
	const [book, setBook] = useState('Matthew');
	const [chapter, setChapter] = useState('1');
	const [numberOfChapters, setNumberOfChapters] = useState(28);

	//search results
	const [resultTitle, setResultTitle] = useState('');
	const [resultBody, setResultBody] = useState('');
	const [resultCondensedBody, setResultCondensedBody] = useState('');
	const [message, setMessage] = useState('');
	const [audio, setAudio] = useState(new Audio());
	const [audioHasError, setAudioHasError] = useState(false);
	const [audioIsReady, setAudioIsReady] = useState(false);
	const [audioIsPlaying, setAudioIsPlaying] = useState(false);
	const [audioCurrentTime, setAudioCurrentTime] = useState(0);
	const [audioSpeed, setAudioSpeed] = useState(1);

	const updateSearchTerms = (book: string, chapter: string) => {
		setBook(book);
		setChapter(chapter);
		const newNumberOfChapters = bookChapters[book]; //get chapter numbers
		setNumberOfChapters(newNumberOfChapters); //set chapter numbers
		return;
	};

	const updateResults = (
		book: string,
		chapter: string,
		body: string,
		error?: string | undefined
	) => {
		audio.pause();
		setAudioHasError(false);
		setAudioIsReady(false);
		setAudioCurrentTime(0);
		setAudio(new Audio(`https://audio.esv.org/hw/mq/${book} ${chapter}.mp3`));
		setResultTitle(`${book} ${chapter}`);
		setResultBody(body);
		setResultCondensedBody(condenseText(body));
		setMessage(error || '');
		return;
	};

	const retrieveTextArrayFromLocalStorage = (title: string) => {
		const textsString = window.localStorage.getItem('texts');
		return textsString ? (JSON.parse(textsString) as TextArray) : [];
	};

	const getTextBodyFromLocalStorage = (title: string) => {
		const textArray = retrieveTextArrayFromLocalStorage(title);
		const text = textArray.find((el) => el.title === title);
		return text?.body;
	};

	const storeMostRecentInLocalStorage = (title: string) => {
		console.log(
			`Storing ${title} as most the most recently accessed chapter in local storage`
		);
		window.localStorage.setItem('recent', title);
	};

	const storePassageInLocalStorage = (title: string, body: string) => {
		console.log(`Checking if ${title} already exists in local storage`);
		let passageIsInLocalStorage = !!getTextBodyFromLocalStorage(title);
		if (passageIsInLocalStorage) {
			console.log(`${title} exists in local storage`);
			return;
		} else {
			console.log(`${title} does not exist in local storage`);
			console.log(`Adding ${title} to local storage`);
			let textArray = retrieveTextArrayFromLocalStorage(title);
			//store no more than 5 passages at a time
			if (textArray.length === 5) textArray.pop();
			textArray.unshift({
				title,
				body,
			});
			window.localStorage.setItem('texts', JSON.stringify(textArray));
		}
	};

	/* Initialize text on load */
	useEffect(() => {
		console.log('Checking for most recent book and chapter.');
		const recent = window.localStorage.getItem('recent');
		if (recent) {
			console.log(`${recent} is the most recent chapter accessed.`);
			const book = recent.split('+')[0];
			const chapter = recent.split('+')[1];
			updateSearchTerms(book, chapter);

			//retrieve text body from local storage using title of most recent book and chapter
			const title = `${book}+${chapter}`;
			console.log(`Searching storage for ${title}`);
			let body = getTextBodyFromLocalStorage(title);
			if (body) {
				console.log(`Retrieved text body of ${title} from local storage`);
				updateResults(book, chapter, body);
			} else {
				console.log(`${title} not found in local storage.`);
			}
		} else {
			console.log(
				'A most recent book and chapter do not exist in local storage.'
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* Audio event listeners */
	useEffect(() => {
		//loaded enough to play
		audio.addEventListener('canplay', () => {
			setAudioIsReady(true);
		});
		audio.addEventListener('pause', () => {
			setAudioIsPlaying(false);
		});
		audio.addEventListener('play', () => {
			setAudioIsPlaying(true);
		});
		audio.addEventListener('error', () => {
			setAudioHasError(true);
		});
		//not enough data
		audio.addEventListener('waiting', () => {
			setAudioIsReady(false);
		});
		//ready to play after waiting
		audio.addEventListener('playing', () => {
			setAudioIsReady(true);
		});
		//audio is over
		audio.addEventListener('ended', () => {
			audio.pause();
			audio.currentTime = 0;
		});
		//as time is updated
		audio.addEventListener('timeupdate', () => {
			setAudioCurrentTime(audio.currentTime / audio.duration);
		});
		//when speed is changed
		audio.addEventListener('ratechange', () => {
			setAudioSpeed(audio.playbackRate);
		});
		//load the resource (necessary on mobile)
		audio.load();
	}, [audio]);

	const handlePlay = () => {
		if (audio.readyState !== 4) return;
		audio.play();
		setAudioIsPlaying(true);
	};

	const handlePause = () => {
		if (audio.readyState !== 4) return;
		audio.pause();
		setAudioIsPlaying(false);
	};

	const handleRewind = () => {
		if (audio.readyState !== 4) return;
		const targetTime = Math.max(audio.currentTime - 5, 0);
		setAudioCurrentTime(targetTime / audio.duration);
		audio.currentTime = targetTime;
	};

	const handleForward = () => {
		if (audio.readyState !== 4) return;
		const targetTime = Math.min(audio.currentTime + 5, audio.duration - 0.01);
		setAudioCurrentTime(targetTime / audio.duration);
		audio.currentTime = targetTime;
	};

	const handleBeginning = () => {
		if (audio.readyState !== 4) return;
		audio.currentTime = 0;
	};

	const handleViewChange = () => {
		setShowCondensed((prevState) => !prevState);
	};

	const handleProgressClick = (e: MouseEvent) => {
		const targetTime = e.clientX / document.documentElement.offsetWidth;
		setAudioCurrentTime(targetTime);
		audio.currentTime = audio.duration * targetTime;
	};

	const handleSpeedChange = () => {
		const targetSpeed = Math.max((audioSpeed + 0.25) % 2.25, 0.5);
		setAudioSpeed(targetSpeed);
		audio.playbackRate = targetSpeed;
	};

	const handleBookChange = (
		e: React.ChangeEvent<{
			name?: string | undefined;
			value: unknown;
		}>
	) => {
		let newNumberOfChapters = 1;
		const bookString = e.target.value;
		if (typeof bookString === 'string') {
			setBook(bookString); //set selected option
			newNumberOfChapters = bookChapters[bookString]; //get chapter numbers
			setNumberOfChapters(newNumberOfChapters); //set chapter numbers
		}
		if (Number(chapter) <= newNumberOfChapters) return;
		setChapter('1');
	};

	const handleChapterChange = (
		e: React.ChangeEvent<{
			name?: string | undefined;
			value: unknown;
		}>
	) => {
		if (typeof e.target.value === 'string') {
			setChapter(e.target.value);
		}
	};

	const fetchTextFromESVAPI = (book: string, chapter: string) => {
		const title = `${book}+${chapter}`;
		console.log(`Fetching text body file of ${title} from ESV API`);
		const textURL =
			'https://api.esv.org/v3/passage/text/?' +
			`q=${book.split(' ').join('+')}+${chapter}` +
			'&include-passage-references=false' +
			'&include-verse-numbers=false' +
			'&include-first-verse-numbers=false' +
			'&include-footnotes=false' +
			'&include-footnote-body=false' +
			'&include-headings=false' +
			'&include-selahs=false' +
			'&indent-paragraphs=5' +
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
				updateResults(book, chapter, body);
				storeMostRecentInLocalStorage(title);
				storePassageInLocalStorage(title, body);
			})
			.catch((error) => {
				console.log(error);
				updateResults('', '', '', 'Sorry, an error occurred.');
			});
	};

	const handleSubmit = () => {
		//Check local storage
		const title = `${book}+${chapter}`;
		console.log(`Checking local storage for ${title}`);
		//try to retrieve text body from local storage
		let body = getTextBodyFromLocalStorage(title);
		if (body) {
			console.log(`Retrieved body of ${title} from local storage`);
			updateResults(book, chapter, body);
			storeMostRecentInLocalStorage(title);
		} else {
			//If it does not exist in local storage, make an API call, and store the returned text
			console.log(`${title} not found in local storage`);
			console.log('Making a call to the ESV API');
			updateResults(book, chapter, '', 'Loading...'); //show loading indicator
			fetchTextFromESVAPI(book, chapter);
		}
	};

	//create chapter input options based on book of the bible
	let chapterArray = [];
	for (let i = 1; i <= numberOfChapters; i++) {
		chapterArray.push(i);
	}
	chapterArray = chapterArray.map((el) => (
		<MenuItem value={el.toString()} key={el}>
			{el}
		</MenuItem>
	));

	return (
		<div className='App'>
			<h1>Memorize Scripture</h1>
			<form className={styles.form}>
				<FormControl className={classes.formControl}>
					<InputLabel id='bible-book' className={classes.label}>
						Book
					</InputLabel>
					<Select
						className={classes.select}
						labelId='bible-book'
						id='bible-book'
						value={book}
						onChange={handleBookChange}>
						{bookTitles.map((bookString) => (
							<MenuItem value={bookString} key={bookString}>
								{bookString}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl className={classes.formControl}>
					<InputLabel id='bible-chapter' className={classes.label}>
						Chapter
					</InputLabel>
					<Select
						className={classes.select}
						labelId='bible-chapter'
						id='bible-chapter'
						value={chapter}
						onChange={handleChapterChange}>
						{chapterArray}
					</Select>
				</FormControl>
				<IconButton
					aria-label='search'
					className={classes.iconButton}
					onClick={handleSubmit}>
					<SearchOutlinedIcon style={{ color: 'var(--light)' }} />
				</IconButton>
			</form>
			<p className={styles.message}>{message}</p>
			{resultCondensedBody && resultBody ? (
				<>
					<h2>{resultTitle}</h2>
					{showCondensed ? (
						<>
							<div className={styles.textArea}>{resultCondensedBody}</div>
						</>
					) : (
						<>
							<div className={styles.textArea}>{resultBody}</div>
						</>
					)}
				</>
			) : null}
			<div className={styles.spacer}></div>
			<p className={styles.copyright}>Copyright Notice:</p>
			<p className={styles.smallText}>
				Scripture quotations are from the ESV® Bible (The Holy Bible, English
				Standard Version®), copyright © 2001 by Crossway, a publishing ministry
				of Good News Publishers. Used by permission. All rights reserved. You
				may not copy or download more than 500 consecutive verses of the ESV
				Bible or more than one half of any book of the ESV Bible.
			</p>
			<LargeSpacer />
			<Footer
				flipView={handleViewChange}
				play={handlePlay}
				pause={handlePause}
				rewind={handleRewind}
				forward={handleForward}
				beginning={handleBeginning}
				currentTime={audioCurrentTime}
				hasError={audioHasError}
				isReady={audioIsReady}
				isPlaying={audioIsPlaying}
				progressClick={handleProgressClick}
				speed={audioSpeed}
				speedChange={handleSpeedChange}
			/>
		</div>
	);
}
