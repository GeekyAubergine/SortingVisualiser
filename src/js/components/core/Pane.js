import React from 'react';
import cx from 'classnames';

const Pane = (props) => (
	<div className={cx(['pane', props.className])}>
		<h3>{props.header}</h3>
		{props.children}
	</div>
);

export default Pane;