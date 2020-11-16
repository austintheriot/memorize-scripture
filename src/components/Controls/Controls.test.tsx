import React, { useState } from 'react';
import { Controls } from 'components/Controls/Controls';
import { AudioContext } from 'app/audioContext';
import { render, screen, waitForElement } from 'utils/test-utils';
import userEvent from '@testing-library/user-event';
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
	describe('Component', () => {
		test('Should render without crashing', () => {
			const audio = new Audio(Psalm23Audio);
			render(<ControlsWrapped audio={audio} />);
		});
	});
	describe('Audio Controls', () => {});
});
