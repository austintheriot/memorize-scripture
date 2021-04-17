import React from 'react';
import { useDispatch } from 'react-redux';
import {
	bookSelected,
	chapterSelected,
} from '../../store/searchSlice';
import styles from './SearchBible.module.scss';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import searchIcon from '../../icons/search.svg';
import { BibleBook, bookTitles } from '../../pages/Learn/bible';
import { getTextBody, addToTextArray } from '../../utils/storageUtils';
import {
	textRetrievedFromLocalStorage,
	fetchTextFromESVAPI,
} from '../../store/textSlice';
import { audioFileChanged } from 'store/audioSlice';
import { useAppSelector } from 'store/store';
import { useFirebaseContext } from 'hooks/useFirebaseContext';

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
	const { analytics } = useFirebaseContext();

	//Material UI Styling:
	const classes = useStyles();

	//Redux State:
	const dispatch = useDispatch();
	const { book, chapter, numberOfChapters } = useAppSelector((s) => s.search);

	const handleBookChange = (
		e: React.ChangeEvent<{
			name?: string | undefined;
			value: unknown;
		}>
	) => {
		const bookString = e.target.value as BibleBook;
		dispatch(bookSelected({ bookString, chapter: chapter })); //set book name
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

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		//Check local storage
		const title = `${book} ${chapter}`;
		console.log(`Checking local storage for ${title}`);
		//try to retrieve text body from local storage
		let body = getTextBody(title);
		if (body) {
			console.log(`Retrieved body of ${title} from local storage`);
			dispatch(
				textRetrievedFromLocalStorage({
					book: book,
					chapter: chapter,
					body,
				})
			);
			dispatch(
				audioFileChanged({ book: book, chapter: chapter })
			);
			addToTextArray(title, body);
			analytics.logEvent('fetched_text_from_local_storage', {
				searchBook: book,
				searchChapter: chapter,
				title: `${book} ${chapter}`,
			});
		} else {
			//If it does not exist in local storage, make an API call, and store the returned text
			console.log(`${title} not found in local storage`);
			console.log('Making a call to the ESV API');
			dispatch(fetchTextFromESVAPI(book, chapter, analytics));
		}
	};

	//create chapter input options based on book of the bible
	let chapterArray = [];
	for (let i = 1; i <= numberOfChapters; i++) {
		chapterArray.push(i);
	}
	chapterArray = chapterArray.map((el) => (
		<MenuItem value={el.toString()} key={el} data-testid={el}>
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
					data-testid='select-book'
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
					data-testid='select-chapter'
					value={chapter}
					onChange={handleChapterChange}>
					{chapterArray}
				</Select>
			</FormControl>
			<button
				className={styles.search}
				onClick={handleSubmit}
				aria-label={'Search'}
				data-testid='search'>
				<img src={searchIcon} alt='search' className={styles.searchIcon} />
			</button>
		</form>
	);
};
