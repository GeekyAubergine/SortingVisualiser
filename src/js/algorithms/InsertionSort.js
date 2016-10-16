import Algorithm from './Algorithm';

export default class InsertionSort extends Algorithm {

	static async run(items, sleep, sleepTime, running, comparison, swap, setCurrentIndex, setComparisonIndex, setBoundLeft, setBoundRight, finish) {
		for (let i = 1; i < items().length && running(); i++) {
			for (let j = i; j > 0 && running(); j--) {
				comparison();
				setCurrentIndex(j);
				setComparisonIndex(j - 1);
				await sleep(sleepTime() / 2);
				if (items()[j - 1].value > items()[j].value) {
					swap(j, j - 1);
				} else {
					break;
				}
				await sleep(sleepTime() / 2);
			}
		}
		finish();
	}

	static getName() {
		return 'Insertion';
	}

	static getDescription() {
		return ['This algorithm works by looping over every time and checking if two ' + 'neighboring elements need to swap, if they do they are swapped. If a swap has ' + 'been made then the algorithm will iterate over all elements again until ' + 'no swaps occur'];
	}

	static getAlgorithm() {
		return 'swapped = true\n' + 'while (swapped) {\n' + '\tswapped = false;\n' + '\tfor (int i = 0; i < n - 1; i++) {\n' + '\t\tif (array[i] > array[i + 1]) {\n' + '\t\t\ttemp = array[i];\n' + '\t\t\tarray[i] = array[i + 1];\n' + '\t\t\tarray[i + 1] = temp;\n' + '\t\t\tswapped = true;\n' + '\t\t}\n' + '\t}\n' + '}\n';
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