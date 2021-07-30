import React from 'react';
import { Message } from '../Message/Message';

import { useDispatch } from 'react-redux';
import {
	offlineMessageClosed,
	updateMessageClosed,
	installedMessageClosed,
} from '../../store/appSlice';
import { useAppSelector } from 'store/store';

export const ServiceWorkerMessages = () => {
	const dispatch = useDispatch();
	const { showIsOffline, showCloseTabs, showAppIsInstalled } = useAppSelector((s) => s.app);

	return (
		<>
			<Message
				message={
					'App is running in offline mode. You may access your 5 most recently viewed chapters.'
				}
				show={showIsOffline}
				handleHide={() => dispatch(offlineMessageClosed())}
			/>
			<Message
				message={
					'A new update is available. Update will install automatically once all existing tabs are closed.'
				}
				show={showCloseTabs}
				handleHide={() => dispatch(updateMessageClosed())}
			/>
			<Message
				message={
					'This app works offline! You may view your 5 most recent chapters without an internet connection.'
				}
				show={showAppIsInstalled}
				handleHide={() => dispatch(installedMessageClosed())}
			/>
		</>
	);
};
