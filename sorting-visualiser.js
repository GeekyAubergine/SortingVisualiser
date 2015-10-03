'use strict';

//Element ID's
const PARENT_CONTAINER_ID = 'sorting-visualiser-container';
const GRAPH_CONTAINER_ID = 'sorting-visualiser-graph-container';
const GRAPH_ID = 'sorting-visualiser-graph';
const STATS_CONTAINER_ID = 'sorting-visualiser-stats-container';
const CONTROLS_CONTAINER_ID = 'sorting-visualiser-controls-container';
const BUTTONS_CONTAINER_ID = 'sorting-visualiser-buttons-container';
const GRAPH_GRAPHICS_ID = 'sorting-visualiser-graph-graphics-element';
const STATS_COMPARISONS_ID = 'sorting-visualiser-comparisons-stat';
const STATS_SWAPS_ID = 'sorting-visualiser-swaps-stat';

//Bar class names
const BAR_NORMAL_CLASS = 'sv-bar-normal';
const BAR_ACTIVE_CLASS = 'sv-bar-active'; //Current bar indexed
const BAR_COMPARISON_CLASS = 'sv-bar-comparison';
const BAR_BOUND_CLASS = 'sv-bar-bound';

//
const BUTTON_CLASS = 'sv-button'
const BUTTON_SELECTED_CLASS = 'sv-selected';

const STAT_CLASS = 'sv-stat';
const CONTROL_CONTAINER_CLASS = 'sv-control';
const CONTROL_LABEL_CLASS = 'sv-control-label';

//Controls
const CONTROL_ARRAY_SIZE_LABEL = "Array Size";
const CONTROL_ARRAY_SIZE_STEP = 5;
const CONTROL_LOOP_TIME_LABEL = "Time Step";
const CONTROL_LOOP_TIME_MIN = 0;
const CONTROL_LOOP_TIME_STEP = 0.1;

const LOGGING_ACTIVE = true;

const ARRAY_MIN_SIZE = 5;
const MAX_VALUE = 100;
const GRAPH_HEIGHT_TO_WIDTH_RATIO = 0.3;

//Graph margins
const margin = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10
};

//Buttons
var sortingAlgorithmButtons = [{
  name: 'Bubble',
  callBack: bubbleSort
}]

var graphDimensions = {
  width: 0,
  height: 0
}
var axis = {
  x: null,
  y: null
};
var axisGraphicsElements = {
  x: null,
  y: null
};
var graphScale = {
  x: null,
  y: null
};

//Sorting variables
var numberOfElementsToSort = 20;
var arrayToSort = [];
var sortingStepDelay = 1;
var sortingCurrentIndex;
var sortingComparisonIndex;
var sortingLeftBound;
var sortingRightBound;
var sortingStats = {
  numberOfComparisons: 0,
  numberOfSwaps: 0
}
var sortingAlgorithmCurrentlyRunning = false;

/* ------------------------------------------------------------------------- */
/* Utility Methods
/* ------------------------------------------------------------------------- */

function info(stringToLog) {
  if (LOGGING_ACTIVE) {
    console.log(stringToLog);
  }
}

function startSortingAlgorithm() {
  sortingAlgorithmCurrentlyRunning = true;
}

function stopSortingAlgorithm() {
  sortingAlgorithmCurrentlyRunning = false;
  d3.selectAll('.' + BUTTON_CLASS).classed(BUTTON_SELECTED_CLASS, false);
  sortingCurrentIndex = -1;
  sortingComparisonIndex = -1;
  sortingLeftBound = -1;
  sortingRightBound = -1;
  updateScreen();
}

/* ------------------------------------------------------------------------- */
/* UI Creation and control
/* ------------------------------------------------------------------------- */

/**
 * Returns whether or not the parent container exsists
 * @return {boolean} Whether the parent container exsists
 */
function parentContainerExsists() {
  return $('#' + PARENT_CONTAINER_ID).length > 0;
}

/**
 * Creates graph and associated DOM elements
 */
function createGraph() {
  var parentContainer = d3.select("#" + PARENT_CONTAINER_ID);
  var graphContainer = parentContainer.append('div').attr('id', GRAPH_CONTAINER_ID);
  var graph = graphContainer.append('svg').attr('id', GRAPH_ID);
  graph.append('g').attr('id', GRAPH_GRAPHICS_ID);

  axisGraphicsElements.x = graph.append('g').attr('class', 'x sv-axis');
  axisGraphicsElements.y = graph.append('g').attr('class', 'y sv-axis');
}

/**
 * Updates the dimensions of the graph and updates graphics
 */
function updateGraphDimensions() {
  //Get graphics objects
  var graphContainer = d3.select('#' + GRAPH_CONTAINER_ID);
  var graph = d3.select('#' + GRAPH_ID);

  var graphContainerWidth = parseInt(graphContainer.style('width'));
  var graphContainerHeight = graphContainerWidth * GRAPH_HEIGHT_TO_WIDTH_RATIO;
  $("#" + GRAPH_CONTAINER_ID).css("height", graphContainerHeight);

  var width = graphDimensions.width = graphContainerWidth - margin.left - margin.right;
  var height = graphDimensions.height = graphContainerHeight - margin.top - margin.bottom;

  //Set scales
  graphScale.x = d3.scale.linear().range([0, graphDimensions.width]);
  graphScale.y = d3.scale.linear().range([graphDimensions.height - margin.top, 0]);

  //Set axis
  axis.x = d3.svg.axis().scale(graphScale.x).orient('bottom').ticks('none');
  axis.y = d3.svg.axis().scale(graphScale.y).orient('left').ticks('none');

  //Set graph sizes
  graph.attr('width', graphContainerWidth);
  graph.attr('height', graphContainerHeight);

  //Translate graph from
  //Select graph 'g'
  d3.select('#' + GRAPH_GRAPHICS_ID).attr('transform',
    'translate(' + margin.left + ', ' + margin.top + ')');

  axisGraphicsElements.x
    .attr("width", graphDimensions.width)
    .attr("transform", "translate(" + margin.left + "," + height + ")")
    .call(axis.x);
  axisGraphicsElements.y
    .attr("height", graphDimensions.height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(axis.y);
}

/* ---- Stats Creation ---- */
function createStats() {
  var statsContainer = d3.select('#' + PARENT_CONTAINER_ID).append('div').attr('id', STATS_CONTAINER_ID);
  statsContainer.append('div').attr('class', STAT_CLASS).append('p').attr('id', STATS_COMPARISONS_ID);
  statsContainer.append('div').attr('class', STAT_CLASS).append('p').attr('id', STATS_SWAPS_ID);
}

function updateStats() {
  d3.select('#' + STATS_COMPARISONS_ID).text("Comparisons: " + sortingStats.numberOfComparisons);
  d3.select('#' + STATS_SWAPS_ID).text("Swaps: " + sortingStats.numberOfSwaps);
}

/* ---- Control Creation ---- */
function createControls() {
  var controlsContainer = d3.select('#' + PARENT_CONTAINER_ID).append('div').attr('id', CONTROLS_CONTAINER_ID);
  var arraySizeControlContainer = controlsContainer.append('div').attr('class', CONTROL_CONTAINER_CLASS);
  arraySizeControlContainer.append('div').attr('class', CONTROL_LABEL_CLASS)
    .append('p').text(CONTROL_ARRAY_SIZE_LABEL);
  var arraySizeControl = arraySizeControlContainer.append('input')
    .attr('type', 'number')
    .attr('min', ARRAY_MIN_SIZE)
    .attr('step', CONTROL_ARRAY_SIZE_STEP)
    .attr('value', numberOfElementsToSort);

  arraySizeControl.on('input', function() {
    if (!sortingAlgorithmCurrentlyRunning) {
      numberOfElementsToSort = this.value;
      generateRandomData();
      updateScreen();
    } else {
      this.value = numberOfElementsToSort;
    }
  });

  var timeStepControlContainer = controlsContainer.append('div').attr('class', CONTROL_CONTAINER_CLASS);
  timeStepControlContainer.append('div').attr('class', CONTROL_LABEL_CLASS)
    .append('p').text(CONTROL_LOOP_TIME_LABEL);
  var timeSetControl = timeStepControlContainer.append('input')
    .attr('type', 'number')
    .attr('min', CONTROL_LOOP_TIME_MIN)
    .attr('step', CONTROL_LOOP_TIME_STEP)
    .attr('value', sortingStepDelay / 1000);

  timeSetControl.on('input', function() {
    sortingStepDelay = Math.max(this.value * 1000, CONTROL_LOOP_TIME_MIN);
  });
}

/* ---- Button Creation ---- */
function createSortingAlgorithmButtons() {
  var buttonsContainer = d3.select('#' + PARENT_CONTAINER_ID).append('div').attr('id', BUTTONS_CONTAINER_ID);
  for (var i = 0; i < sortingAlgorithmButtons.length; i++) {
    createButton(buttonsContainer, sortingAlgorithmButtons[i]);
  }
}

function createButton(parent, buttonData) {
  var button = parent.append('div').attr('class', BUTTON_CLASS);
  button.append('p').text(buttonData.name);
  button.on('click', function() {
    if (!sortingAlgorithmCurrentlyRunning) {
      button.classed(BUTTON_SELECTED_CLASS, true);
      buttonData.callBack();
      startSortingAlgorithm();
    }
  });
}

function createButtons() {
  createSortingAlgorithmButtons();
}

/**
 * Creates the UI
 */
function createUI() {
  if (parentContainerExsists()) {
    createGraph();
    updateGraphDimensions();
    createStats();
    updateStats();
    createControls();
    createButtons();
  } else {
    info('No element found with id "' + PARENT_CONTAINER_ID + '"');
    info('Please create a div with that id where you wish for the visualiser to be created.');
  }
}

/* ------------------------------------------------------------------------- */
/* Render
/* ------------------------------------------------------------------------- */

function getClassForBar(d) {
  if (d.x == sortingCurrentIndex) {
    return BAR_ACTIVE_CLASS;
  }
  if (d.x == sortingComparisonIndex) {
    return BAR_COMPARISON_CLASS;
  }
  if (d.x == sortingLeftBound || d.x == sortingRightBound) {
    return BAR_BOUND_CLASS;
  }
  return BAR_NORMAL_CLASS;
}

/**
 * Returns the data to render in a usable format for d3.js
 */
function getRenderData() {
  var out = [];
  var data = arrayToSort.slice();
  for (var i = 0; i < data.length; i++) {
    out.push({
      x: i,
      y: data[i]
    });
  }
  return out;
}

/**
 * Renders the graph to screen
 */
function render() {
  var dataToRender = getRenderData();
  if (dataToRender == undefined || dataToRender == null) {
    return;
  }
  graphScale.y.domain([0, d3.max(arrayToSort)]);
  graphScale.x.domain([0, arrayToSort.length]);

  var graph = d3.select('#' + GRAPH_ID);

  //Reset all bars
  d3.selectAll('.' + BAR_ACTIVE_CLASS).attr('class', BAR_NORMAL_CLASS);
  d3.selectAll('.' + BAR_COMPARISON_CLASS).attr('class', BAR_NORMAL_CLASS);
  d3.selectAll('.' + BAR_BOUND_CLASS).attr('class', BAR_NORMAL_CLASS);

  var bars = graph.selectAll('.' + BAR_NORMAL_CLASS)
    .data(dataToRender);

  bars.enter().append("rect")
    .attr("class", function(d) {
      return getClassForBar(d)
    })
    .attr("x", function(d) {
      return graphScale.x(d.x);
    })
    .attr("width", graphDimensions.width / dataToRender.length)
    .attr("y", function(d) {
      return graphScale.y(d.y);
    })
    .attr("height", function(d) {
      return graphDimensions.height - graphScale.y(d.y);
    })
    .attr("transform", "translate(" + margin.left + ", 0)");

  bars.attr("class", function(d) {
      return getClassForBar(d)
    })
    .attr("x", function(d) {
      return graphScale.x(d.x);
    })
    .attr("width", graphDimensions.width / dataToRender.length)
    .attr("y", function(d) {
      return graphScale.y(d.y);
    })
    .attr("height", function(d) {
      return graphDimensions.height - graphScale.y(d.y);
    })
    .attr("transform", "translate(" + margin.left + ", 0)");

  bars.exit().remove();
}

function updateScreen() {
  //Yeild
  setTimeout(function() {
    render();
    updateStats();
  }, 0);
}

/* ------------------------------------------------------------------------- */
/* Generation of data
/* ------------------------------------------------------------------------- */

/**
 * Generates a best case array to sort.
 * Best case defined as ascending order
 */
function generateBestCase() {
  arrayToSort = [];
  for (var i = 0; i < numberOfElementsToSort; i++) {
    arrayToSort.push(i);
  }
}

/**
 * Generates a random case array to sort.
 * Best case defined as random order
 */
function generateRandomData() {
  arrayToSort = [];
  for (var i = 0; i < numberOfElementsToSort; i++) {
    arrayToSort.push(Math.random() * MAX_VALUE);
  }
}

/**
 * Generates a worst case array to sort.
 * Best case defined as descending order
 */
function generateWorstCase() {
  arrayToSort = [];
  for (var i = 0; i < numberOfElementsToSort; i++) {
    arrayToSort.push(numberOfElementsToSort - i);
  }
}

/* ------------------------------------------------------------------------- */
/* Sorting algorithms
/* ------------------------------------------------------------------------- */

/* ---- Bubble Sort ---- */
function bubbleSort() {
  startSortingAlgorithm();
  var sorted = true;
  var i = 0;
  info('Bubble sort started');
  //Pass variables to inner function
  (function(arrayToSort, sorted, i) {
    var sortingLoop = setInterval(function() {
      sortingCurrentIndex = i;
      sortingCurrentIndex = i + 1;
      //Comparison
      sortingStats.numberOfComparisons++;
      if (arrayToSort[i] > arrayToSort[i + 1]) {
        //Swap
        sortingStats.numberOfSwaps++;
        var temp = arrayToSort[i];
        arrayToSort[i] = arrayToSort[i + 1];
        arrayToSort[i + 1] = temp;
        sorted = false;
      }
      i++;
      //Return to start of array when done
      if (i >= arrayToSort.length - 1) {
        i = 0;
        if (sorted) {
          clearInterval(sortingLoop);
          info('Bubble sort ended');
          stopSortingAlgorithm();
        }
        sorted = true;
      }
      updateScreen();
    }, sortingStepDelay);
  })(arrayToSort, sorted, i);
}

/* ------------------------------------------------------------------------- */
$(function() {
  createUI();
  generateRandomData();
  updateScreen();
})

window.onresize = function() {
  updateGraphDimensions();
  render();
}
