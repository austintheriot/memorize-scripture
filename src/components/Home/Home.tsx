import React, { useState, useEffect } from 'react';

//Redux
import { useSelector, useDispatch } from 'react-redux';
//TextSlice
import {
	setBodyBook,
	setBodyChapter,
	setBody,
	setLineBrokenBody,
	setCondensedBody,
	selectBodyBook,
	selectBodyChapter,
	selectBody,
	selectLineBrokenBody,
	selectCondensedBody,
} from '../../state/textSlice';
//SearchSlice
import {
	setSearchBook,
	setSearchChapter,
	setSearchNumberOfChapters,
	selectSearchBook,
	selectSearchChapter,
	selectSearchNumberOfChapters,
} from '../../state/searchSlice';

//Styles
import styles from './Home.module.scss';

//Config
import axios from 'axios';
import { ESVApiKey } from '../../utilities/config';

import { Prompt } from 'react-router';

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

export const Home = (props: {
	menuOpen: boolean;
	analytics: any;
	audio: HTMLMediaElement;
	setAudio: any;
	audioHasError: boolean;
	setAudioHasError: any;
	audioIsReady: boolean;
	setAudioIsReady: any;
	audioIsPlaying: boolean;
	setAudioIsPlaying: any;
	audioPosition: number;
	setAudioPosition: any;
	audioSpeed: number;
	setAudioSpeed: any;
}) => {
	const dispatch = useDispatch();
	//Material UI Styling:
	const classes = useStyles();

	//Text Body:
	const bodyBook = useSelector(selectBodyBook);
	const bodyChapter = useSelector(selectBodyChapter);
	const body = useSelector(selectBody);
	const lineBrokenBody = useSelector(selectLineBrokenBody);
	const condensedBody = useSelector(selectCondensedBody);

	//Search Terms:
	const searchBook = useSelector(selectSearchBook);
	const searchChapter = useSelector(selectSearchChapter);
	const searchNumberOfChapters = useSelector(selectSearchNumberOfChapters);

	//Home Specific State:
	const [showCondensed, setShowCondensed] = useState(true);
	const [message, setMessage] = useState('');
	const [clickedLine, setClickedLine] = useState(-1);

	//destructuring state props to behave like normal state (by name)
	const {
		audio,
		setAudio,
		audioHasError,
		setAudioHasError,
		audioIsReady,
		setAudioIsReady,
		audioIsPlaying,
		setAudioIsPlaying,
		audioPosition,
		setAudioPosition,
		audioSpeed,
		setAudioSpeed,
	} = props;

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
		audio.pause();
		setAudioHasError(false);
		setAudioIsReady(false);
		setAudioPosition(0);
		setAudio(new Audio(`https://audio.esv.org/hw/mq/${book} ${chapter}.mp3`));

		//Search

		//Text Results:
		dispatch(setBodyBook(book === 'Psalms' ? 'Psalm' : book));
		dispatch(setBodyChapter(chapter));
		dispatch(setBody(body));
		const lineBrokenText = breakFullTextIntoLines(body);
		dispatch(setLineBrokenBody(lineBrokenText));
		dispatch(setCondensedBody(condenseText(lineBrokenText)));

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
		props.analytics.logEvent('play_button_pressed');
		if (audio.readyState !== 4) return;
		audio.play();
		setAudioIsPlaying(true);
	};

	const handlePause = () => {
		props.analytics.logEvent('pause_buton_pressed');
		if (audio.readyState !== 4) return;
		audio.pause();
		setAudioIsPlaying(false);
	};

	const handleRewind = () => {
		props.analytics.logEvent('back_button_pressed');
		if (audio.readyState !== 4) return;
		const targetTime = Math.max(audio.currentTime - 5, 0);
		setAudioPosition(targetTime / audio.duration);
		audio.currentTime = targetTime;
	};

	const handleForward = () => {
		props.analytics.logEvent('forward_button_pressed');
		if (audio.readyState !== 4) return;
		const targetTime = Math.min(audio.currentTime + 5, audio.duration - 0.01);
		setAudioPosition(targetTime / audio.duration);
		audio.currentTime = targetTime;
	};

	const handleBeginning = () => {
		props.analytics.logEvent('beginning_button_pressed');
		if (audio.readyState !== 4) return;
		audio.currentTime = 0;
	};

	const handleViewChange = () => {
		props.analytics.logEvent('flip_view_button_pressed', {
			showCondensed,
		});
		setShowCondensed((prevState) => !prevState);
	};

	const handleProgressClick = (e: MouseEvent) => {
		const targetTime = e.clientX / document.documentElement.offsetWidth;
		props.analytics.logEvent('progress_bar_pressed', {
			targetTime,
		});
		setAudioPosition(targetTime);
		audio.currentTime = audio.duration * targetTime;
	};

	const handleSpeedChange = () => {
		const targetSpeed = Math.max((audioSpeed + 0.25) % 2.25, 0.5);
		props.analytics.logEvent('speed_button_pressed', {
			targetSpeed,
		});
		audio.playbackRate = targetSpeed;
		setAudioSpeed(targetSpeed);
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
		if (Number(searchChapter) <= newNumberOfChapters) return;
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

		props.analytics.logEvent('fetched_text_from_ESV_API', {
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
				props.analytics.logEvent('fetched_text_from_local_storage', {
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
		const title = `${searchBook}+${searchChapter}`;
		console.log(`Checking local storage for ${title}`);
		//try to retrieve text body from local storage
		let body = getTextBodyFromLocalStorage(title);
		if (body) {
			console.log(`Retrieved body of ${title} from local storage`);
			updateResults(searchBook, searchChapter, body);
			storeMostRecentInLocalStorage(title);
			props.analytics.logEvent('fetched_text_from_local_storage', {
				searchBook,
				searchChapter,
				title: `${searchBook} ${searchChapter}`,
			});
		} else {
			//If it does not exist in local storage, make an API call, and store the returned text
			console.log(`${title} not found in local storage`);
			console.log('Making a call to the ESV API');
			updateResults(searchBook, searchChapter, '', 'Loading...'); //show loading indicator
			fetchTextFromESVAPI(searchBook, searchChapter);
		}
	};

	/* Initialize app on load */
	useEffect(() => {
		//Loading audio playback rate
		console.log(`Initializing playspeed with user's previous settings`);
		const targetSpeed = getPlaySpeedFromLocalStorage();
		setAudioSpeed(targetSpeed);

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

	/* Audio event listeners */
	useEffect(() => {
		//load the resource (necessary on mobile)
		audio.load();
		audio.currentTime = 0;
		audio.playbackRate = audioSpeed; //load audio settings

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
			//No action currently selected for this event
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
			setAudioPosition(audio.currentTime / audio.duration);
		});
		//when speed is changed
		audio.addEventListener('ratechange', () => {
			setAudioSpeed(audio.playbackRate);
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [audio]);

	//create chapter input options based on book of the bible
	let chapterArray = [];
	for (let i = 1; i <= searchNumberOfChapters; i++) {
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
					//Pause audio when navigating away from Home
					console.log('Leaving Home page. Pausing audio.');
					audio.pause();
					return true;
				}}
			/>
			<h1 className={styles.h1}>
				{bodyBook} {bodyChapter}
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
						value={searchBook}
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
						value={searchChapter}
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
					{condensedBody.map((line, i) => {
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
								{clickedLine === i ? lineBrokenBody[i] : condensedBody[i]}
							</p>
						);
					})}
				</div>
			) : (
				<div className={styles.textAreaContainer}>
					<div className={styles.fullText}>{body}</div>
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
				menuOpen={props.menuOpen}
				flipView={handleViewChange}
				play={handlePlay}
				pause={handlePause}
				rewind={handleRewind}
				forward={handleForward}
				beginning={handleBeginning}
				audioPosition={audioPosition}
				hasError={audioHasError}
				isReady={audioIsReady}
				isPlaying={audioIsPlaying}
				progressClick={handleProgressClick}
				speed={audioSpeed}
				speedChange={handleSpeedChange}
			/>
		</>
	);
};
