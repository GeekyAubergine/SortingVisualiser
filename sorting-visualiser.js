'use strict';

//Element ID's
const PARENT_CONTAINER_ID = 'sorting-visualiser-container';
const GRAPH_CONTAINER_ID = 'sorting-visualiser-graph-container';
const GRAPH_ID = 'sorting-visualiser-graph';
const BUTTONS_CONTAINER_ID = 'sorting-visualiser-buttons-container';

//Bar class names
const BAR_NORMAL_CLASS = 'bar-normal';
const BAR_ACTIVE_CLASS = 'bar-active'; //Current bar indexed
const BAR_COMPARISON_CLASS = 'bar-comparison';
const BAR_BOUND_CLASS = 'bar-bound';

const LOGGING_ACTIVE = true;

const GRAPH_HEIGHT_TO_WIDTH_RATIO = 0.3;

//Graph margins
const margin = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10
};

var graphContainer;
var graph;
var graphGraphicsElement;
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

function createGraph() {
  var parentContainer = d3.select("#" + PARENT_CONTAINER_ID);
  graphContainer = parentContainer.append('div').attr('id', GRAPH_CONTAINER_ID);
  graph = graphContainer.append('svg').attr('id', GRAPH_ID);
  graphGraphicsElement = graph.append('g');

  axisGraphicsElements.x = graph.append('g').attr('class', 'x axis');
  axisGraphicsElements.y = graph.append('g').attr('class', 'y axis');
}

function updateGraphDimensions() {
  var graphContainerWidth = parseInt(graphContainer.style('width'));
  var graphContainerHeight = graphContainerWidth * GRAPH_HEIGHT_TO_WIDTH_RATIO;
  $("#" + GRAPH_CONTAINER_ID).css("height", graphContainerHeight);

  var width = graphContainerWidth - margin.left - margin.right;
  var height = graphContainerHeight - margin.top - margin.bottom;

  //Set scales
  graphScale.x = d3.scale.linear().range([0, width]);
  graphScale.y = d3.scale.linear().range([height - margin.top, 0]);

  //Set axis
  axis.x = d3.svg.axis().scale(graphScale.x).orient('bottom').ticks('none');
  axis.y = d3.svg.axis().scale(graphScale.y).orient('left').ticks('none');

  //Set graph sizes
  graph.attr('width', graphContainerWidth);
  graph.attr('height', graphContainerHeight);

  //Translate graph from
  graphGraphicsElement.attr('transform',
    'translate(' + margin.left + ', ' + margin.top + ')');

  axisGraphicsElements.x
    .attr("width", width)
    .attr("transform", "translate(" + margin.left + "," + height + ")")
    .call(axis.x);
  axisGraphicsElements.y
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(axis.y);
}

function createUI() {
  if (parentContainerExsists()) {
    createGraph();
    updateGraphDimensions();
  } else {
    info('No element found with id "' + PARENT_CONTAINER_ID + '"');
    info('Please create a div with that id where you wish for the visualiser to be created.');
  }
}

/* Render */
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

$(function() {
  createUI();
})

window.onresize = function() {
  updateGraphDimensions();
}
