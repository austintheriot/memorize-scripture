import React, { useState } from 'react';
import { Controls } from 'components/Controls/Controls';
import { AudioContext } from 'app/audioContext';
import { render, screen, waitForElement } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
import { speed } from 'app/audioCommands';
const Psalm23Audio = require('audio/Psalm23.mp3');

const ControlsWrapped = (props: { audio: HTMLAudioElement }) => {
	const [textAudio, setTextAudio] = useState(props.audio); //Audio from ESV

	const audio = {
		textAudio,
		setTextAudio,
	};

	return (
		<AudioContext.Provider value={audio}>
			<Controls />
		</AudioContext.Provider>
	);
};

describe('<Controls/>', () => {
	beforeEach(() => {
		const audio = new Audio(Psalm23Audio);
		console.log(audio);
		render(<ControlsWrapped audio={audio} />);
	});

	describe('Component', () => {
		test('Should render without crashing', () => {});
	});

	describe('Audio Controls Display', () => {
		test('Should render all necessary buttons', async () => {
			expect(screen.getByLabelText(/audio position/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/speed/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/beginning/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/rewind/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/forward/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/show condensed text/i)).toBeInTheDocument();
		});
		describe('Speed', () => {
			test('Should step from x0.5 to x2 in increments of 0.25', () => {
				const speedButton = screen.getByLabelText(/speed/i);
				expect(speedButton).toHaveTextContent('x1');
				// userEvent.click(speedButton);
				// expect(speedButton).toHaveTextContent('x1.25');
				// userEvent.click(speedButton);
				// expect(speedButton).toHaveTextContent('x1.5');
				// userEvent.click(speedButton);
				// expect(speedButton).toHaveTextContent('x1.75');
				// userEvent.click(speedButton);
				// expect(speedButton).toHaveTextContent('x2');
				// userEvent.click(speedButton);
				// expect(speedButton).toHaveTextContent('x0.5');
				// userEvent.click(speedButton);
				// expect(speedButton).toHaveTextContent('x0.75');
			});
		});
		describe('Play/Pause', () => {
			test('Should switch to play when pause is clicked', () => {});
			test('Should switch to pause when play is clicked', () => {});
		});
		describe('Error', () => {
			test('Should display error when audio cant be loaded', () => {});
		});
		describe('Loading', () => {
			test('Should show loading icon while waiting for file', () => {});
		});
	});

	describe('Audio Controls', () => {
		describe('Speed', () => {
			test('Should change audio speed to indicated value', () => {});
		});
		describe('Beginning', () => {
			test('Should return audio position to 0', () => {});
		});
		describe('Rewind', () => {
			test('Should move audio position back 5 seconds', () => {});
			test('Should not move audio position to less than 0', () => {});
		});
		describe('Forwards', () => {
			test('Should move audio position ahead 5 seconds', () => {});
			test('Should not move audio position farther than', () => {});
		});
		describe('Play', () => {
			test('Should play audio', () => {});
			test('Should play audio', () => {});
		});
		describe('Pause', () => {
			test('Should pause audio', () => {});
		});
		describe('Audio Position', () => {
			test('Should change audio position to indicated value', () => {});
		});
		describe('Controls in combination', () => {
			test('Should work when playing', () => {});
		});
	});
});
