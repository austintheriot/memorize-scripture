import React, { useState, useEffect, useContext } from 'react';

//Config
import axios from 'axios';
import { ESVApiKey } from '../../utilities/config';

//App State
import { AudioContext } from '../../state/audioContext';
import { FirebaseContext } from '../../state/firebaseContext';
import { useSelector, useDispatch } from 'react-redux';
import {
	setSearchBook,
	setSearchChapter,
	setSearchNumberOfChapters,
	selectSearch,
} from '../../state/searchSlice';
import {
	setBook,
	setChapter,
	setBody,
	setSplit,
	setCondensed,
	selectText,
} from '../../state/textSlice';
import {
	setAudioHasError,
	setAudioIsReady,
	setAudioIsPlaying,
	setAudioPosition,
	setAudioSpeed,
	selectAudioSettings,
} from '../../state/audioSlice';

//Routing
import { Prompt } from 'react-router';

//Styles
import styles from './Home.module.scss';

//Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

//Custom components
import { Controls } from './Controls/Controls';
import { SmallSpacer } from '../Spacers/Spacers';
import searchIcon from '../../icons/search.svg';

//Custom functions
import {
	condenseText,
	breakFullTextIntoLines,
} from '../../utilities/condenseText';
import { bookTitles, bookChapters } from '../../utilities/bibleBookInfo';

interface TextObject {
	title: string;
	body: string;
}

type TextArray = TextObject[];

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(0.25),
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
		fontSize: '1.1rem',
	},
}));

export const Home = () => {
	const { textAudio, setTextAudio } = useContext(AudioContext);
	const { analytics } = useContext(FirebaseContext);
	const dispatch = useDispatch();

	//Material UI Styling:
	const classes = useStyles();

	//Redux State:
	const search = useSelector(selectSearch);
	const text = useSelector(selectText);
	const audioSettings = useSelector(selectAudioSettings);

	//Local State:
	const [showCondensed, setShowCondensed] = useState(true);
	const [message, setMessage] = useState('');
	const [clickedLine, setClickedLine] = useState(-1);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const updateSearchTerms = (book: string, chapter: string) => {
		dispatch(setSearchBook(book));
		dispatch(setSearchChapter(chapter));
		const newNumberOfChapters = bookChapters[book]; //get chapter numbers
		dispatch(setSearchNumberOfChapters(newNumberOfChapters)); //set chapter numbers
		return;
	};

	const updateResults = (
		book: string,
		chapter: string,
		body: string,
		error?: string | undefined
	) => {
		//Auio Settings:
		textAudio.pause();
		dispatch(setAudioHasError(false));
		dispatch(setAudioIsReady(false));
		dispatch(setAudioPosition(0));
		setTextAudio(
			new Audio(`https://audio.esv.org/hw/mq/${book} ${chapter}.mp3`)
		);

		//Text Results:
		dispatch(setBook(book === 'Psalms' ? 'Psalm' : book));
		dispatch(setChapter(chapter));
		dispatch(setBody(body));
		const lineBrokenText = breakFullTextIntoLines(body);
		dispatch(setSplit(lineBrokenText));
		dispatch(setCondensed(condenseText(lineBrokenText)));

		//Set loading/error message:
		setMessage(error || '');
		return;
	};

	const storePlaySpeedInLocalStorage = (speed: number) => {
		console.log(`Storing ${speed} as default playback speed`);
		window.localStorage.setItem('speed', speed.toString());
	};

	const getPlaySpeedFromLocalStorage = () => {
		console.log('Retrieving playback speed from local storage');
		const speed = window.localStorage.getItem('speed') || '1';
		console.log(`Playback speed from local storage is ${speed}`);
		return parseFloat(speed);
	};

	const getTextArrayFromLocalStorage = (title: string) => {
		const textsString = window.localStorage.getItem('texts');
		return textsString ? (JSON.parse(textsString) as TextArray) : [];
	};

	const getTextBodyFromLocalStorage = (title: string) => {
		const textArray = getTextArrayFromLocalStorage(title);
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
			let textArray = getTextArrayFromLocalStorage(title);
			//store no more than 5 passages at a time
			if (textArray.length === 5) textArray.pop();
			textArray.unshift({
				title,
				body,
			});
			window.localStorage.setItem('texts', JSON.stringify(textArray));
		}
	};

	const handlePlay = () => {
		analytics.logEvent('play_button_pressed');
		if (textAudio.readyState !== 4) return;
		textAudio.play();
		dispatch(setAudioIsPlaying(true));
	};

	const handlePause = () => {
		analytics.logEvent('pause_buton_pressed');
		if (textAudio.readyState !== 4) return;
		textAudio.pause();
		dispatch(setAudioIsPlaying(false));
	};

	const handleRewind = () => {
		analytics.logEvent('back_button_pressed');
		if (textAudio.readyState !== 4) return;
		const targetTime = Math.max(textAudio.currentTime - 5, 0);
		dispatch(setAudioPosition(targetTime / textAudio.duration));
		textAudio.currentTime = targetTime;
	};

	const handleForward = () => {
		analytics.logEvent('forward_button_pressed');
		if (textAudio.readyState !== 4) return;
		const targetTime = Math.min(
			textAudio.currentTime + 5,
			textAudio.duration - 0.01
		);
		dispatch(setAudioPosition(targetTime / textAudio.duration));
		textAudio.currentTime = targetTime;
	};

	const handleBeginning = () => {
		analytics.logEvent('beginning_button_pressed');
		if (textAudio.readyState !== 4) return;
		textAudio.currentTime = 0;
	};

	const handleViewChange = () => {
		analytics.logEvent('flip_view_button_pressed', {
			showCondensed,
		});
		setShowCondensed((prevState) => !prevState);
	};

	const handleProgressClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		const targetTime = e.clientX / document.documentElement.offsetWidth;
		analytics.logEvent('progress_bar_pressed', {
			targetTime,
		});
		dispatch(setAudioPosition(targetTime));
		textAudio.currentTime = textAudio.duration * targetTime;
	};

	const handleSpeedChange = () => {
		const targetSpeed = Math.max((audioSettings.speed + 0.25) % 2.25, 0.5);
		analytics.logEvent('speed_button_pressed', {
			targetSpeed,
		});
		textAudio.playbackRate = targetSpeed;
		dispatch(setAudioSpeed(targetSpeed));
		storePlaySpeedInLocalStorage(targetSpeed);
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
			dispatch(setSearchBook(bookString)); //set book name
			newNumberOfChapters = bookChapters[bookString]; //get chapter numbers
			dispatch(setSearchNumberOfChapters(newNumberOfChapters)); //set chapter numbers
		}
		if (Number(search.chapter) <= newNumberOfChapters) return;
		dispatch(setSearchChapter('1'));
	};

	const handleChapterChange = (
		e: React.ChangeEvent<{
			name?: string | undefined;
			value: unknown;
		}>
	) => {
		if (typeof e.target.value === 'string') {
			dispatch(setSearchChapter(e.target.value));
		}
	};

	const handleLineBrokenText = (
		e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
		i: number
	) => {
		if (clickedLine === i) return setClickedLine(-1);
		setClickedLine(i);
	};

	const fetchTextFromESVAPI = (book: string, chapter: string) => {
		const title = `${book}+${chapter}`;
		console.log(`Fetching text body file of ${title} from ESV API`);

		analytics.logEvent('fetched_text_from_ESV_API', {
			book,
			chapter,
			title: `${book} ${chapter}`,
		});

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
				updateResults(book, chapter, body);
				storeMostRecentInLocalStorage(title);
				storePassageInLocalStorage(title, body);
			})
			.catch((error) => {
				console.log(error);
				updateResults('', '', '', 'Sorry, an error occurred.');
			});
	};

	const initializeMostRecentPassage = () => {
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
				analytics.logEvent('fetched_text_from_local_storage', {
					book,
					chapter,
					title: `${book} ${chapter}`,
				});
			} else {
				console.log(`${title} not found in local storage`);
				console.log(`Initializing results with Psalm 23 instead`);
				updateSearchTerms('Psalms', '23');
				fetchTextFromESVAPI('Psalms', '23');
			}
		} else {
			console.log(
				'A most recent book and chapter do not exist in local storage.'
			);
			console.log(`Initializing results with Psalm 23 instead`);
			updateSearchTerms('Psalms', '23');
			fetchTextFromESVAPI('Psalms', '23');
		}
	};

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		//Check local storage
		const title = `${search.book}+${search.chapter}`;
		console.log(`Checking local storage for ${title}`);
		//try to retrieve text body from local storage
		let body = getTextBodyFromLocalStorage(title);
		if (body) {
			console.log(`Retrieved body of ${title} from local storage`);
			updateResults(search.book, search.chapter, body);
			storeMostRecentInLocalStorage(title);
			analytics.logEvent('fetched_text_from_local_storage', {
				searchBook: search.book,
				searchChapter: search.chapter,
				title: `${search.book} ${search.chapter}`,
			});
		} else {
			//If it does not exist in local storage, make an API call, and store the returned text
			console.log(`${title} not found in local storage`);
			console.log('Making a call to the ESV API');
			updateResults(search.book, search.chapter, '', 'Loading...'); //show loading indicator
			fetchTextFromESVAPI(search.book, search.chapter);
		}
	};

	/* Initialize app on load */
	useEffect(() => {
		//Loading textAudio playback rate
		console.log(`Initializing playspeed with user's previous settings`);
		const targetSpeed = getPlaySpeedFromLocalStorage();
		dispatch(setAudioSpeed(targetSpeed));

		//Loading last-viewed book and chapter
		initializeMostRecentPassage();

		//Prevent pinch zoom in Safari
		document.addEventListener('gesturestart', function (e) {
			e.preventDefault();
			// special hack to prevent zoom-to-tabs gesture in safari
			document.body.style.zoom = '0.99';
		});

		document.addEventListener('gesturechange', function (e) {
			e.preventDefault();
			// special hack to prevent zoom-to-tabs gesture in safari
			document.body.style.zoom = '0.99';
		});

		document.addEventListener('gestureend', function (e) {
			e.preventDefault();
			// special hack to prevent zoom-to-tabs gesture in safari
			document.body.style.zoom = '0.99';
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* textAudio event listeners */
	useEffect(() => {
		//load the resource (necessary on mobile)
		textAudio.load();
		textAudio.currentTime = 0;
		textAudio.playbackRate = audioSettings.speed; //load textAudio settings

		//loaded enough to play
		textAudio.addEventListener('canplay', () => {
			dispatch(setAudioIsReady(true));
		});
		textAudio.addEventListener('pause', () => {
			dispatch(setAudioIsPlaying(false));
		});
		textAudio.addEventListener('play', () => {
			dispatch(setAudioIsPlaying(true));
		});
		textAudio.addEventListener('error', () => {
			dispatch(setAudioHasError(true));
		});
		//not enough data
		textAudio.addEventListener('waiting', () => {
			//No action currently selected for this event
		});
		//ready to play after waiting
		textAudio.addEventListener('playing', () => {
			dispatch(setAudioIsReady(true));
		});
		//textAudio is over
		textAudio.addEventListener('ended', () => {
			textAudio.pause();
			textAudio.currentTime = 0;
		});
		//as time is updated
		textAudio.addEventListener('timeupdate', () => {
			dispatch(setAudioPosition(textAudio.currentTime / textAudio.duration));
		});
		//when speed is changed
		textAudio.addEventListener('ratechange', () => {
			dispatch(setAudioSpeed(textAudio.playbackRate));
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [textAudio]);

	//create chapter input options based on book of the bible
	let chapterArray = [];
	for (let i = 1; i <= search.numberOfChapters; i++) {
		chapterArray.push(i);
	}
	chapterArray = chapterArray.map((el) => (
		<MenuItem value={el.toString()} key={el}>
			{el}
		</MenuItem>
	));

	return (
		<>
			<Prompt
				message={() => {
					//Pause textAudio when navigating away from Home
					console.log('Leaving Home page. Pausing textAudio.');
					textAudio.pause();
					return true;
				}}
			/>
			<h1 className={styles.h1}>
				{text.book} {text.chapter}
			</h1>
			<form className={styles.form}>
				<FormControl className={classes.formControl}>
					<InputLabel id='bible-book' className={classes.label}>
						Book
					</InputLabel>
					<Select
						className={classes.select}
						labelId='bible-book'
						id='bible-book'
						value={search.book}
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
						value={search.chapter}
						onChange={handleChapterChange}>
						{chapterArray}
					</Select>
				</FormControl>
				<button className={styles.search} onClick={handleSubmit}>
					<img src={searchIcon} alt='search' />
				</button>
			</form>
			{showCondensed ? (
				<div className={styles.textAreaContainer}>
					{text.condensed.map((line, i) => {
						return (
							<p
								key={line + i.toString()}
								className={
									clickedLine === i
										? styles.lineBrokenText
										: styles.condensedLine
								}
								onClick={(
									e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
								) => handleLineBrokenText(e, i)}>
								{clickedLine === i ? text.split[i] : text.condensed[i]}
							</p>
						);
					})}
				</div>
			) : (
				<div className={styles.textAreaContainer}>
					<div className={styles.fullText}>{text.body}</div>
				</div>
			)}

			<p className={styles.message}>{message}</p>
			<SmallSpacer />
			<p className={styles.copyright}>Copyright Notice:</p>
			<p className={styles.smallText}>
				Scripture quotations are from the ESV® Bible (The Holy Bible, English
				Standard Version®), copyright © 2001 by Crossway, a publishing ministry
				of Good News Publishers. Used by permission. All rights reserved. You
				may not copy or download more than 500 consecutive verses of the ESV
				Bible or more than one half of any book of the ESV Bible.
			</p>
			<Controls
				flipView={handleViewChange}
				play={handlePlay}
				pause={handlePause}
				rewind={handleRewind}
				forward={handleForward}
				beginning={handleBeginning}
				progressClick={handleProgressClick}
				speedChange={handleSpeedChange}
			/>
		</>
	);
};
