import React from 'react';
import Pane from './core/Pane';

const ControlsPane = (props) => (
	<Pane header="Controls" className="controls">
		<ul>
			<li><p>Time Step</p><input
				type="number"
				min='0'
				step='5'
				value={props.stepTime}
				onChange={(e) => props.updateTimeStep(e.target.value)}
			/></li>
			<li onClick={props.stop}>Stop</li>
			<li
				className={props.running ? 'disabled' : ''}
				onClick={props.newArray}
			>New Array</li>
			<li
				className={props.running ? 'disabled' : ''}
			>Array Type</li>
			<li
				className={props.running ? 'disabled' : ''}
			><p>Array Size</p><input
				type="number"
				min='5'
				max='10000'
				step='5'
				value={props.itemsToGenerate}
				onChange={(e) => props.updateArraySize(e.target.value)}
				disabled={props.running}
			/></li>
			<li>Sound</li>
		</ul>
	</Pane>
);

export default ControlsPane;