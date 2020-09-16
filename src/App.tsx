import React from 'react';
import './App.scss';
import styles from './App.module.scss';

import logo from './images/chirho-light.svg';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import booksArray, { bookChapters } from './booksArray';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

export default function App() {
	const classes = useStyles();
	const [book, setBook] = React.useState('Matthew');
	const [chapter, setChapter] = React.useState('1');
	const [numberOfChapters, setNumberOfChapters] = React.useState(28);

	const handleBookChange = (
		e: React.ChangeEvent<{
			name?: string | undefined;
			value: unknown;
		}>
	) => {
		const bookString = e.target.value;
		if (typeof bookString === 'string') {
			setBook(bookString); //set selected option
			let newNumberOfChapters = bookChapters[bookString]; //get chapter numbers
			setNumberOfChapters(newNumberOfChapters); //set chapter numbers
		}
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
			<img src={logo} alt='logo' className={styles.logo} />
			<h1>Scripture Memorization</h1>
			<FormControl className={classes.formControl}>
				<InputLabel id='bible-book'>Book</InputLabel>
				<Select
					labelId='bible-book'
					id='bible-book'
					value={book}
					onChange={handleBookChange}>
					{booksArray.map((bookString) => (
						<MenuItem value={bookString} key={bookString}>
							{bookString}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<FormControl className={classes.formControl}>
				<InputLabel id='bible-chapter'>Chapter</InputLabel>
				<Select
					labelId='bible-chapter'
					id='bible-chapter'
					value={chapter}
					onChange={handleChapterChange}>
					{chapterArray}
				</Select>
			</FormControl>
			<p>
				P,aaoCJbtwoG, TtswaiE,aafiCJ: GtyapfGoFatLJC.
				BbtGaFooLJC,whbuiCwesbithp. Fhcuihbtfotw,twsbhabbh.
				ilhpufathastJC,attpohw, ttpohgg,wwhhbuitB. ihwhrthb,tfoot,attrohg,whluu.
				iawai,hmktutmohw,athp, whsfiCaapftfot, tuatih,tihatoe.
				ihwhoai,hbpattpohwwatattcohw, stwwwtfthiCmbttpohg.
				ihya,wyhtwot,tgoys,abih, wswtpHS--witgooiuwapoi--ttpohg.
				Ftr,bihhoyfitLJayltats, idnctgtfy,ryimp, ttGooLJC,tFog,mgytSowaoritkoh.
				iptteoyhmbe,tymkwithtwhhcy, watrohgiits,awitigohptuwb. TaiawtwohgmthwiC
				whrhftdashahrhithp, faaraaapad,aaentin, noitabaitotc.
				Ahpatuhfaghahoatttc, wihb,tfohwfaia.
			</p>
			<h2>Copyright Notice:</h2>
			<p>
				Scripture quotations are from the ESV® Bible (The Holy Bible, English
				Standard Version®), copyright © 2001 by Crossway, a publishing ministry
				of Good News Publishers. Used by permission. All rights reserved. You
				may not copy or download more than 500 consecutive verses of the ESV
				Bible or more than one half of any book of the ESV Bible.
			</p>
		</div>
	);
}
