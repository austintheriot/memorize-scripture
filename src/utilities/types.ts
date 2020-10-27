const audio = new Audio();

export type AudioType = typeof audio;

export type SetAudioType = React.Dispatch<
	React.SetStateAction<HTMLAudioElement>
>;

export type Dispatch = (action: any) => void;

export interface UtilityConfig {
	textAudio: AudioType;
	setTextAudio: SetAudioType;
	dispatch: Dispatch;
	analytics: firebase.analytics.Analytics;
}

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

export interface MenuState {
	isOpen: boolean;
}

export interface MenuSlice {
	menu: MenuState;
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
	book: string;
	chapter: string;
	body: string;
	split: string[];
	condensed: string[];
}

export interface TextSlice {
	text: TextState;
}

export interface GlobalState {
	menu: MenuState;
	search: SearchState;
	text: TextState;
	audio: AudioState;
}
