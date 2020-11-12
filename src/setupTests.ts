import '@testing-library/jest-dom/extend-expect';

beforeEach(() => {
	global.scrollTo = jest.fn();
	global.console.log = jest.fn();

	HTMLMediaElement.prototype.play = jest.fn();
	HTMLMediaElement.prototype.pause = jest.fn();
	HTMLMediaElement.prototype.load = jest.fn();

	const localStorageMock = {
		getItem: jest.fn(),
		setItem: jest.fn(),
		removeItem: jest.fn(),
		clear: jest.fn(),
	};
	global.localStorage = localStorageMock as any;
});
