import { Dispatch } from '@reduxjs/toolkit';

export type SetAudioType = React.Dispatch<
	React.SetStateAction<HTMLAudioElement>
>;

export interface UtilityConfig {
	textAudio: HTMLAudioElement;
	setTextAudio: SetAudioType;
	dispatch: Dispatch;
	analytics: firebase.analytics.Analytics;
}

//STATE TYPES /////////////////////////////////////////

export interface AudioState {
	hasError: boolean;
	isReady: boolean;
	isPlaying: boolean;
	position: number;
	speed: number;
}

export interface AudioSlice {
	audio: AudioState;
}

export interface SearchState {
	book: string;
	chapter: string;
	numberOfChapters: number;
}

export interface SearchSlice {
	search: SearchState;
}

export interface TextState {
	loading: boolean;
	error: boolean;
	book: string;
	chapter: string;
	body: string;
	split: string[];
	condensed: string[];
	showCondensed: boolean;
	clickedLine: number;
	reviewInput: string;
	condenseToolInput: string;
	condenseToolOutput: string[];
	copied: boolean;
}

export interface TextSlice {
	text: TextState;
}

export interface AppState {
	menuIsOpen: boolean;
	showIsOffline: boolean;
	showCloseTabs: boolean;
	showAppIsInstalled: boolean;
}

export interface AppSlice {
	app: AppState;
}
