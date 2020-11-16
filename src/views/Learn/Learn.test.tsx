import React from 'react';
import { render, screen } from 'utils/test-utils';
import Learn from './Learn';

describe('<Learn/>', () => {
	describe('Inner Components', () => {
		test('Should render without crashing', () => {
			render(<Learn />);
		});

		test('Should have title Learn', () => {
			render(<Learn />);
			expect(
				screen.getByRole('heading', { name: /Learn/ })
			).toBeInTheDocument();
		});

		test('Should render Psalm 23 title', () => {
			render(<Learn />);
			expect(
				screen.getByRole('heading', { name: /Psalm 23/ })
			).toBeInTheDocument();
		});

		test('Should render a select input called Book', () => {
			render(<Learn />);
			expect(screen.getByLabelText('Book')).toBeInTheDocument();
		});

		test('Should render a select input called Chapter', () => {
			render(<Learn />);
			expect(screen.getByLabelText('Chapter')).toBeInTheDocument();
		});

		test('Should render a button called Search', () => {
			render(<Learn />);
			expect(
				screen.getByRole('button', { name: /search/i })
			).toBeInTheDocument();
		});

		test('Should render a Most Recent <summary> element', () => {
			render(<Learn />);
			expect(screen.getByTestId('most-recent-details')).toBeInTheDocument();
		});

		test('Should render a Most Recent <details> element', () => {
			render(<Learn />);
			expect(screen.getByTestId('most-recent-details')).toBeInTheDocument();
		});
	});
});
