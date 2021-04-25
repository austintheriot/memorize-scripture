import React, { ChangeEvent, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import styles from './SearchBible.module.scss';
import {
	BibleBook,
	bookTitles,
	bookTitlesAndChapters,
	Chapter,
	Title,
} from '../../pages/Learn/bible';
import { getTextBody, addToTextArray } from '../../utils/storageUtils';
import {
	textRetrievedFromLocalStorage,
	fetchTextFromESVAPI,
} from '../../store/textSlice';
import searchIcon from '../../icons/search.svg';
import { audioFileChanged } from 'store/bibleAudioSlice';
import { useFirebaseContext } from 'hooks/useFirebaseContext';
import useStateIfMounted from 'hooks/useStateIfMounted';
import { isNumeric } from 'utils/isNumeric';

export const SearchBible = () => {
	const { analytics } = useFirebaseContext();
	const [book, setBook] = useStateIfMounted('Psalms');
	const [chapter, setChapter] = useStateIfMounted('23');
	const numberOfChapters = useMemo(() => {
		if (!(book in bookTitlesAndChapters)) return 0;
		return bookTitlesAndChapters[book as BibleBook];
	}, [book]);
	const chaptersArray = useMemo(() => {
		return new Array(numberOfChapters)
			.fill(null)
			.map((el, i) => `${i + 1}`) as Chapter[];
	}, [numberOfChapters]);

	const dispatch = useDispatch();

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();

		if (!(book in bookTitlesAndChapters)) return;
		if (
			!chapter ||
			!isNumeric(chapter) ||
			!chaptersArray.includes(chapter as `${number}`)
		)
			return;

		/* @todo: provide error message here
		 *****************************************************
		 *****************************************************
		 *****************************************************
		 *****************************************************
		 *****************************************************
		 */

		const selectedBook = book as BibleBook;
		const selectedChapter = chapter as Chapter;

		//Check local storage
		const title = `${selectedBook} ${selectedChapter}` as Title;
		console.log(`Checking local storage for ${title}`);
		//try to retrieve text body from local storage
		let body = getTextBody(title);
		if (body) {
			console.log(`Retrieved body of ${title} from local storage`);
			dispatch(
				textRetrievedFromLocalStorage({
					book: selectedBook,
					chapter: selectedChapter,
					body,
				}),
			);
			dispatch(
				audioFileChanged({ book: selectedBook, chapter: selectedChapter }),
			);
			addToTextArray(title, body);
			analytics.logEvent('fetched_text_from_local_storage', {
				searchBook: selectedBook,
				searchChapter: selectedChapter,
				title: `${book} ${selectedChapter}`,
			});
		} else {
			//If it does not exist in local storage, make an API call, and store the returned text
			console.log(`${title} not found in local storage`);
			console.log('Making a call to the ESV API');
			dispatch(fetchTextFromESVAPI(selectedBook, selectedChapter, analytics));
		}
	};

	return (
		<form className={styles.form}>
			<label htmlFor="book">Book</label>
			<input
				id="book"
				list="book-list"
				value={book}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setBook(e.target.value)}
			></input>
			<datalist id="book-list">
				{bookTitles.map((book) => (
					<option key={book} value={book} />
				))}
			</datalist>
			<label htmlFor="chapter">Chapter</label>
			<input
				value={chapter}
				id="chapter"
				list="chapter-list"
				onChange={(e: ChangeEvent<HTMLInputElement>) =>
					setChapter(e.target.value)
				}
			></input>
			<datalist id="chapter-list">
				{chaptersArray.map((chapter) => (
					<option value={chapter} key={chapter} />
				))}
			</datalist>
			<button
				className={styles.search}
				onClick={handleSubmit}
				aria-label={'Search'}
				data-testid="search"
			>
				<img src={searchIcon} alt="search" className={styles.searchIcon} />
			</button>
		</form>
	);
};
