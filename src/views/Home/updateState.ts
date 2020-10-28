//State
import {
	setAudioHasError,
	setAudioIsReady,
	setAudioPosition,
} from '../../app/state/audioSlice';
import {
	setBook,
	setChapter,
	setBody,
	setSplit,
	setCondensed,
} from '../../app/state/textSlice';
import {
	setSearchBook,
	setSearchChapter,
	setSearchNumberOfChapters,
} from '../../app/state/searchSlice';

//Utilities
import { bookChapters } from './bible';
import { condenseText, breakFullTextIntoLines } from './condense';

//types
import { UtilityConfig } from '../../app/types';

export const updateSearchTerms = (
	book: string,
	chapter: string,
	config: UtilityConfig
) => {
	config.dispatch(setSearchBook(book));
	config.dispatch(setSearchChapter(chapter));
	const newNumberOfChapters = bookChapters[book]; //get chapter numbers
	config.dispatch(setSearchNumberOfChapters(newNumberOfChapters)); //set chapter numbers
};

export const updateResults = (
	book: string,
	chapter: string,
	body: string,
	config: UtilityConfig
) => {
	//Auio Settings:
	config.textAudio.pause();
	config.dispatch(setAudioHasError(false));
	config.dispatch(setAudioIsReady(false));
	config.dispatch(setAudioPosition(0));
	config.setTextAudio(
		new Audio(`https://audio.esv.org/hw/mq/${book} ${chapter}.mp3`)
	);

	//Text Results:
	config.dispatch(setBook(book === 'Psalms' ? 'Psalm' : book));
	config.dispatch(setChapter(chapter));
	config.dispatch(setBody(body));
	const lineBrokenText = breakFullTextIntoLines(body);
	config.dispatch(setSplit(lineBrokenText));
	config.dispatch(setCondensed(condenseText(lineBrokenText)));
};
