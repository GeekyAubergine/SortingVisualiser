import React from 'react';
import Pane from './core/Pane';

const AlgorithmPane = (props) => (
	<Pane header="Algorithms" className="algorithms">
		<ul>
			<li>Bubble</li>
			<li>Merge</li>
			<li>Quick</li>
		</ul>
	</Pane>
);

export default AlgorithmPane;