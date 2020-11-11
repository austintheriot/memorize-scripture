import '@testing-library/jest-dom/extend-expect';

let assignMock: any = null;

beforeEach(() => {
	//Prevent error on window.scrollTo() not supported
	assignMock = jest.fn();
	delete window.scrollTo;
	window.scrollTo = assignMock;
});

afterEach(() => {
	//delete scrollTo mock function
	assignMock.mockClear();
});
