import React from 'react';
import Pane from './core/Pane';

const AlgorithmPane = (props) => (
	<Pane header="Algorithms" className="algorithms">
		<ul>
			{props.algorithms.map((a, i) => (
				<li
					key={i}
					onClick={() => props.start(a)}
				>{a.getName()}</li>
			))}
		</ul>
	</Pane>
);

export default AlgorithmPane;