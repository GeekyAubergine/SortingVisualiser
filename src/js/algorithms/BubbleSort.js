import Algorithm from './Algorithm';

export default class BubbleSort extends Algorithm {

	static async run(items, sleep, sleepTime, running, comparison, swap, setCurrentIndex, setComparisonIndex, setBoundLeft, setBoundRight, finish) {
		let changed = true;
		while (changed && running()) {
			changed = false;
			for (let i = 0; i < items().length - 1 && running(); i++) {
				setCurrentIndex(i);
				setComparisonIndex(i + 1)
				await sleep(sleepTime() / 2);
				comparison();

				if (items()[i].value > items()[i + 1].value) {
					swap(i, i + 1);
					changed = true;
				}
				await sleep(sleepTime() / 2);
			}
		}
		finish();
	}

	static getName() {
		return 'Bubble';
	}

	static getDescription() {
		return ['This algorithm works by looping over every time and checking if two ' + 'neighboring elements need to swap, if they do they are swapped. If a swap has ' + 'been made then the algorithm will iterate over all elements again until ' + 'no swaps occur'];
	}

	static getAlgorithm() {
		return 'sorted = false' +
			'\nwhile (!sorted) {' +
			'\n\tsorted = true' +
			'\n\tfor (i = 0; i < array.length; i++) {' +
			'\n\t\tif (array[i] > array[i + 1] {' +
			'\n\t\t\ttemp = array[i]' +
			'\n\t\t\tarray[i] = array[i + 1]' +
			'\n\t\t\tarray[i + 1] = temp' +
			'\n\t\t\tsorted = false' +
			'\n\t\t}' +
			'\n\t}' +
			'\n}';
	}

	static getBestCase() {
		return 'O(n)';
	}

	static getAverageCase() {
		return 'O(n^2)';
	}

	static getWorstCase() {
		return 'O(n^2)';
	}

	static getMemoryUsage() {
		return 'O(1)';
	}

	static getStable() {
		return true;
	}

	static getTechnique() {
		return 'Exchanging';
	}

}