// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import { unmountComponentAtNode } from 'react-dom';

let container: any = null;
let assignMock: any = null;

beforeEach(() => {
	//Prevent error on window.scrollTo() not supported
	assignMock = jest.fn();
	delete window.scrollTo;
	window.scrollTo = assignMock;

	// setup a DOM element as a render target
	container = document.createElement('div');
	document.body.appendChild(container);
});

afterEach(() => {
	// cleanup on exiting
	unmountComponentAtNode(container);
	container?.remove();
	container = null;

	//delete scrollTo mock function
	assignMock.mockClear();
});
