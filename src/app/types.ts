import { Dispatch } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

export type SetAudioType = React.Dispatch<React.SetStateAction<string>>;

export interface UtilityConfig {
	audioElement: HTMLAudioElement;
	dispatch: Dispatch;
	analytics: firebase.analytics.Analytics;
}

//STATE TYPES /////////////////////////////////////////


export type SelectorType = (state: RootState) => any;