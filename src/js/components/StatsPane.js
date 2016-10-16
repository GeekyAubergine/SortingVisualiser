import React from 'react';
import Pane from './core/Pane';

const time = (time) => {
	if (time < 10 * 1000) {
		return time + 'ms';
	}
	if (time < 60 * 1000) {
		return (time / 1000).toFixed(2) + 's';
	}

	const min = Math.floor(time / (1000 * 60)).toFixed(0);
	const sec = (time % (1000 * 60) / (1000)).toFixed(2);

	return min + 'm ' + sec + 's';
}

const StatsPane = (props) => (
	<Pane header="Stats" className="stats">
		<ul>
			<li>Comparisons: {props.comparisons}</li>
			<li>Swaps: {props.swaps}</li>
			<li>Time: {time(props.runTime)}</li>
		</ul>
	</Pane>
);

export default StatsPane;