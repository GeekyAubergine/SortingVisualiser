import React, { Component } from 'react';
import { sleep } from './../util/Util';
import LegendPane from './LegendPane';
import Graph from './Graph';

export default class SortingVisualiser extends Component {

	state = {
		items: [],
	};

	liveState = {
		items: [],
	};

	render() {
		return (
			<div className="sorting-visualiser">
				<h2>Sorting Visualiser</h2>
				<div>
					<Graph {...this.state} />
					<LegendPane />
				</div>
			</div>
		);
	}

	componentDidMount() {
		this.runRenderLoop();
		this.generateRandom();
		this.sort();
	}

	runRenderLoop = () => {
		const liveString = JSON.stringify(this.liveState);
		if (liveString !== JSON.stringify(this.state)) {
			const copy = JSON.parse(liveString);
			this.setState(copy);
		}
		window.requestAnimationFrame(this.runRenderLoop);
	}

	generateRandom() {
		const items = [];
		let max = 0;
		for (let i = 0; i < 100; i++) {
			const value = parseFloat(Math.random() * 995) + 5;
			max = Math.max(value, max);
			items.push({
				value,
				id: i,
			})
		}

		this.liveState.items = items;
		this.liveState.maxValue = max;
	}

	async sort() {
		let changed = true;
		while (changed) {
			changed = false;
			for (let j = 0; j < this.liveState.items.length - 1; j++) {
				this.setCurrentIndex(j);
				this.setComparisonIndex(j + 1)
				await sleep(0);
				if (this.liveState.items[j].value > this.liveState.items[j + 1].value) {
					this.swapItems(j, j + 1);
					changed = true;
				}
			}
		}
		
		setTimeout(() => {
			this.generateRandom();
			this.sort();
		}, 1000);
	}

	swapItems(i, j) {
		const temp = this.liveState.items[i];
		this.liveState.items[i] = this.liveState.items[j];
		this.liveState.items[j] = temp;
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

};