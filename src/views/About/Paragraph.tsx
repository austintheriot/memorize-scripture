import React from 'react';

import { Indent } from './Indent';

export const Paragraph = (props: { children: any }) => {
	return (
		<p>
			<Indent />
			{props.children}
		</p>
	);
};
