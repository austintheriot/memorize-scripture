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
