import React from 'react';
import styles from './Comparison.module.scss';

//App State
import { useSelector } from 'react-redux';
import { selectText } from '../../app/textSlice';

export const Comparison = () => {
	const text = useSelector(selectText);

	const input = text.reviewInput;
	const bible = text.body;
	const bibleCondensed = bible.split(/[^A-Za-z0-9_]/).join('');
	const length = Math.max(bible.length, input.length);
	const textArray: JSX.Element[] = [];
	let chunk: string = '';
	type LastCharacter = 'correct' | 'incorrect';
	let lastCh: LastCharacter = 'correct';
	const time: string = new Date().getTime().toString();

	//stats
	let neutral: number = 0;
	let correct: number = 0;
	let totalPercentCorrect: number = 0;
	let attemptedPercentCorrect: number = 100;

	//Only wrap chunks of strings (and not each individual character in an HTML element)
	//Only grade letters
	//(Do not grade spaces, linebreaks, punctuation, or capitalziation).
	//Only run after having finished typing for 0.2s
	//Update state in a promise (keep from blocking script)
	//Return an array of JSX elements and totalPercentCorrect correct

	const characterShouldBeOmitted = (ch: string) => {
		return ch && (ch === ' ' || ch === '\n' || ch.match(/[^A-Za-z0-9_]/));
	};

	const charactersMatch = (ch1: string, ch2: string) => {
		return ch1 && ch2 && ch1.toLowerCase() === ch2.toLowerCase();
	};

	const charactersDontMatch = (ch1: string, ch2: string) => {
		return ch1 && ch2 && ch1.toLowerCase() !== ch2.toLowerCase();
	};

	const pushCh = (chunk: string, lastCh: LastCharacter, i: number) => {
		textArray.push(
			<span
				className={lastCh === 'incorrect' ? styles.incorrect : styles.correct}
				key={time + chunk + i.toString()}>
				{chunk}
			</span>
		);
	};

	const pushAndResetChunk = (i: number, j: number) => {
		pushCh(chunk, lastCh, i);
		chunk = input[j];
	};

	const conditionallyPushLastChunk = (length: number, j: number) => {
		//push the last chunk (but not if input is empty)
		if (input.length > 0 && j === input.length - 1) {
			pushCh(chunk, lastCh, Math.random());
		}
	};

	for (let i = 0, j = 0; j < length; i++, j++) {
		//Skip over ommitted characters in original text
		if (characterShouldBeOmitted(bible[i])) {
			j--;
			continue;
		}

		//Skip over ommitted characters in input text
		else if (characterShouldBeOmitted(input[j])) {
			//for stats, assume punctuation is correct
			neutral++;
			//let omitted characters take on the "correctness"
			//of any preceding characters for styling
			chunk += input[j];
			conditionallyPushLastChunk(input.length, j);
			i--;
			continue;
		}

		//if characters match
		else if (charactersMatch(bible[i], input[j])) {
			correct++;
			if (lastCh === 'correct') {
				chunk += input[j];
			} else {
				pushAndResetChunk(i, j);
				lastCh = 'correct';
			}
		}

		//if characters dont match
		else if (charactersDontMatch(bible[i], input[j])) {
			if (lastCh === 'incorrect') {
				chunk += input[j];
			} else {
				pushAndResetChunk(i, j);
				lastCh = 'incorrect';
			}
		}

		//if input is longer than bible text
		else if (input[j] && !bible[i]) {
			if (lastCh === 'incorrect') {
				chunk += input[j];
			} else {
				pushAndResetChunk(i, j);
				lastCh = 'incorrect';
			}
		}
		conditionallyPushLastChunk(input.length, j);
	}

	attemptedPercentCorrect =
		//0 input = 0% attempted success
		input.length === 0
			? 0
			: //do not divide by zero
			input.length - neutral === 0
			? Math.round((correct / input.length) * 100)
			: //normal calculation, given ideal conditions
			  Math.round((correct / (input.length - neutral)) * 1000) / 10;

	totalPercentCorrect =
		Math.round((correct / bibleCondensed.length) * 1000) / 10;

	return (
		<>
			<h3 className={styles.resultsLabel}>Results</h3>
			<div className={styles.resultsContainer}>
				{textArray.length === 0 ? (
					<p className={styles.placeholder}>Corrected text will appear here</p>
				) : (
					<p className={styles.resultsP}>{textArray}</p>
				)}
			</div>
			<h3 className={styles.statsLabel}>Stats:</h3>
			<section className={styles.statsContainer}>
				<p>Attempted Correct: {attemptedPercentCorrect}%</p>
				<p>Total Correct: {totalPercentCorrect}%</p>
			</section>
		</>
	);
};
