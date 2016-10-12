import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles';
import Pane from './core/Pane';

const PropertiesPane = (props) => (
	<Pane header="Algorithm Properties" className="properties">
		{props.desc && props.desc.map((p, i) => <p key={i}>{p}</p>)}
		<h4 className="code-heading">Code</h4>
		<div className="code-preview">
			<SyntaxHighlighter
				language='java'
				style={docco}
			>
				{'System.out.println("Lol, sdfsdf"); \nint i = 0;\n' +
				'if (i > 0) {\n\ti = 10;\n}'}
			</SyntaxHighlighter>
		</div>
	</Pane>
);

export default PropertiesPane;