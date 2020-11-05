export type SetAudioType = React.Dispatch<
	React.SetStateAction<HTMLAudioElement>
>;

export type Dispatch = (action: any) => void;

export interface UtilityConfig {
	audio: HTMLAudioElement;
	setAudio: SetAudioType;
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

export interface RecordingState {
	isRecording: boolean;
	hasError: boolean;
	isReady: boolean;
	isPlaying: boolean;
	position: number;
	speed: number;
}

export interface RecordingSlice {
	recording: RecordingState;
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
