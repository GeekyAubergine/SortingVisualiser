import React, { Component } from 'react';
import { sleep } from './../util/Util';
import LegendPane from './LegendPane';
import ControlsPane from './ControlsPane';
import StatsPane from './StatsPane';
import AlgorithmPane from './AlgorithmPane';
import PropertiesPane from './PropertiesPane';
import Graph from './Graph';

export default class SortingVisualiser extends Component {

	liveState = {
		itemsToGenerate: 50,
		items: [],
		stepTime: 10,
		runTime: 0,
		comparisons: 0,
		swaps: 0,
		previousTime: 0,
		running: false,
	};

	state = {
		itemsToGenerate: 50,
		items: [],
		stepTime: 10,
		runTime: 0,
		comparisons: 0,
		swaps: 0,
		previousTime: 0,
		running: false,
	};

	render() {
		return (
			<div className="sorting-visualiser">
				<h2>Sorting Visualiser</h2>
				<div>
					<Graph {...this.state} />
					<div className="graph-side-bar">
						<LegendPane />
						<StatsPane {...this.state} />
					</div>
				</div>
				<div className="controls-and-algorithms">
					<ControlsPane
						{...this.state}
						updateTimeStep={this.updateStepTime}
						stop={this.stop}
						newArray={this.generateRandom}
						updateArraySize={this.updateArraySize}
					/>
					<AlgorithmPane />
				</div>
				<div className="algorithm-info">
					<PropertiesPane
						desc={['P1', 'kljew ewj werjdsl;ksdf f dsf sjdm fwekl ']}
					/>
				</div>
			</div>
		);
	}

	componentDidMount() {
		this.runRenderLoop();
		this.generateRandom();
	}

	runRenderLoop = () => {
		const liveString = JSON.stringify(this.liveState);
		if (liveString !== JSON.stringify(this.state)) {
			const copy = JSON.parse(liveString);
			this.setState(copy);
		}
		window.requestAnimationFrame(this.runRenderLoop);
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

	async sort() {
		this.start();
		let changed = true;
		while (changed && this.running()) {
			changed = false;
			for (let j = 0; j < this.liveState.items.length - 1 && this.running(); j++) {
				this.setCurrentIndex(j);
				this.setComparisonIndex(j + 1)
				await this.sleep();
				this.step();
				this.comparison();
				if (this.liveState.items[j].value > this.liveState.items[j + 1].value) {
					this.swapItems(j, j + 1);
					changed = true;
				}
			}
		}
	}

	start() {
		this.liveState.running = true;
		this.liveState.previousTime = (new Date()).getTime();
	}

	step() {
		const now = (new Date()).getTime();
		const delta = now - this.liveState.previousTime;
		this.liveState.previousTime = now;
		this.liveState.runTime += delta;
	}

	comparison() {
		this.liveState.comparisons++;
	}

	swapItems(i, j) {
		const temp = this.liveState.items[i];
		this.liveState.items[i] = this.liveState.items[j];
		this.liveState.items[j] = temp;
		this.liveState.swaps++;
	}

	running() {
		return this.liveState.running;
	}

	setCurrentIndex(i) {
		this.liveState.currentIndex = i;
	}

	setComparisonIndex(i) {
		this.liveState.comparisonIndex = i;
	}

	setBoundLeftIndex(i) {
		this.liveState.boundLeft = i;
	}

	setBoundRightIndex(i) {
		this.liveState.boundRight = i;
	}

	async sleep() {
		await sleep(this.liveState.stepTime);
	}

	updateStepTime = (step) => {
		this.liveState.stepTime = step;
	};

	stop = () => {
		this.liveState.running = false;
	};

	updateArraySize = (step) => {
		if (this.running()) return;

		this.liveState.itemsToGenerate = step;
		this.generateRandom();
	}

};