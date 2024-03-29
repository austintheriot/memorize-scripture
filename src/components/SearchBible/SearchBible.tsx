import React, { ChangeEvent, FormEvent, useCallback } from 'react';
import styles from './SearchBible.module.scss';
import { BibleBook, bookTitles, Chapter, Title } from '../../pages/Memorize/bible';
import { getTextBody, addToTextArray } from '../../utils/storageUtils';
import {
	textRetrievedFromLocalStorage,
	fetchTextFromESVAPI,
} from '../../store/textSlice';
import searchIcon from '../../icons/search.svg';
import { useFirebaseContext } from 'hooks/useFirebaseContext';
import { useAppDispatch, useAppSelector } from 'store/store';
import {
	bookSelector,
	chaptersArraySelector,
	chapterSelector,
	setBook,
	setChapter,
	setAudioUrl,
} from 'store/searchSlice';
import useStateIfMounted from 'hooks/useStateIfMounted';
import { validateBookAndChapter } from 'utils/validation';
import Input from 'components/Input/Input';
import FocusRing from 'components/FocusRing/FocusRing';

export const SearchBible = () => {
	const dispatch = useAppDispatch();
	const { analytics } = useFirebaseContext();
	const book = useAppSelector(bookSelector);
	const chapter = useAppSelector(chapterSelector);
	const chaptersArray = useAppSelector(chaptersArraySelector);
	const [message, setMessage] = useStateIfMounted('');

	const clearError = () => setMessage('');

	const handleSubmit = useCallback(
		(e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
			e.preventDefault();

			if (validateBookAndChapter(book, chapter)) {
				setMessage('Please provide a valid book and chapter.');
				return;
			}

			const validBook = book as BibleBook;
			const validChapter = chapter as Chapter;

			//Check local storage
			const title = `${validBook} ${validChapter}` as Title;
			console.log(`Checking local storage for ${title}`);
			//try to retrieve text body from local storage
			let body = getTextBody(title);
			if (body) {
				console.log(`Retrieved body of ${title} from local storage`);
				dispatch(
					textRetrievedFromLocalStorage({
						book: validBook,
						chapter: validChapter,
						body,
					}),
				);
				dispatch(setAudioUrl({ book: validBook, chapter: validChapter }));
				addToTextArray(title, body);
				analytics.logEvent('fetched_text_from_local_storage', {
					searchBook: validBook,
					searchChapter: validChapter,
					title: `${book} ${validChapter}`,
				});
			} else {
				//If it does not exist in local storage, make an API call, and store the returned text
				console.log(`${title} not found in local storage`);
				console.log('Making a call to the ESV API');
				dispatch(fetchTextFromESVAPI(validBook, validChapter, analytics));
			}
		},
		[analytics, book, chapter, setMessage, dispatch],
	);

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<Input
				label="Book"
				id="book"
				list="book-list"
				value={book}
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					clearError();
					dispatch(setBook(e.target.value));
				}}
				onFocus={clearError}
				componentStyles={styles.InputComponentStyles}
			>
				<datalist id="book-list">
					{bookTitles.map((book) => (
						<option key={book} value={book} />
					))}
				</datalist>
			</Input>

			<Input
				label="Chapter"
				value={chapter}
				id="chapter"
				list="chapter-list"
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					clearError();
					dispatch(setChapter(e.target.value));
				}}
				onFocus={clearError}
				componentStyles={styles.InputComponentStyles}
			>
				<datalist id="chapter-list">
					{chaptersArray.map((chapter) => (
						<option value={chapter} key={chapter} />
					))}
				</datalist>
			</Input>

			<button
				className={styles.searchButton}
				onClick={handleSubmit}
				aria-label={'Search'}
				data-testid="search"
			>
				<img src={searchIcon} alt="search" className={styles.searchIcon} />
				<FocusRing />
			</button>
		{!!message &&	<p className={styles.message}>{message}</p>}
		</form>
	);
};
