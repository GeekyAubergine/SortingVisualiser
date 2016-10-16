import React, { Component } from 'react';
import Pane from './core/Pane';

export default class ControlsPane extends Component {

	render() {
		return (
			<Pane header="Controls" className="controls">
				<ul>
					<li onClick={this.props.start}>Start</li>
					<li>
						<p>Algorithm</p>
						<select
							disabled={this.props.running}
							value={this.props.algorithm.getName()}
							onChange={e => this.selectAlgorithm(e.target.value)}
						>
							{this.props.algorithms.map((algorithm, i) => (
								<option key={i} value={i}>{algorithm.getName()}</option>
							))}
						</select>
					</li>
					<li onClick={this.props.stop}>Stop</li>
					<li>
						<p>Time Step</p>
						<input
							type="number"
							min='0'
							step='5'
							value={this.props.stepTime}
							onChange={(e) => this.props.updateTimeStep(e.target.value)}
						/>
					</li>
					<li
						className={this.props.running ? 'disabled' : ''}
						onClick={this.props.newArray}
					>
						New Array
					</li>
					<li
						className={this.props.running ? 'disabled' : ''}
					>
						Array Type
					</li>
					<li
						className={this.props.running ? 'disabled' : ''}
					>
						<p>Array Size</p>
						<input
							type="number"
							min='5'
							max='10000'
							step='5'
							value={this.props.itemsToGenerate}
							onChange={(e) => this.props.updateArraySize(e.target.value)}
							disabled={this.props.running}
						/>
					</li>
					<li>Sound</li>
				</ul>
			</Pane>
		);
	}

	selectAlgorithm = (index) => {
		this.props.selectAlgorithm(this.props.algorithms[index]);
	}
}