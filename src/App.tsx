import React, { useState } from 'react';
import './App.scss';
import styles from './App.module.scss';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from 'axios';
import { ESVApiKey } from './config';

import { bookTitles, bookChapters } from './bibleBookInfo';

import IconButton from '@material-ui/core/IconButton';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';

import condenseText from './condenseText';

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
	const [book, setBook] = useState('Matthew');
	const [chapter, setChapter] = useState('1');
	const [numberOfChapters, setNumberOfChapters] = useState(28);
	const [text, setText] = useState('');
	const [condensedText, setCondensedText] = useState('');

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

	const handleSubmit = () => {
		const key = `${book} ${chapter}`;
		console.log(`Searching storage for ${key}`);
		let passage = window.localStorage.getItem(key);
		if (passage) {
			console.log('Retrieved passage from local storage');
			setText(passage);
			return setCondensedText(condenseText(passage));
		}

		console.log('Making an API call');
		let url = `https://api.esv.org/v3/passage/text/?q=${book
			.split(' ')
			.join(
				'+'
			)}+${chapter}&include-passage-references=false&include-verse-numbers=false&include-first-verse-numbers=false&include-footnotes=false&include-footnote-body=false&include-headings=false&include-selahs=false&indent-paragraphs=5&indent-poetry-lines=5&include-short-copyright=false`;
		axios
			.get(url, {
				headers: {
					Authorization: ESVApiKey,
				},
			})
			.then((response) => {
				console.log('Passage received from ESV API');
				console.log(response);
				const passage = response.data.passages[0];
				setText(passage);
				setCondensedText(condenseText(passage));
				console.log('Storing passage in local storage');
				window.localStorage.setItem(key, passage);
			})
			.catch((error) => {
				console.log(error);
			});
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
			<h1>Scripture Memorization</h1>
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
			{condensedText || text ? (
				<h2>
					{book} {chapter}
				</h2>
			) : null}
			{condensedText ? (
				<>
					<h3>Condensed Text</h3>
					<div className={styles.textArea}>{condensedText}</div>
				</>
			) : null}
			{text ? (
				<>
					<h3>Full Text</h3>
					<div className={styles.textArea}>{text}</div>
				</>
			) : null}
			<div className={styles.textArea}>{text}</div>
			<div className={styles.spacer}></div>
			<p className={styles.copyright}>Copyright Notice:</p>
			<p className={styles.smallText}>
				Scripture quotations are from the ESV® Bible (The Holy Bible, English
				Standard Version®), copyright © 2001 by Crossway, a publishing ministry
				of Good News Publishers. Used by permission. All rights reserved. You
				may not copy or download more than 500 consecutive verses of the ESV
				Bible or more than one half of any book of the ESV Bible.
			</p>
		</div>
	);
}
