import React, { useContext } from 'react';

import { AudioContext } from '../../app/audioContext';
import { FirebaseContext } from '../../app/firebaseContext';
import { useSelector, useDispatch } from 'react-redux';
import {
	selectSearch,
	bookSelected,
	chapterSelected,
} from '../../app/searchSlice';

//Styles
import styles from './SearchBible.module.scss';

//Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

//Custom components
import searchIcon from '../../icons/search.svg';

//Utilities
import { bookTitles } from '../../views/Learn/bible';
import { getTextBody, addToTextArray } from '../../views/Learn/storage';
import axios from 'axios';
import { ESVApiKey } from '../../app/config';
import {
	textBeingFetchedFromAPI,
	textFetchSucceeded,
	textFetchFailed,
} from '../../app/textSlice';

//types
import { UtilityConfig } from '../../app/types';
import { textRetrievedFromLocalStorage } from '../../app/textSlice';

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

export const SearchBible = () => {
	const { analytics } = useContext(FirebaseContext);

	//Material UI Styling:
	const classes = useStyles();

	//Redux State:
	const dispatch = useDispatch();
	const search = useSelector(selectSearch);
	const { textAudio, setTextAudio } = useContext(AudioContext);
	const utilityConfig: UtilityConfig = {
		textAudio,
		setTextAudio,
		dispatch,
		analytics,
	};

	const handleBookChange = (
		e: React.ChangeEvent<{
			name?: string | undefined;
			value: unknown;
		}>
	) => {
		const bookString = e.target.value;
		if (typeof bookString === 'string') {
			dispatch(bookSelected({ bookString, chapter: search.chapter })); //set book name
		}
	};

	const handleChapterChange = (
		e: React.ChangeEvent<{
			name?: string | undefined;
			value: unknown;
		}>
	) => {
		if (typeof e.target.value === 'string') {
			dispatch(chapterSelected(e.target.value));
		}
	};

	const fetchTextFromESVAPI = (
		book: string,
		chapter: string,
		config: UtilityConfig
	) => {
		dispatch(textBeingFetchedFromAPI());

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
				config.dispatch(
					textFetchSucceeded({
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
				config.dispatch(textFetchFailed());
			});
	};

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		//Check local storage
		const title = `${search.book} ${search.chapter}`;
		console.log(`Checking local storage for ${title}`);
		//try to retrieve text body from local storage
		let body = getTextBody(title);
		if (body) {
			console.log(`Retrieved body of ${title} from local storage`);
			dispatch(
				textRetrievedFromLocalStorage({
					book: search.book,
					chapter: search.chapter,
					body,
				})
			);
			addToTextArray(title, body);
			analytics.logEvent('fetched_text_from_local_storage', {
				searchBook: search.book,
				searchChapter: search.chapter,
				title: `${search.book} ${search.chapter}`,
			});
		} else {
			//If it does not exist in local storage, make an API call, and store the returned text
			console.log(`${title} not found in local storage`);
			console.log('Making a call to the ESV API');
			fetchTextFromESVAPI(search.book, search.chapter, utilityConfig);
		}
	};

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
		<form className={styles.form}>
			<FormControl className={classes.formControl}>
				<InputLabel id='bible-book' className={classes.label}>
					Book
				</InputLabel>
				<Select
					className={classes.select}
					labelId='bible-book'
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
					value={search.chapter}
					onChange={handleChapterChange}>
					{chapterArray}
				</Select>
			</FormControl>
			<button
				className={styles.search}
				onClick={handleSubmit}
				aria-label={'Search'}>
				<img src={searchIcon} alt='search' className={styles.searchIcon} />
			</button>
		</form>
	);
};
