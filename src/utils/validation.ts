import { BibleBook, bookTitlesAndChapters } from 'pages/Learn/bible';
import { isNumeric } from './isNumeric';

const CHAPTER_ERROR_GENERIC = 'Please provide a valid chapter number';

export const validateBook = (book: unknown) => {
  if (typeof book !== 'string') {
    console.log('Book Validation Error: book input is not a string.');
    return 'Please provide a valid string input.';
  }
  if (!(book in bookTitlesAndChapters)) {
    console.log('Book Validation Error: book input is not a book of the bible');
    return 'Please choose a valid book.';
  }
	else return '';
};

export const validateBookAndChapter = (book: unknown, chapter: unknown) => {
	const bookValidation = validateBook(book);
	if (bookValidation) return bookValidation;
	const validBook = book as BibleBook;
	const numberOfChapters = bookTitlesAndChapters[validBook];

  if (typeof chapter !== 'string') {
    console.log('Chapter Validation Error: chapter is not a string.')
    return CHAPTER_ERROR_GENERIC;
  }
  if (!isNumeric(chapter)) {
    console.log('Chapter Validation Error: chapter is not a numeric.')
    return CHAPTER_ERROR_GENERIC;
  }
	const chapterNumber = Number(chapter);
	if (
		!Number.isInteger(chapterNumber) ||
		chapterNumber < 1 ||
		chapterNumber > numberOfChapters
  ) {
    console.log('Chapter Validation Error: chapter is not a valid chapter, based on the selected book.')
		return CHAPTER_ERROR_GENERIC;
	}
};
