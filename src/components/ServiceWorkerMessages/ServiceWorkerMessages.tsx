import React from 'react';
import { Message } from '../Message/Message';

import { useSelector, useDispatch } from 'react-redux';
import {
	selectApp,
	offlineMessageClosed,
	updateMessageClosed,
	installedMessageClosed,
} from '../../app/appSlice';

export const ServiceWorkerMessages = () => {
	const dispatch = useDispatch();
	const appState = useSelector(selectApp);

	return (
		<>
			<Message
				message={
					'App is running in offline mode. You may access your 5 most recently viewed chapters.'
				}
				show={appState.showIsOffline}
				handleHide={() => dispatch(offlineMessageClosed())}
			/>
			<Message
				message={
					'A new update is available. Update will install automatically once all existing tabs are closed.'
				}
				show={appState.showCloseTabs}
				handleHide={() => dispatch(updateMessageClosed())}
			/>
			<Message
				message={'This app works offline!'}
				show={appState.showAppIsInstalled}
				handleHide={() => dispatch(installedMessageClosed())}
			/>
		</>
	);
};
