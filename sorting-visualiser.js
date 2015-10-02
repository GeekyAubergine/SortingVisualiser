'use strict';

//Element ID's
const PARENT_CONTAINER_ID = 'sorting-visualiser-container';
const GRAPH_CONTAINER_ID = 'sorting-visualiser-graph-container';
const GRAPH_ID = 'sorting-visualiser-graph';
const BUTTONS_CONTAINER_ID = 'sorting-visualiser-buttons-container';
const GRAPH_GRAPHICS_ID = 'sorting-visualiser-graph-graphics-element';

//Bar class names
const BAR_NORMAL_CLASS = 'bar-normal';
const BAR_ACTIVE_CLASS = 'bar-active'; //Current bar indexed
const BAR_COMPARISON_CLASS = 'bar-comparison';
const BAR_BOUND_CLASS = 'bar-bound';

const LOGGING_ACTIVE = true;

const MAX_VALUE = 100;
const GRAPH_HEIGHT_TO_WIDTH_RATIO = 0.3;

//Graph margins
const margin = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10
};

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
var numberOfElementsToSort = 100;
var arrayToSort = [];
var sortingStepDelay = 0.1;
var sortingStats = {
  numberOfComparisons: 0,
  numberOfSwaps: 0
}

/* ------------------------------------------------------------------------- */
/* Utility Methods
/* ------------------------------------------------------------------------- */

function info(stringToLog) {
  if (LOGGING_ACTIVE) {
    console.log(stringToLog);
  }
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

  axisGraphicsElements.x = graph.append('g').attr('class', 'x axis');
  axisGraphicsElements.y = graph.append('g').attr('class', 'y axis');
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

/**
 * Creates the UI
 */
function createUI() {
  if (parentContainerExsists()) {
    createGraph();
    updateGraphDimensions();
  } else {
    info('No element found with id "' + PARENT_CONTAINER_ID + '"');
    info('Please create a div with that id where you wish for the visualiser to be created.');
  }
}

/* ------------------------------------------------------------------------- */
/* Render
/* ------------------------------------------------------------------------- */

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
  var bars = graph.selectAll(".bar")
    .data(dataToRender);

  bars.enter().append("rect")
    .attr("class", "bar")
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

  bars.attr("class", "bar")
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
  render();
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
  var sorted = true;
  var i = 0;
  //Pass variables to inner function
  (function(arrayToSort, sorted, i) {
    var sortingLoop = setInterval(function() {
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
  setTimeout(function() {
    generateRandomData();
    bubbleSort();
  }, 1000);
})

window.onresize = function() {
  updateGraphDimensions();
  render();
}
