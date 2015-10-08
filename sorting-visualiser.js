'use strict'

//Labels
var LABEL_CONTROLS_HEADING = 'Controls';
var LABEL_CONTROLS_STOP = 'Stop';
var LABEL_CONTROLS_NEW_ARRAY = 'New Array';
var LABEL_SETTINGS_HEADING = 'Settings';
var LABEL_SETTINGS_ARRAY_SIZE = 'Array Size';
var LABEL_SETTINGS_TIME_STEP = 'Time Step';
var LABEL_SETTINGS_ARRAY_TYPE = 'Array Type';
var LABEL_SETTINGS_SOUND = 'Sound';
var LABEL_SETTINGS_ARRAY_TYPE_BEST = 'Best';
var LABEL_SETTINGS_ARRAY_TYPE_AVERAGE = 'Average';
var LABEL_SETTINGS_ARRAY_TYPE_WORST = 'Worst';
var LABEL_SETTINGS_SOUND_ON = 'On';
var LABEL_SETTINGS_SOUND_OFF = 'Off';
var LABEL_ALGORITHMS_HEADING = 'Algorithms';
var LABEL_STATS_HEADING = 'Stats';
var LABEL_STATS_COMPARISONS = 'Comparisons: ';
var LABEL_STATS_SWAPS = 'Swaps: ';
var LABEL_LEGEND_HEADING = 'Legend';
var LABEL_LEGEND_CURRENT = 'Current';
var LABEL_LEGEND_COMPARISON = 'Comparison';
var LABEL_LEGEND_BOUND = 'Bound';
var LABEL_DESCRIPTION_HEADING = 'Desciption';
var LABEL_ALGORITHM_HEADING = 'Algorithm';
var LABEL_PROPERTIES_HEADING = 'Properties';
var LABEL_PROPERTIES_NAME = 'Name';
var LABEL_PROPERTIES_BEST_CASE = 'Best case';
var LABEL_PROPERTIES_AVERAGE_CASE = 'Average case';
var LABEL_PROPERTIES_WORST_CASE = 'Worst case';
var LABEL_PROPERTIES_MEMORY_USAGE = 'Memory usage';
var LABEL_PROPERTIES_STABLE = 'Stable';
var LABEL_PROPERTIES_TECHNIQUE = 'Technique';

//Class names
var CLASS_CONTAINER = 'sv-container';
var CLASS_COLUMN = 'sv-column';
var CLASS_LIST = 'sv-list';
var CLASS_LEGEND_ITEM = 'sv-legend-item';
var CLASS_STAT = 'sv-stat';
var CLASS_BAR_NORMAL = 'sv-bar-normal';
var CLASS_BAR_ACTIVE = 'sv-bar-active'; //Current bar indexed
var CLASS_BAR_COMPARISON = 'sv-bar-comparison';
var CLASS_BAR_BOUND = 'sv-bar-bound';
var CLASS_STOP_BUTTON = 'sv-control sv-button sv-control-button';
var CLASS_BUTTON = 'sv-button'
var CLASS_BUTTON_SELECTED = 'sv-selected';
var CLASS_CONTROL_CONTAINER = 'sv-control';
var CLASS_CONTROL_LABEL = 'sv-control-label';

//Container ID's
var ID_MAIN_CONTAINER = 'sorting-visualiser-container';
var ID_GRAPH_CONTAINER = 'sv-graph-container';
var ID_LEFT_CONTAINER = 'sv-left-container';
var ID_RIGHT_CONTAINER = 'sv-right-container';
var COLUMN_PREFIX = 'sv-column-';
var ID_COLUMN_0 = COLUMN_PREFIX + '0';
var ID_COLUMN_1 = COLUMN_PREFIX + '1';
var ID_COLUMN_2 = COLUMN_PREFIX + '2';
var ID_COLUMN_3 = COLUMN_PREFIX + '3';

//Graph Element ID's
var ID_GRAPH = 'sv-graph';
var ID_GRAPH_GRAPHICS = 'sv-graph-graphics-element';

//Controls Element ID's
var ID_STOP_BUTTON = 'sv-stop-button';
var ID_ALGORITHMS_CONTROLS_CONTAINER = 'sv-controls';
var ID_ALGORITHMS_SETTINGS_CONTAINER = 'sv-settings';
var ID_ALGORITHMS_CONTAINER = 'sv-algorithms';

//Information Element ID's
var ID_STATS = 'sv-stats';
var ID_LEGEND = 'sv-legend';
var ID_STATS_COMPARISONS = 'sv-comparisons-stat';
var ID_STATS_SWAPS = 'sv-swaps-stat';
var ID_ALGORITHM_INFORMATION_PROPERTIES = 'sv-algorithm-properties';
var ID_ALGORITHM_INFORMATION_ALGORITHM = 'sv-algorithm-information-algorithm-container';
var ID_ALGORITHM_INFORMATION_DESCRIPTION = 'sv-algorithm-information-description-container';
var ID_INFORMATION_NAME = 'sv-algorithm-name';
var ID_INFORMATION_BEST_CASE_COMPLEXITY = 'sv-algorithm-best-complexity';
var ID_INFORMATION_AVERAGE_CASE_COMPLEXITY = 'sv-algorithm-average-complexity';
var ID_INFORMATION_WORST_CASE_COMPLEXITY = 'sv-algorithm-worst-complexity';
var ID_INFORMATION_MEMORY = 'sv-algorithm-memory';
var ID_INFORMATION_STABLE = 'sv-algorithm-stable';
var ID_INFORMATION_TECHNIQUE = 'sv-algorithm-technique';
var ID_INFORMATION_ALGORITHM = 'sv-algorithm-algorithm';
var ID_INFORMATION_DESCRIPTION = 'sv-algorithm-description';

//Settings
var CONTROL_ARRAY_SIZE_STEP = 5;
var CONTROL_LOOP_TIME_MIN = 0;
var CONTROL_LOOP_TIME_STEP = 0.01;

//Logging should be turned on if verbose output is wanted
var LOGGING_ACTIVE = true;

var ARRAY_MIN_SIZE = 5;
var MAX_VALUE = 100;
var GRAPH_HEIGHT_TO_WIDTH_RATIO = 0.3;

//Graph margins
var margin = {
  top: 0,
  right: 14,
  bottom: 10,
  left: 6
};

//Buttons
var sortingAlgorithmButtons = [{
  name: 'Bubble',
  callBack: bubbleSort,
  bestCase: 'O(n)',
  averageCase: 'O(n^2)',
  worstCase: 'O(n^2)',
  memory: 'O(1)',
  stable: true,
  technique: 'Exchanging',
  algorithm: 'swapped = true\n'
    + 'while (swapped) {\n'
    + '\tswapped = false;\n'
    + '\tfor (int i = 0; i < n - 1; i++) {\n'
    + '\t\tif (array[i] > array[i + 1]) {\n'
    + '\t\t\ttemp = array[i];\n'
    + '\t\t\tarray[i] = array[i + 1];\n'
    + '\t\t\tarray[i + 1] = temp;\n'
    + '\t\t\tswapped = true;\n'
    + '\t\t}\n'
    + '\t}\n'
    + '}\n',
  description: 'This algorithm works by looping over every time and checking if two '
    + 'neighboring elements need to swap, if they do they are swapped. If a swap has '
    + 'been made then the algorithm will iterate over all elements again until '
    + 'no swaps occour'
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
var sortingStepDelay = 50;
var sortingCurrentIndex;
var sortingComparisonIndex;
var sortingLeftBound;
var sortingRightBound;
var sortingStats = {
  numberOfComparisons: 0,
  numberOfSwaps: 0
}
var sortingAlgorithmCurrentlyRunning = false;
var sortingAlgorithmLoop;
var arrayGenerationAlgorithm = generateRandomData;
var audioContext;
var audioOscillator;
var soundOn = false;
var AudioContext;

/* ------------------------------------------------------------------------- */
/* Utility Methods
/* ------------------------------------------------------------------------- */

/**
 * Prints given string to console.log if LOGGING_ACTIVE is true
 */
function info(stringToLog) {
  if (stringToLog == undefined || stringToLog == null) {
    return;
  }
  if (LOGGING_ACTIVE) {
    console.log(stringToLog);
  }
}

/**
 * Sets information for algorithm and start algorithm
 * @param {Object} algorithm object
 */
function startSortingAlgorithm(algorithm) {
  if (algorithm == undefined || algorithm == null) {
    return;
  }
  sortingAlgorithmCurrentlyRunning = true;
  sortingStats.numberOfComparisons = 0;
  sortingStats.numberOfSwaps = 0;
  updateAlgorithmInformation(algorithm);
  algorithm.callBack();
  startSound();
}

/**
 * Stops the current sorting algorithm
 */
function stopSortingAlgorithm() {
  info('Sorting algorithm stopped');
  sortingAlgorithmCurrentlyRunning = false;

  //Loops as it sometimes fails
  for (var i = 0; i < 10; i++) {
    setTimeout(function() {
      clearTimeout(sortingAlgorithmLoop);
    }, 0);
    setTimeout(function() {
      clearInterval(sortingAlgorithmLoop);
    }, 0);
  }

  //Removes selected class from all buttons
  d3.selectAll('.' + CLASS_BUTTON).classed(CLASS_BUTTON_SELECTED, false);

  //Resets the sorting algorithm index markers to -1
  sortingCurrentIndex = -1;
  sortingComparisonIndex = -1;
  sortingLeftBound = -1;
  sortingRightBound = -1;
  updateScreen();

  setTimeout(stopSound, sortingStepDelay * 2);
}

function audioSupported() {
  return AudioContext;
}

/* ------------------------------------------------------------------------- */
/* Main containers
/* ------------------------------------------------------------------------- */

/**
 * Returns whether or not the parent container exsists
 * @return {boolean} Whether the parent container exsists
 */
function mainContainerExsists() {
  return $('#' + ID_MAIN_CONTAINER).length > 0;
}

function createLeftContainer(parentContainer) {
  parentContainer.append('div')
  .attr('id', ID_LEFT_CONTAINER)
  .attr('class', CLASS_CONTAINER);
}

function createRightContainer(parentContainer) {
  parentContainer.append('div')
  .attr('id', ID_RIGHT_CONTAINER)
  .attr('class', CLASS_CONTAINER);
}


/**
 * Creates the graph container
 */
function createGraphContainer(parentContainer) {
  parentContainer.append('div').attr('id', ID_GRAPH_CONTAINER).attr('class', CLASS_CONTAINER);
}

function createColumn(parentContainer, columnNumber) {
  info('Creating container ' + COLUMN_PREFIX + columnNumber.toString());
  parentContainer.append('div')
    .attr('id', COLUMN_PREFIX + columnNumber.toString())
    .attr('class', CLASS_CONTAINER + ' ' + CLASS_COLUMN);
}

function createColumns(parentContainer, numberOfColumns) {
  for (var i = 0; i < numberOfColumns; i++) {
    createColumn(parentContainer, i);
  }
}

/**
 * Creates all containers used in Sorter-Visualiser
 */
function createContainers() {
  createLeftContainer(getMainContainer());
  createRightContainer(getMainContainer());
  createGraphContainer(getLeftContainer());
  createColumns(getLeftContainer(), 4);
}

/**
 * Returns the main container for the whole program
 * @return {d3.element} Main container
 */
function getMainContainer() {
  return d3.select('#' + ID_MAIN_CONTAINER);
}

/**
 * Returns the graph container for the whole program
 * @return {d3.element} Graph container
 */
function getGraphContainer() {
  return d3.select('#' + ID_GRAPH_CONTAINER);
}


function getColumn(id) {
  return d3.select('#' + COLUMN_PREFIX + id.toString());
}

function getLeftContainer() {
  return d3.select('#' + ID_LEFT_CONTAINER);
}

function getRighttContainer() {
  return d3.select('#' + ID_RIGHT_CONTAINER);
}

/* ------------------------------------------------------------------------- */
/* Graph
/* ------------------------------------------------------------------------- */

/**
 * Creates graph and associated DOM elements
 */
function createGraph(parentContainer) {
  var graph = parentContainer.append('svg').attr('id', ID_GRAPH);
  graph.append('g').attr('id', ID_GRAPH_GRAPHICS);

  axisGraphicsElements.x = graph.append('g').attr('class', 'x sv-axis');
  axisGraphicsElements.y = graph.append('g').attr('class', 'y sv-axis');
}

/**
 * Updates the dimensions of the graph and updates graphics
 */
function updateGraphDimensions() {
  //Get graphics objects
  var graphContainer = getGraphContainer();
  var graph = d3.select('#' + ID_GRAPH);

  var graphContainerWidth = parseInt(graphContainer.style('width'));
  var graphContainerHeight = graphContainerWidth * GRAPH_HEIGHT_TO_WIDTH_RATIO;
  $("#" + ID_GRAPH_CONTAINER).css("height", graphContainerHeight);

  var width = graphDimensions.width = graphContainerWidth - margin.left - margin.right;
  var height = graphDimensions.height = graphContainerHeight - margin.top - margin.bottom;

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
  //Select graph 'g'
  d3.select('#' + ID_GRAPH_GRAPHICS).attr('transform',
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

/* ------------------------------------------------------------------------- */
/* Setttings
/* ------------------------------------------------------------------------- */

function updateArraySize() {
  if (!sortingAlgorithmCurrentlyRunning) {
    info('Array size updated to ' + this.value);
    numberOfElementsToSort = this.value;
    generateData();
    updateScreen();
  } else {
    this.value = numberOfElementsToSort;
  }
}

function updateTimeStep() {
  info('Sorting time set set to' + this.value * 1000);
  sortingStepDelay = Math.max(this.value * 1000, CONTROL_LOOP_TIME_MIN);
}

function updateArrayType() {
  info('Array type selected: ' + this.value);
  if (this.value == LABEL_SETTINGS_ARRAY_TYPE_BEST) {
    arrayGenerationAlgorithm = generateBestCase;
  } else if (this.value == LABEL_SETTINGS_ARRAY_TYPE_WORST) {
    arrayGenerationAlgorithm = generateWorstCase;
  } else {
    arrayGenerationAlgorithm = generateRandomData;
  }
  generateData();
}

function updateSoundState() {
  if (this.value == LABEL_SETTINGS_SOUND_OFF) {
    turnSoundOff();
  } else {
    turnSoundOn();
  }
}

function createSettings(parentContainer) {
  var controlsContainer = parentContainer.append('div').attr('id', ID_ALGORITHMS_SETTINGS_CONTAINER).attr('class', CLASS_LIST);

  controlsContainer.append('h2').text(LABEL_SETTINGS_HEADING);
  var list = controlsContainer.append('ul');

  var arraySizeControlContainer = list.append('li').attr('class', CLASS_CONTROL_CONTAINER);
  arraySizeControlContainer.append('div').attr('class', CLASS_CONTROL_LABEL)
    .append('p').text(LABEL_SETTINGS_ARRAY_SIZE);

  //Array size control
  arraySizeControlContainer.append('input')
    .attr('type', 'number')
    .attr('min', ARRAY_MIN_SIZE)
    .attr('step', CONTROL_ARRAY_SIZE_STEP)
    .attr('value', numberOfElementsToSort)
    .on('input', updateArraySize);

  var timeStepControlContainer = list.append('li').attr('class', CLASS_CONTROL_CONTAINER);
  timeStepControlContainer.append('div').attr('class', CLASS_CONTROL_LABEL)
    .append('p').text(LABEL_SETTINGS_TIME_STEP);

  //Time step control
  timeStepControlContainer.append('input')
    .attr('type', 'number')
    .attr('min', CONTROL_LOOP_TIME_MIN)
    .attr('step', CONTROL_LOOP_TIME_STEP)
    .attr('value', sortingStepDelay / 1000)
    .on('input', updateTimeStep);

  var arrayTypeControlContainer = list.append('li').attr('class', CLASS_CONTROL_CONTAINER);
  arrayTypeControlContainer.append('div').attr('class', CLASS_CONTROL_LABEL)
    .append('p').text(LABEL_SETTINGS_ARRAY_TYPE);

  var select = arrayTypeControlContainer.append('select');
  select.append('option').attr('value', LABEL_SETTINGS_ARRAY_TYPE_BEST).text(LABEL_SETTINGS_ARRAY_TYPE_BEST);
  select.append('option').attr('value', LABEL_SETTINGS_ARRAY_TYPE_AVERAGE).attr('selected', 'selected')
    .text(LABEL_SETTINGS_ARRAY_TYPE_AVERAGE);
  select.append('option')
    .attr('value', LABEL_SETTINGS_ARRAY_TYPE_WORST)
    .text(LABEL_SETTINGS_ARRAY_TYPE_WORST);

  select.on('change', updateArrayType);

  var soundControlContainer = list.append('li').attr('class', CLASS_CONTROL_CONTAINER);
  soundControlContainer.append('div').attr('class', CLASS_CONTROL_LABEL)
    .append('p').text(LABEL_SETTINGS_SOUND);
  var select = soundControlContainer.append('select');
  select.append('option').attr('value', LABEL_SETTINGS_SOUND_ON).text(LABEL_SETTINGS_SOUND_ON);
  select.append('option').attr('value', LABEL_SETTINGS_SOUND_OFF)
    .attr('selected', 'selected').text(LABEL_SETTINGS_SOUND_OFF);

  select.on('change', updateSoundState);
}

/* ------------------------------------------------------------------------- */
/* Algorithms
/* ------------------------------------------------------------------------- */

function createButton(parent, text, callBack) {
  var button = parent.append('li').attr('class', CLASS_BUTTON);
  button.text(text);
  button.on('click', function() {
    callBack()
  });
}

function createAlgorithmButton(parent, buttonData) {
  var button = parent.append('li').attr('class', CLASS_BUTTON);
  button.text(buttonData.name);
  button.on('click', function() {
    if (!sortingAlgorithmCurrentlyRunning) {
      button.classed(CLASS_BUTTON_SELECTED, true);
      startSortingAlgorithm(buttonData);
    }
  });
}

function createAlgorithmButtons(container) {
  var container = container.append('div').attr('id', ID_ALGORITHMS_CONTAINER).attr('class', CLASS_LIST);
  container.append('h2').text(LABEL_ALGORITHMS_HEADING);
  for (var i = 0; i < sortingAlgorithmButtons.length; i++) {
    createAlgorithmButton(container, sortingAlgorithmButtons[i]);
  }
}

/* ------------------------------------------------------------------------- */
/* Controls
/* ------------------------------------------------------------------------- */

function createControls(parentContainer) {
  var container = parentContainer.append('div').attr('id', ID_ALGORITHMS_CONTROLS_CONTAINER).attr('class', CLASS_LIST);
  container.append('h2').text(LABEL_CONTROLS_HEADING);
  createButton(container, LABEL_CONTROLS_STOP, stopSortingAlgorithm);
  createButton(container, LABEL_CONTROLS_NEW_ARRAY, generateData);
}

/* ------------------------------------------------------------------------- */
/* Legend
/* ------------------------------------------------------------------------- */

function createLegend(container) {
  var legendContainer = container
    .append('div').attr('id', ID_LEGEND).attr('class', CLASS_LIST);
  legendContainer.append('h2').text(LABEL_LEGEND_HEADING);

  var list = legendContainer.append('ul');

  var item = list.append('li');
  item.append('div').attr('class', CLASS_LEGEND_ITEM + ' ' + CLASS_BAR_ACTIVE);
  item.append('p').text('= ' + LABEL_LEGEND_CURRENT);

  item = list.append('li');
  item.append('div').attr('class', CLASS_LEGEND_ITEM + ' ' + CLASS_BAR_COMPARISON);
  item.append('p').text('= ' + LABEL_LEGEND_COMPARISON);

  item = list.append('li');
  item.append('div').attr('class', CLASS_LEGEND_ITEM + ' ' + CLASS_BAR_BOUND);
  item.append('p').text('= ' + LABEL_LEGEND_BOUND);
}

/* ------------------------------------------------------------------------- */
/* Stats
/* ------------------------------------------------------------------------- */

function createStats(container) {
  var statsContainer = container.append('div').attr('id', ID_STATS).attr('class', CLASS_LIST);
  statsContainer.append('h2').text(LABEL_STATS_HEADING);
  var list = statsContainer.append('ul');
  list.append('li').attr('id', ID_STATS_COMPARISONS).attr('class', CLASS_STAT);
  list.append('li').attr('id', ID_STATS_SWAPS).attr('class', CLASS_STAT);
}

function updateStats() {
  d3.select('#' + ID_STATS_COMPARISONS).text("Comparisons: " + sortingStats.numberOfComparisons);
  d3.select('#' + ID_STATS_SWAPS).text("Swaps: " + sortingStats.numberOfSwaps);
}

/* ------------------------------------------------------------------------- */
/* Properties
/* ------------------------------------------------------------------------- */

function createProperties(container) {
  var propertiesContainer = container.append('div').attr('id', ID_ALGORITHM_INFORMATION_PROPERTIES).attr('class', CLASS_LIST);
  propertiesContainer.append('h2').text(LABEL_PROPERTIES_HEADING);
  var list = propertiesContainer.append('ul');
  list.append('li').attr('id', ID_INFORMATION_NAME).text(LABEL_PROPERTIES_NAME + ': ');
  list.append('li').attr('id', ID_INFORMATION_BEST_CASE_COMPLEXITY).text(LABEL_PROPERTIES_BEST_CASE + ': ');
  list.append('li').attr('id', ID_INFORMATION_AVERAGE_CASE_COMPLEXITY).text(LABEL_PROPERTIES_AVERAGE_CASE + ': ');
  list.append('li').attr('id', ID_INFORMATION_WORST_CASE_COMPLEXITY).text(LABEL_PROPERTIES_WORST_CASE + ': ');
  list.append('li').attr('id', ID_INFORMATION_MEMORY).text(LABEL_PROPERTIES_MEMORY_USAGE + ': ');
  list.append('li').attr('id', ID_INFORMATION_STABLE).text(LABEL_PROPERTIES_STABLE + ': ');
  list.append('li').attr('id', ID_INFORMATION_TECHNIQUE).text(LABEL_PROPERTIES_TECHNIQUE + ': ');
}

function updateAlgorithmInformation(algorithm) {
  if (algorithm != undefined) {
    if (algorithm.name != undefined) {
      d3.select('#' + ID_INFORMATION_NAME).text(LABEL_PROPERTIES_NAME + ': ' + algorithm.name);
    }
    if (algorithm.bestCase != undefined) {
      d3.select('#' + ID_INFORMATION_BEST_CASE_COMPLEXITY).text(LABEL_PROPERTIES_BEST_CASE + ': ' + algorithm.bestCase);
    }
    if (algorithm.averageCase != undefined) {
      d3.select('#' + ID_INFORMATION_AVERAGE_CASE_COMPLEXITY).text(LABEL_PROPERTIES_AVERAGE_CASE + ': ' + algorithm.averageCase);
    }
    if (algorithm.worstCase != undefined) {
      d3.select('#' + ID_INFORMATION_WORST_CASE_COMPLEXITY).text(LABEL_PROPERTIES_WORST_CASE + ': ' + algorithm.worstCase);
    }
    if (algorithm.memory != undefined) {
      d3.select('#' + ID_INFORMATION_MEMORY).text(LABEL_PROPERTIES_MEMORY_USAGE + ': ' + algorithm.memory);
    }
    if (algorithm.stable != undefined) {
      d3.select('#' + ID_INFORMATION_STABLE).text(LABEL_PROPERTIES_STABLE + ': ' + String(algorithm.stable).toUpperCase());
    }
    if (algorithm.technique != undefined) {
      d3.select('#' + ID_INFORMATION_TECHNIQUE).text(LABEL_PROPERTIES_TECHNIQUE + ': ' + algorithm.technique);
    }
    if (algorithm.algorithm != undefined) {
      d3.select('#' + ID_INFORMATION_ALGORITHM).text(algorithm.algorithm);
    }
    if (algorithm.technique != undefined) {
      d3.select('#' + ID_INFORMATION_DESCRIPTION).text(algorithm.description);
    }
  }
}

/* ------------------------------------------------------------------------- */
/* Algorithm
/* ------------------------------------------------------------------------- */

function createAlgorithmInformation(container) {
  var algorithmContainer = container.append('div').attr('id', ID_ALGORITHM_INFORMATION_ALGORITHM).attr('class', CLASS_LIST);
  algorithmContainer.append('h2').text(LABEL_ALGORITHM_HEADING);
  algorithmContainer.append('pre').attr('id', ID_INFORMATION_ALGORITHM);
}

/* ------------------------------------------------------------------------- */
/* Description
/* ------------------------------------------------------------------------- */

function createAlgorithmDescription(container) {
  var descriptionContainer = container.append('div').attr('id', ID_ALGORITHM_INFORMATION_DESCRIPTION).attr('class', CLASS_LIST);
  descriptionContainer.append('h2').text(LABEL_DESCRIPTION_HEADING);
  descriptionContainer.append('p').attr('id', ID_INFORMATION_DESCRIPTION);
}

function createInformation() {
  var container = getInformationRightContainer();
  createStats(container);
  createLegend(container);
  createAlgorithmDescription(container);
  var container = getInformationLeftContainer();
  createAlgorithmProperties(container);
  createAlgorithmInformation(container);
}

/* ------------------------------------------------------------------------- */
/* UI Creation
/* ------------------------------------------------------------------------- */

function createRightContainerElements(parentContainer) {
      createStats(getColumn(0));
      createProperties(getColumn(0));

      createAlgorithmInformation(getColumn(1));
      createAlgorithmDescription(getColumn(1));

      createSettings(getColumn(2));
}

function createLeftContainerElements(parentContainer) {
    createLegend(parentContainer);
    createControls(parentContainer);
    createAlgorithmButtons(parentContainer);
}

/**
 * Creates the UI
 */
function createUI() {
  if (mainContainerExsists()) {
    createContainers();
    createGraph(getGraphContainer());
    updateGraphDimensions();
    createRightContainerElements(getLeftContainer());
    createLeftContainerElements(getRighttContainer());
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
    return CLASS_BAR_ACTIVE;
  }
  if (d.x == sortingComparisonIndex) {
    return CLASS_BAR_COMPARISON;
  }
  if (d.x == sortingLeftBound || d.x == sortingRightBound) {
    return CLASS_BAR_BOUND;
  }
  return CLASS_BAR_NORMAL;
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

function getWidthOfBar(numberOfElements) {
  return graphDimensions.width / numberOfElementsToSort - 1;
}

function getHeightOfBar(d) {
  return graphDimensions.height - margin.top - graphScale.y(d.y);
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

  var graph = d3.select('#' + ID_GRAPH);

  //Reset all bars (not used to not interact with legend)
  d3.selectAll('.' + CLASS_BAR_ACTIVE + ':not(.' + CLASS_LEGEND_ITEM + ')').attr('class', CLASS_BAR_NORMAL);
  d3.selectAll('.' + CLASS_BAR_COMPARISON + ':not(.' + CLASS_LEGEND_ITEM + ')').attr('class', CLASS_BAR_NORMAL);
  d3.selectAll('.' + CLASS_BAR_BOUND + ':not(.' + CLASS_LEGEND_ITEM + ')').attr('class', CLASS_BAR_NORMAL);

  var bars = graph.selectAll('.' + CLASS_BAR_NORMAL)
    .data(dataToRender);

  bars.enter().append("rect")
    .attr("class", function(d) {
      return getClassForBar(d)
    })
    .attr("x", function(d) {
      return graphScale.x(d.x);
    })
    .attr("width", getWidthOfBar())
    .attr("y", function(d) {
      return graphScale.y(d.y);
    })
    .attr("height", function(d) {
      return getHeightOfBar(d);
    })
    .attr("transform", "translate(" + margin.left + ", " + margin.top + "0)");

  bars.attr("class", function(d) {
      return getClassForBar(d)
    })
    .attr("x", function(d) {
      return graphScale.x(d.x);
    })
    .attr("width", getWidthOfBar())
    .attr("y", function(d) {
      return graphScale.y(d.y);
    })
    .attr("height", function(d) {
      return getHeightOfBar(d);
    })
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

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
/* Audio
/* ------------------------------------------------------------------------- */

function initAudio() {
  AudioContext = window.AudioContext || window.webkitAudioContext || false;
  if (audioSupported()) {
    audioContext = new AudioContext();
  } else {
    info('Audio is not supported in this browser');
  }
}

function startSound() {
  if (!soundOn || !audioSupported()) {
    return;
  }
  info('Starting sound');
  if (audioContext != undefined) {
    audioOscillator = audioContext.createOscillator();
    audioOscillator.connect(audioContext.destination);
    audioOscillator.start(0);
  }
}

function stopSound() {
  if (!soundOn || !audioSupported()) {
    return;
  }
  if (audioOscillator != undefined) {
    audioOscillator.stop(0);
  }
}

function playFrequency(fequency) {
  if (!soundOn || !audioSupported()) {
    return;
  }
  if (audioOscillator != undefined) {
    audioOscillator.frequency.value = fequency;
  }
}

function playSoundForValue(value) {
  playFrequency(110 + Math.pow(1000, value / MAX_VALUE));
}

function turnSoundOn() {
  info('Turning sound on');
  soundOn = true;
  startSound();
  playFrequency(0);
}

function turnSoundOff() {
  info('Turning sound off');
  playFrequency(0);
  soundOn = false;
  stopSound();
}

/* ------------------------------------------------------------------------- */
/* Screen Arrangement
/* ------------------------------------------------------------------------- */

function getWidthInEm(element) {
  return element.width() / parseFloat($('body').css('font-size'));
}

function getWidthOfContainerInEm() {
  return getWidthInEm($('#' + ID_MAIN_CONTAINER));
}

function setPercentageWidthOfElement(id, width) {
//  info('Setting ' + id + ' to width: ' + width.toString() + '%');
  $(id).outerWidth(width + "%");
}

function setMainContainersPercentageWidths(leftContainerWidth, rightContainerWidth) {
  setPercentageWidthOfElement('#' + ID_LEFT_CONTAINER, leftContainerWidth);
  setPercentageWidthOfElement('#' + ID_RIGHT_CONTAINER, rightContainerWidth);
}

/*
 * This updates the layout for the panels as css will not allow resizing based
 * on size of a div.
 */
function updateLayout() {
  var width = getWidthOfContainerInEm();
  info('Container width: ' + width + 'em');

  //Main two containers
  if (width >= 60) {
    setMainContainersPercentageWidths(80, 19.5);
  }
  if (width < 60) {
    setMainContainersPercentageWidths(75, 24.5);
  }
  if (width < 50) {
    setMainContainersPercentageWidths(70, 29.5);
  }
  if (width < 40) {
    setMainContainersPercentageWidths(100, 99.5);
  }

  if (width < 55) {
    setPercentageWidthOfElement('.' + CLASS_COLUMN, 49);
  }
  else {
    setPercentageWidthOfElement('.' + CLASS_COLUMN, 32.3333);
  }

  if (width < 28) {
    setPercentageWidthOfElement('.' + CLASS_COLUMN, 99);
  }

  // //Main container positioning
  // if (width < 50) {
  //   setMainContainersPercentageWidths(98, 100);
  // } else if (width < 60) {
  //   setMainContainersPercentageWidths(68, 30);
  // } else if (width < 75) {
  //   setMainContainersPercentageWidths(73, 25);
  // } else {
  //   setMainContainersPercentageWidths(78, 20);
  // }
  //
  // //Adjust stat width to prevent overflow
  // if (width < 70) {
  //   setPercentageWidthOfElement('.' + CLASS_STAT, 100);
  // } else {
  //   setPercentageWidthOfElement('.' + CLASS_STAT, 50);
  // }
  //
  // //When screen compresses to single column adjusts the controls and settings tab
  // if (width < 50 && width > 30) {
  //   setPercentageWidthOfElement('#' + ID_ALGORITHMS_CONTROLS_CONTAINER, 48);
  //   setPercentageWidthOfElement('#' + ID_ALGORITHMS_SETTINGS_CONTAINER, 48);
  // } else {
  //   setPercentageWidthOfElement('#' + ID_ALGORITHMS_CONTROLS_CONTAINER, 98);
  //   setPercentageWidthOfElement('#' + ID_ALGORITHMS_SETTINGS_CONTAINER, 98);
  // }
  //
  // //When screen compresses to single column adjusts the stats and legend tab
  // if (width < 30) {
  //   setPercentageWidthOfElement('#' + ID_INFORMATION_LEFT_CONTAINER, 99.5);
  //   setPercentageWidthOfElement('#' + ID_INFORMATION_RIGHT_CONTAINER, 99.5);
  // } else {
  //   setPercentageWidthOfElement('#' + ID_INFORMATION_LEFT_CONTAINER, 49.5);
  //   setPercentageWidthOfElement('#' + ID_INFORMATION_RIGHT_CONTAINER, 49.5);
  // }
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
  var delta = (MAX_VALUE - 1) / numberOfElementsToSort;
  for (var i = 0; i < numberOfElementsToSort; i++) {
    arrayToSort.push(i * delta + 1);
  }
}

/**
 * Generates a random case array to sort.
 * Best case defined as random order
 */
function generateRandomData() {
  arrayToSort = [];
  for (var i = 0; i < numberOfElementsToSort; i++) {
    arrayToSort.push(Math.random() * (MAX_VALUE - 1)) + 1;
  }
}

/**
 * Generates a worst case array to sort.
 * Best case defined as descending order
 */
function generateWorstCase() {
  arrayToSort = [];
  for (var i = 0; i < numberOfElementsToSort; i++) {
    var delta = (MAX_VALUE) / numberOfElementsToSort;
    arrayToSort.push(MAX_VALUE - i * delta);
  }
}

function generateData() {
  if (!sortingAlgorithmCurrentlyRunning) {
    arrayGenerationAlgorithm();
    updateScreen();
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
    sortingAlgorithmLoop = setInterval(function() {
      sortingCurrentIndex = i;
      sortingComparisonIndex = i + 1;
      playSoundForValue(arrayToSort[i + 1]);
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
        if (sorted || !sortingAlgorithmCurrentlyRunning) {
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
function resizeScreen() {
  updateLayout();
  updateGraphDimensions();
  updateScreen();
}

window.onload = function() {
  info('Load');
  createUI();
  initAudio();
  generateRandomData();
  onresize();
}

window.onresize = resizeScreen;
