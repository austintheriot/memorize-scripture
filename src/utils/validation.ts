import { BibleBook, bookTitlesAndChapters } from 'pages/Memorize/bible';
import { isNumeric } from './isNumeric';

const EMAIL_ERROR_GENERIC = 'Please provide a valid email';

export const validateEmail = (email: unknown): string => {
	if (
		typeof email !== 'string' ||
		!email.match(
			// eslint-disable-next-line no-control-regex
			/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
		)
	)
		return EMAIL_ERROR_GENERIC;
	else return '';
};

const CHAPTER_ERROR_GENERIC = 'Please provide a valid chapter number';

export const validateBook = (book: unknown) => {
	if (typeof book !== 'string') {
		console.log('Book Validation Error: book input is not a string.');
		return 'Please provide a valid string input.';
	}
	if (!(book in bookTitlesAndChapters)) {
		console.log('Book Validation Error: book input is not a book of the bible');
		return 'Please choose a valid book.';
	} else return '';
};

/**
 * Returns string containing any errors. If no errors, returns empty string.
 */
export const validateBookAndChapter = (
	book: unknown,
	chapter: unknown,
): string => {
	const bookValidation = validateBook(book);
	if (bookValidation) return bookValidation;
	const validBook = book as BibleBook;
	const numberOfChapters = bookTitlesAndChapters[validBook];

	if (typeof chapter !== 'string') {
		console.log('Chapter Validation Error: chapter is not a string.');
		return CHAPTER_ERROR_GENERIC;
	}
	if (!isNumeric(chapter)) {
		console.log('Chapter Validation Error: chapter is not a numeric.');
		return CHAPTER_ERROR_GENERIC;
	}
	const chapterNumber = Number(chapter);
	if (
		!Number.isInteger(chapterNumber) ||
		chapterNumber < 1 ||
		chapterNumber > numberOfChapters
	) {
		console.log(
			'Chapter Validation Error: chapter is not a valid chapter, based on the selected book.',
		);
		return CHAPTER_ERROR_GENERIC;
	}
	return '';
};
