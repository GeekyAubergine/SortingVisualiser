import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles';
import Pane from './core/Pane';

const PropertiesPane = (props) => (
	<Pane header={props.algorithm.getName() + ' Sort Properties'} className="properties">
		<div>
			{props.algorithm.getDescription().map((p, i) => <p key={i}>{p}</p>)}
			<h4 className="code-heading">Code</h4>
			<div className="code-preview">
				{props.algorithm &&
				<SyntaxHighlighter
					language='python'
					style={docco}
					showLineNumbers
				>
					{props.algorithm.getAlgorithm()}
				</SyntaxHighlighter>
				}
			</div>
			<h4>Stats</h4>
			<p>Best Case: {props.algorithm.getBestCase()}</p>
			<p>Average Case: {props.algorithm.getAverageCase()}</p>
			<p>Worst Case: {props.algorithm.getWorstCase()}</p>
			<p>Memory Usage: {props.algorithm.getMemoryUsage()}</p>
			<p>Stable: {props.algorithm.getStable() ? 'True' : 'False'}</p>
			<p>Technique: {props.algorithm.getTechnique()}</p>
		</div>
	</Pane>
);

export default PropertiesPane;