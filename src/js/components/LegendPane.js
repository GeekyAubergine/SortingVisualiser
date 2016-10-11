import React from 'react';
import Pane from './core/Pane';
import cx from 'classnames';

const LegendPane = () => (
	<Pane header="Legend" className="legend">
		<ul>
			<li><div className={cx(['legendIcon', 'bar-current'])}/><p>= Current</p></li>
			<li><div className={cx(['legendIcon', 'bar-comparison'])}/><p>= Comparison</p></li>
			<li><div className={cx(['legendIcon', 'bar-bound'])}/><p>= Bound</p></li>
		</ul>
	</Pane>
);

export default LegendPane;