import React from 'react';

const getClass = (i, current, comparison, boundLeft, boundRight) => {
	switch (i) {
		case current:
			return 'bar-current';
		case comparison:
			return 'bar-comparison';
		case boundLeft:
		case boundRight:
			return 'bar-bound';
		default:
			return 'bar-normal';
	}
}

const Graph = (props) => {
	const barWidth = Math.max(0, 100 / (props.items ? props.items.length : 1));
	return (
		<svg className='graph' viewBox="0 0 100 100" preserveAspectRatio="none">
			{props.items.map((item, i) => (
				<g
					key={item.id}
					transform={'translate(' + (i * barWidth) + ', ' + (100 * ((props.maxValue - item.value) / props.maxValue)) + ')'}
					className={getClass(i, props.currentIndex, props.comparisonIndex, props.boundLeft, props.boundRight)}
				>
					<rect width={barWidth * 0.95} height={100 * (item.value / props.maxValue)}></rect>
				</g>
			))}
		</svg>
	);
}

export default Graph;