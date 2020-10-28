import React, { useEffect, useContext } from 'react';

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
import { selectText, setClickedLine } from '../../state/textSlice';

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

//Utilities
import { bookTitles, bookChapters } from '../../utilities/bibleBookInfo';
import {
	storeClickedLine,
	storeMostRecentPassage,
	getTextBody,
} from '../../utilities/localStorage';
import {
	updateResults,
	fetchTextFromESVAPI,
} from '../../utilities/dataUtilities';

//types
import { UtilityConfig } from '../../utilities/types';

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
	const utilityConfig: UtilityConfig = {
		textAudio,
		setTextAudio,
		dispatch,
		analytics,
	};

	//Material UI Styling:
	const classes = useStyles();

	//Redux State:
	const search = useSelector(selectSearch);
	const text = useSelector(selectText);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

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
		if (text.clickedLine === i) return dispatch(setClickedLine(-1));
		dispatch(setClickedLine(i));
		storeClickedLine(i);
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
			updateResults(search.book, search.chapter, body, utilityConfig);
			storeMostRecentPassage(title);
			analytics.logEvent('fetched_text_from_local_storage', {
				searchBook: search.book,
				searchChapter: search.chapter,
				title: `${search.book} ${search.chapter}`,
			});
		} else {
			//If it does not exist in local storage, make an API call, and store the returned text
			console.log(`${title} not found in local storage`);
			console.log('Making a call to the ESV API');
			updateResults(search.book, search.chapter, '', utilityConfig); //show loading indicator
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
					<img src={searchIcon} alt='search' />
				</button>
			</form>
			{text.showCondensed ? (
				<div
					className={styles.textAreaContainer}
					style={{
						height: text.body ? 'auto' : '939px',
					}}>
					{text.condensed.map((line, i) => {
						return (
							<p
								key={line + i.toString()}
								className={
									text.clickedLine === i
										? styles.lineBrokenText
										: styles.condensedLine
								}
								onClick={(
									e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
								) => handleLineBrokenText(e, i)}>
								{text.clickedLine === i ? text.split[i] : text.condensed[i]}
							</p>
						);
					})}
				</div>
			) : (
				<div className={styles.textAreaContainer}>
					<div className={styles.fullText}>{text.body}</div>
				</div>
			)}

			<SmallSpacer />
			<p className={styles.copyright}>Copyright Notice:</p>
			<p className={styles.smallText}>
				Scripture quotations are from the ESV® Bible (The Holy Bible, English
				Standard Version®), copyright © 2001 by Crossway, a publishing ministry
				of Good News Publishers. Used by permission. All rights reserved. You
				may not copy or download more than 500 consecutive verses of the ESV
				Bible or more than one half of any book of the ESV Bible.
			</p>
			<Controls />
		</>
	);
};
