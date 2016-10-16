import React, { Component } from 'react';
import { ALGORITHMS } from './../algorithms/Algorithms';
import { sleep } from './../util/Util';
import LegendPane from './LegendPane';
import ControlsPane from './ControlsPane';
import StatsPane from './StatsPane';
import PropertiesPane from './PropertiesPane';
import Graph from './Graph';

export default class SortingVisualiser extends Component {

	liveState = {
		itemsToGenerate: 25,
		items: [],
		stepTime: 10,
		runTime: 0,
		comparisons: 0,
		swaps: 0,
		previousTime: 0,
		running: false,

		algorithm: ALGORITHMS[0],
	};

	state = {
		itemsToGenerate: 25,
		items: [],
		stepTime: 10,
		runTime: 0,
		comparisons: 0,
		swaps: 0,
		previousTime: 0,
		running: false,

		algorithm: ALGORITHMS[0],
	};

	render() {
		return (
			<div className="sorting-visualiser">
				<h2>Sorting Visualiser</h2>
				<section className="graph-section">
					<Graph {...this.state} />
				</section>
				<section className="controls-section">
					<ControlsPane
						{...this.state}
						updateTimeStep={this.updateStepTime}
						start={this.start}
						selectAlgorithm={this.selectAlgorithm}
						stop={this.stop}
						newArray={this.generateRandom}
						updateArraySize={this.updateArraySize}
						algorithms={ALGORITHMS}
					/>
				</section>
				<section className="stats-and-algorithms">
					<div className="graph-side-bar">
						<StatsPane {...this.state} />
						<LegendPane />
					</div>
				</section>
				<section className="props-section">
					<div className="algorithm-info">
						<PropertiesPane
							algorithm={this.state.algorithm}
						/>
					</div>
				</section>
			</div>
		);
	}

	componentDidMount() {
		this.runRenderLoop();
		this.generateRandom();
	}

	runRenderLoop = () => {
		this.updateTimer();
		const liveString = JSON.stringify(this.liveState);
		if (liveString !== JSON.stringify(this.state) || this.liveState.algorithm !== this.state.algorithm) {
			const copy = JSON.parse(liveString);
			this.setState(copy);
			this.setState({ algorithm: this.liveState.algorithm });
		}
		window.requestAnimationFrame(this.runRenderLoop);
	}
	
	updateTimer = () => {
		if (!this.state.running) return;

		const now = (new Date()).getTime();
		const delta = now - this.liveState.previousTime;
		this.liveState.previousTime = now;
		this.liveState.runTime += delta;
	}

	generateRandom = () => {
		if (this.running()) return;

		const items = [];
		let max = 0;
		for (let i = 0; i < this.liveState.itemsToGenerate; i++) {
			const value = parseFloat(Math.random() * 995) + 5;
			max = Math.max(value, max);
			items.push({
				value,
				id: i,
			})
		}

		this.liveState.items = items;
		this.liveState.maxValue = max;
		this.liveState.comparisons = 0;
		this.liveState.swaps = 0;
		this.liveState = {
			...this.liveState,
			items,
			maxValue: max,
			comparisons: 0,
			swaps: 0,
			currentIndex: -1,
			comparisonIndex: -1,
			boundLeft: -1,
			boundRight: -1,
		};
	}

	selectAlgorithm = (algorithm) => {
		this.liveState.algorithm = algorithm;
	}

	start = () => {
		this.liveState.running = true;
		this.liveState.previousTime = (new Date()).getTime();
		this.liveState.runTime = 0;

		this.state.algorithm.run(
			this.items,
			this.sleep,
			this.getSleepTime,
			this.running,
			this.comparison,
			this.swapItems,
			this.setCurrentIndex,
			this.setComparisonIndex,
			this.setBoundLeftIndex,
			this.setBoundRightIndex,
			this.stop,
		);
	}

	items = () => {
		return this.liveState.items;
	}

	comparison = () => {
		this.liveState.comparisons++;
	}

	swapItems = (i, j) => {
		const temp = this.liveState.items[i];
		this.liveState.items[i] = this.liveState.items[j];
		this.liveState.items[j] = temp;
		this.liveState.swaps++;
	}

	running = () => {
		return this.liveState.running;
	}

	setCurrentIndex = (i) => {
		this.liveState.currentIndex = i;
	}

	setComparisonIndex = (i) => {
		this.liveState.comparisonIndex = i;
	}

	setBoundLeftIndex = (i) => {
		this.liveState.boundLeft = i;
	}

	setBoundRightIndex = (i) => {
		this.liveState.boundRight = i;
	}

	async sleep(time) {
		await sleep(time);
	}

	updateStepTime = (step) => {
		this.liveState.stepTime = step;
	}

	stop = () => {
		this.liveState.running = false;
	}

	updateArraySize = (step) => {
		if (this.running()) return;

		this.liveState.itemsToGenerate = step;
		this.generateRandom();
	}

	getSleepTime = () => {
		return this.liveState.stepTime;
	}

};