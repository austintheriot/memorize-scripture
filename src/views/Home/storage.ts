// AUDIO ////////////////////////////

export const storePlaySpeed = (speed: number) => {
	console.log(`Storing ${speed} as default playback speed`);
	window.localStorage.setItem('speed', speed.toString());
};

export const getPlaySpeed = () => {
	console.log('Retrieving playback speed from local storage');
	const speed = window.localStorage.getItem('speed') || '1';
	console.log(`localStorage: playSpeed = ${speed}`);
	return parseFloat(speed);
};

// TEXT ////////////////////////////

interface TextObject {
	title: string;
	body: string;
}

type TextArray = TextObject[];

export const storeShowCondensed = (boolean: boolean) => {
	console.log(
		`Storing showCondensed as ${boolean.toString()} in local storage`
	);
	window.localStorage.setItem('showCondensed', boolean.toString());
};

export const getShowCondensed = (): boolean => {
	console.log(`Retrieving showCondensed setting from local storage`);
	const showCondensed = window.localStorage.getItem('showCondensed') === 'true';
	console.log(`localStorage: showCondensed = ${showCondensed}`);
	return showCondensed;
};

export const storeClickedLine = (number: number) => {
	console.log(`Storing ${number} as latest clicked line in local storage`);
	window.localStorage.setItem('clickedLine', number.toString());
};

export const getClickedLine = (): number => {
	console.log(`Retrieving clickedLine setting from local storage`);
	let clickedLine = window.localStorage.getItem('clickedLine');
	console.log(`localStorage: clickedLine = ${clickedLine}`);
	return clickedLine ? parseInt(clickedLine, 10) : -1;
};

export const storeMostRecentPassage = (title: string) => {
	console.log(
		`Storing ${title} as most the most recently accessed chapter in local storage`
	);
	window.localStorage.setItem('recent', title);
};

export const getTextArray = (title: string) => {
	const textsString = window.localStorage.getItem('texts');
	return textsString ? (JSON.parse(textsString) as TextArray) : [];
};

export const addToTextArray = (title: string, body: string) => {
	console.log(`Checking if ${title} already exists in local storage`);
	let passageIsInLocalStorage = !!getTextBody(title);
	if (passageIsInLocalStorage) {
		console.log(`${title} exists in local storage`);
		return;
	} else {
		console.log(`${title} does not exist in local storage`);
		console.log(`Adding ${title} to local storage`);
		let textArray = getTextArray(title);
		//store no more than 5 passages at a time
		if (textArray.length === 5) textArray.pop();
		textArray.unshift({
			title,
			body,
		});
		window.localStorage.setItem('texts', JSON.stringify(textArray));
	}
};

export const getTextBody = (title: string) => {
	const textArray = getTextArray(title);
	const text = textArray.find((el) => el.title === title);
	return text?.body;
};
