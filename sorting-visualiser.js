window.sortingVisualiser = window.sortingVisualiser || {};

window.sortingVisualiser.util = (function() {
  "use strict";
  var
  //Logging should be turned on if verbose output is wanted
    LOGGING_ACTIVE = true,

    log = function(stringToLog) {
      if (stringToLog == undefined || stringToLog == null) {
        return;
      }
      if (LOGGING_ACTIVE) {
        console.log(stringToLog);
      }
    };

  return {
    "log": log
  }
}());

window.sortingVisualiser.algorithm = (function() {
  "use strict";

  var

    ARRAY_MIN_SIZE = 5,
    MAX_VALUE = 100,

    //Sorting variables
    numberOfElementsToSort = 20,
    arrayToSort = [],
    sortingStepDelay = 50,
    sortingCurrentIndex = -1,
    sortingComparisonIndex = -1,
    sortingLeftBound = -1,
    sortingRightBound = -1,
    sortingStats = {
      numberOfComparisons: 0,
      numberOfSwaps: 0
    },
    sortingAlgorithmCurrentlyRunning = false,
    sortingAlgorithmLoop,
    arrayGenerationAlgorithm = generateRandomData,

    /* ------------------------------------------------------------------------- */
    /* Generation of data
    /* ------------------------------------------------------------------------- */

    /**
     * Generates a best case array to sort.
     * Best case defined as ascending order
     */
    generateBestCase = function() {
      arrayToSort = [];
      var delta = (MAX_VALUE - 1) / numberOfElementsToSort;
      for (var i = 0; i < numberOfElementsToSort; i++) {
        arrayToSort.push(i * delta + 1);
      }
    },

    /**
     * Generates a random case array to sort.
     * Best case defined as random order
     */
    generateRandomData = function() {
      arrayToSort = [];
      for (var i = 0; i < numberOfElementsToSort; i++) {
        arrayToSort.push(Math.random() * (MAX_VALUE - 1)) + 1;
      }
    },

    /**
     * Generates a worst case array to sort.
     * Best case defined as descending order
     */
    generateWorstCase = function() {
      arrayToSort = [];
      for (var i = 0; i < numberOfElementsToSort; i++) {
        var delta = (MAX_VALUE) / numberOfElementsToSort;
        arrayToSort.push(MAX_VALUE - i * delta);
      }
    },

    generateData = function() {
      if (!sortingAlgorithmCurrentlyRunning) {
        arrayGenerationAlgorithm();
        render();
      }
    },

    setNumberOfElements = function(n) {
      numberOfElementsToSort = n;
    },

    setTimeStep = function(t) {
      sortingStepDelay = t;
    },

    /**
     * Sets information for algorithm and start algorithm
     * @param {Object} algorithm object
     */
    startSortingAlgorithm = function(algorithm) {
      if (algorithm == undefined || algorithm == null) {
        return;
      }
      sortingAlgorithmCurrentlyRunning = true;
      sortingStats.numberOfComparisons = 0;
      sortingStats.numberOfSwaps = 0;
      window.sortingVisualiser.ui.updateAlgorithmInformation(algorithm);
      algorithm.callBack();
      window.sortingVisualiser.audio.startSound();
    },

    /**
     * Stops the current sorting algorithm
     */
    stopSortingAlgorithm = function() {
      setTimeout(function() {
        window.sortingVisualiser.util.log('Sorting algorithm stopped');
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

        window.sortingVisualiser.ui.deselectAllButtons();

        setTimeout(function() {
          //Resets the sorting algorithm index markers to -1
          sortingCurrentIndex = -1;
          sortingComparisonIndex = -1;
          sortingLeftBound = -1;
          sortingRightBound = -1;
          render();
          window.sortingVisualiser.audio.stopSound();
        }, sortingStepDelay * 2);
      }, sortingStepDelay);
    },

    playSoundForValue = function(value) {
      window.sortingVisualiser.audio.playSoundForValue(value);
    },

    render = function() {
      window.sortingVisualiser.ui.update(getInfo());
    },

    getInfo = function() {
      return {
        array: arrayToSort,
        numberOfSwaps: sortingStats.numberOfSwaps,
        numberOfComparisons: sortingStats.numberOfComparisons,
        sortingCurrentIndex: sortingCurrentIndex,
        sortingComparisonIndex: sortingComparisonIndex,
        numberOfElements: numberOfElementsToSort,
        timeStep: sortingStepDelay,
        maxValue: MAX_VALUE
      };
    },

    getSortingAlgorithmCurrentlyRunning = function() {
      return sortingAlgorithmCurrentlyRunning;
    },

    setDataGenerationAlgorithm = function(algorithm) {
      arrayGenerationAlgorithm = algorithm;
    },

    /* ---- Bubble Sort ---- */
    bubbleSort = function() {
      var sorted = true;
      var i = 0;
      window.sortingVisualiser.util.log('Bubble sort started');
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
          render();
          if (!sortingAlgorithmCurrentlyRunning) {
            stopSortingAlgorithm();
          }
          if (i >= arrayToSort.length - 1) {
            i = 0;
            if (sorted) {
              window.sortingVisualiser.util.log('Bubble sort ended');
              stopSortingAlgorithm();
            }
            sorted = true;
          }
        }, sortingStepDelay);
      })(arrayToSort, sorted, i);
    },

    /* ---- Insertion Sort ---- */
    insertionSort = function() {
      (function(arrayToSort, i, rightBound) {
        sortingAlgorithmLoop = setInterval(function() {

          var left = arrayToSort[i - 1];
          var right = arrayToSort[i];

          sortingStats.numberOfComparisons++;
          if (i > 0 && left > right) {
            sortingStats.numberOfSwaps++;
            arrayToSort[i - 1] = right;
            arrayToSort[i] = left;
            i--;
          } else {
            rightBound++;
            i = rightBound;
          }

          render();
          if (!sortingAlgorithmCurrentlyRunning) {
            stopSortingAlgorithm();
          }
          if (rightBound >= arrayToSort.length) {
            stopSortingAlgorithm();
          }
        }, sortingStepDelay);
      })(arrayToSort, 0, 0);
    },

    setUp = function() {
      setDataGenerationAlgorithm(generateRandomData);
      generateData();
    };

  return {
    "start": startSortingAlgorithm,
    "stop": stopSortingAlgorithm,
    "setUp": setUp,
    "getInfo": getInfo,
    "getSortingAlgorithmCurrentlyRunning": getSortingAlgorithmCurrentlyRunning,
    "generateData": generateData,
    "setDataGenerationAlgorithm": setDataGenerationAlgorithm,
    "generateBestCase": generateBestCase,
    "generateRandomData": generateRandomData,
    "generateWorstCase": generateWorstCase,
    "setNumberOfElements": setNumberOfElements,
    "setTimeStep": setTimeStep,
    "bubbleSort": bubbleSort,
    "insertionSort": insertionSort
  };

}());

window.sortingVisualiser.ui = (function() {
  "use strict";

  var
    LABEL_CONTROLS_HEADING = 'Controls',
    LABEL_CONTROLS_STOP = 'Stop',
    LABEL_CONTROLS_NEW_ARRAY = 'New Array',
    LABEL_SETTINGS_HEADING = 'Settings',
    LABEL_SETTINGS_ARRAY_SIZE = 'Array Size',
    LABEL_SETTINGS_TIME_STEP = 'Time Step',
    LABEL_SETTINGS_ARRAY_TYPE = 'Array Type',
    LABEL_SETTINGS_SOUND = 'Sound',
    LABEL_SETTINGS_ARRAY_TYPE_BEST = 'Best',
    LABEL_SETTINGS_ARRAY_TYPE_AVERAGE = 'Average',
    LABEL_SETTINGS_ARRAY_TYPE_WORST = 'Worst',
    LABEL_SETTINGS_SOUND_ON = 'On',
    LABEL_SETTINGS_SOUND_OFF = 'Off',
    LABEL_ALGORITHMS_HEADING = 'Algorithms',
    LABEL_STATS_HEADING = 'Stats',
    LABEL_STATS_COMPARISONS = 'Comparisons: ',
    LABEL_STATS_SWAPS = 'Swaps: ',
    LABEL_LEGEND_HEADING = 'Legend',
    LABEL_LEGEND_CURRENT = 'Current',
    LABEL_LEGEND_COMPARISON = 'Comparison',
    LABEL_LEGEND_BOUND = 'Bound',
    LABEL_DESCRIPTION_HEADING = 'Desciption',
    LABEL_ALGORITHM_HEADING = 'Algorithm',
    LABEL_PROPERTIES_HEADING = 'Properties',
    LABEL_PROPERTIES_NAME = 'Name',
    LABEL_PROPERTIES_BEST_CASE = 'Best case',
    LABEL_PROPERTIES_AVERAGE_CASE = 'Average case',
    LABEL_PROPERTIES_WORST_CASE = 'Worst case',
    LABEL_PROPERTIES_MEMORY_USAGE = 'Memory usage',
    LABEL_PROPERTIES_STABLE = 'Stable',
    LABEL_PROPERTIES_TECHNIQUE = 'Technique',

    //Class names
    CLASS_CONTAINER = 'sv-container',
    CLASS_COLUMN = 'sv-column',
    CLASS_LIST = 'sv-list',
    CLASS_LEGEND_ITEM = 'sv-legend-item',
    CLASS_STAT = 'sv-stat',
    CLASS_BAR_NORMAL = 'sv-bar-normal',
    CLASS_BAR_ACTIVE = 'sv-bar-active', //Current bar indexed
    CLASS_BAR_COMPARISON = 'sv-bar-comparison',
    CLASS_BAR_BOUND = 'sv-bar-bound',
    CLASS_STOP_BUTTON = 'sv-control sv-button sv-control-button',
    CLASS_BUTTON = 'sv-button',
    CLASS_BUTTON_SELECTED = 'sv-selected',
    CLASS_CONTROL_CONTAINER = 'sv-control',
    CLASS_CONTROL_LABEL = 'sv-control-label',

    //Container ID's
    ID_MAIN_CONTAINER = 'sorting-visualiser-container',
    ID_GRAPH_CONTAINER = 'sv-graph-container',
    ID_LEFT_CONTAINER = 'sv-left-container',
    ID_RIGHT_CONTAINER = 'sv-right-container',
    COLUMN_PREFIX = 'sv-column-',
    ID_COLUMN_0 = COLUMN_PREFIX + '0',
    ID_COLUMN_1 = COLUMN_PREFIX + '1',
    ID_COLUMN_2 = COLUMN_PREFIX + '2',
    ID_COLUMN_3 = COLUMN_PREFIX + '3',

    //Graph Element ID's
    ID_GRAPH = 'sv-graph',
    ID_GRAPH_GRAPHICS = 'sv-graph-graphics-element',

    //Controls Element ID's
    ID_STOP_BUTTON = 'sv-stop-button',
    ID_ALGORITHMS_CONTROLS_CONTAINER = 'sv-controls',
    ID_ALGORITHMS_SETTINGS_CONTAINER = 'sv-settings',
    ID_ALGORITHMS_CONTAINER = 'sv-algorithms',

    //Information Element ID's
    ID_STATS = 'sv-stats',
    ID_LEGEND = 'sv-legend',
    ID_STATS_COMPARISONS = 'sv-comparisons-stat',
    ID_STATS_SWAPS = 'sv-swaps-stat',
    ID_ALGORITHM_INFORMATION_PROPERTIES = 'sv-algorithm-properties',
    ID_ALGORITHM_INFORMATION_ALGORITHM = 'sv-algorithm-information-algorithm-container',
    ID_ALGORITHM_INFORMATION_DESCRIPTION = 'sv-algorithm-information-description-container',
    ID_INFORMATION_NAME = 'sv-algorithm-name',
    ID_INFORMATION_BEST_CASE_COMPLEXITY = 'sv-algorithm-best-complexity',
    ID_INFORMATION_AVERAGE_CASE_COMPLEXITY = 'sv-algorithm-average-complexity',
    ID_INFORMATION_WORST_CASE_COMPLEXITY = 'sv-algorithm-worst-complexity',
    ID_INFORMATION_MEMORY = 'sv-algorithm-memory',
    ID_INFORMATION_STABLE = 'sv-algorithm-stable',
    ID_INFORMATION_TECHNIQUE = 'sv-algorithm-technique',
    ID_INFORMATION_ALGORITHM = 'sv-algorithm-algorithm',
    ID_INFORMATION_DESCRIPTION = 'sv-algorithm-description',

    //Settings
    CONTROL_ARRAY_SIZE_STEP = 5,
    CONTROL_LOOP_TIME_MIN = 0,
    CONTROL_LOOP_TIME_STEP = 0.01,
    GRAPH_HEIGHT_TO_WIDTH_RATIO = 0.3,

    //Graph margins
    margin = {
      top: 0,
      right: 14,
      bottom: 10,
      left: 6
    },

    //Buttons
    sortingAlgorithmButtons = [{
      name: 'Bubble',
      callBack: window.sortingVisualiser.algorithm.bubbleSort,
      bestCase: 'O(n)',
      averageCase: 'O(n^2)',
      worstCase: 'O(n^2)',
      memory: 'O(1)',
      stable: true,
      technique: 'Exchanging',
      algorithm: 'swapped = true\n' + 'while (swapped) {\n' + '\tswapped = false;\n' + '\tfor (int i = 0; i < n - 1; i++) {\n' + '\t\tif (array[i] > array[i + 1]) {\n' + '\t\t\ttemp = array[i];\n' + '\t\t\tarray[i] = array[i + 1];\n' + '\t\t\tarray[i + 1] = temp;\n' + '\t\t\tswapped = true;\n' + '\t\t}\n' + '\t}\n' + '}\n',
      description: 'This algorithm works by looping over every time and checking if two ' + 'neighboring elements need to swap, if they do they are swapped. If a swap has ' + 'been made then the algorithm will iterate over all elements again until ' + 'no swaps occour'
    }, {
      name: 'Insertion',
      callBack: window.sortingVisualiser.algorithm.insertionSort,
      bestCase: "",
      averageCase: "",
      worstCase: "",
      memory: "",
      stable: true,
      technique: '',
      algorithm: "",
      description: ""
    }],

    graphDimensions = {
      width: 0,
      height: 0
    },
    axis = {
      x: null,
      y: null
    },
    axisGraphicsElements = {
      x: null,
      y: null
    },
    graphScale = {
      x: null,
      y: null
    },

    /* ------------------------------------------------------------------------- */
    /* Main containers
    /* ------------------------------------------------------------------------- */

    /**
     * Returns whether or not the parent container exsists
     * @return {boolean} Whether the parent container exsists
     */
    mainContainerExsists = function() {
      return $('#' + ID_MAIN_CONTAINER).length > 0;
    },

    createLeftContainer = function(parentContainer) {
      parentContainer.append('div')
        .attr('id', ID_LEFT_CONTAINER)
        .attr('class', CLASS_CONTAINER);
    },

    createRightContainer = function(parentContainer) {
      parentContainer.append('div')
        .attr('id', ID_RIGHT_CONTAINER)
        .attr('class', CLASS_CONTAINER);
    },


    /**
     * Creates the graph container
     */
    createGraphContainer = function(parentContainer) {
      parentContainer.append('div').attr('id', ID_GRAPH_CONTAINER).attr('class', CLASS_CONTAINER);
    },

    createColumn = function(parentContainer, columnNumber) {
      window.sortingVisualiser.util.log('Creating container ' + COLUMN_PREFIX + columnNumber.toString());
      parentContainer.append('div')
        .attr('id', COLUMN_PREFIX + columnNumber.toString())
        .attr('class', CLASS_CONTAINER + ' ' + CLASS_COLUMN);
    },

    createColumns = function(parentContainer, numberOfColumns) {
      for (var i = 0; i < numberOfColumns; i++) {
        createColumn(parentContainer, i);
      }
    },

    /**
     * Creates all containers used in Sorter-Visualiser
     */
    createContainers = function() {
      createLeftContainer(getMainContainer());
      createRightContainer(getMainContainer());
      createGraphContainer(getLeftContainer());
      createColumns(getLeftContainer(), 4);
    },

    /**
     * Returns the main container for the whole program
     * @return {d3.element} Main container
     */
    getMainContainer = function() {
      return d3.select('#' + ID_MAIN_CONTAINER);
    },

    /**
     * Returns the graph container for the whole program
     * @return {d3.element} Graph container
     */
    getGraphContainer = function() {
      return d3.select('#' + ID_GRAPH_CONTAINER);
    },


    getColumn = function(id) {
      return d3.select('#' + COLUMN_PREFIX + id.toString());
    },

    getLeftContainer = function() {
      return d3.select('#' + ID_LEFT_CONTAINER);
    },

    getRighttContainer = function() {
      return d3.select('#' + ID_RIGHT_CONTAINER);
    },

    /* ------------------------------------------------------------------------- */
    /* Graph
    /* ------------------------------------------------------------------------- */

    /**
     * Creates graph and associated DOM elements
     */
    createGraph = function(parentContainer) {
      var graph = parentContainer.append('svg').attr('id', ID_GRAPH);
      graph.append('g').attr('id', ID_GRAPH_GRAPHICS);

      axisGraphicsElements.x = graph.append('g').attr('class', 'x sv-axis');
      axisGraphicsElements.y = graph.append('g').attr('class', 'y sv-axis');
    },

    /**
     * Updates the dimensions of the graph and updates graphics
     */
    updateGraphDimensions = function() {
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
    },

    /* ------------------------------------------------------------------------- */
    /* Setttings
    /* ------------------------------------------------------------------------- */

    updateArraySize = function() {
      if (!window.sortingVisualiser.algorithm.getSortingAlgorithmCurrentlyRunning()) {
        window.sortingVisualiser.util.log('Array size updated to ' + this.value);
        window.sortingVisualiser.algorithm.setNumberOfElements(this.value);
        window.sortingVisualiser.algorithm.generateData();
      } else {
        this.value = window.sortingVisualiser.algorithm.getInfo().array.length;
      }
    },

    updateTimeStep = function() {
      window.sortingVisualiser.util.log('Sorting time set set to' + this.value * 1000);
      window.sortingVisualiser.algorithm.setTimeStep(Math.max(this.value * 1000, CONTROL_LOOP_TIME_MIN));
    },

    updateArrayType = function() {
      window.sortingVisualiser.util.log('Array type selected: ' + this.value);
      if (this.value == LABEL_SETTINGS_ARRAY_TYPE_BEST) {
        window.sortingVisualiser.algorithm.setDataGenerationAlgorithm(
          window.sortingVisualiser.algorithm.generateBestCase
        );
      } else if (this.value == LABEL_SETTINGS_ARRAY_TYPE_WORST) {
        window.sortingVisualiser.algorithm.setDataGenerationAlgorithm(
          window.sortingVisualiser.algorithm.generateWorstCase
        );
      } else {
        window.sortingVisualiser.algorithm.setDataGenerationAlgorithm(
          window.sortingVisualiser.algorithm.generateRandomData
        );
      }
      window.sortingVisualiser.algorithm.generateData();
    },

    updateSoundState = function() {
      if (this.value == LABEL_SETTINGS_SOUND_OFF) {
        window.sortingVisualiser.audio.turnSoundOff();
      } else {
        window.sortingVisualiser.audio.turnSoundOn();
      }
    },

    createSettings = function(parentContainer) {
      var controlsContainer = parentContainer.append('div').attr('id', ID_ALGORITHMS_SETTINGS_CONTAINER).attr('class', CLASS_LIST);

      controlsContainer.append('h2').text(LABEL_SETTINGS_HEADING);
      var list = controlsContainer.append('ul');

      var arraySizeControlContainer = list.append('li').attr('class', CLASS_CONTROL_CONTAINER);
      arraySizeControlContainer.append('div').attr('class', CLASS_CONTROL_LABEL)
        .append('p').text(LABEL_SETTINGS_ARRAY_SIZE);

      //Array size control
      arraySizeControlContainer.append('input')
        .attr('type', 'number')
        .attr('min', window.sortingVisualiser.algorithm.ARRAY_MIN_SIZE)
        .attr('step', CONTROL_ARRAY_SIZE_STEP)
        .attr('value', window.sortingVisualiser.algorithm.getInfo().numberOfElements)
        .on('input', updateArraySize);

      var timeStepControlContainer = list.append('li').attr('class', CLASS_CONTROL_CONTAINER);
      timeStepControlContainer.append('div').attr('class', CLASS_CONTROL_LABEL)
        .append('p').text(LABEL_SETTINGS_TIME_STEP);

      //Time step control
      timeStepControlContainer.append('input')
        .attr('type', 'number')
        .attr('min', CONTROL_LOOP_TIME_MIN)
        .attr('step', CONTROL_LOOP_TIME_STEP)
        .attr('value', window.sortingVisualiser.algorithm.getInfo().timeStep / 1000)
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
    },

    /* ------------------------------------------------------------------------- */
    /* Algorithms
    /* ------------------------------------------------------------------------- */

    deselectAllButtons = function() {
      //Removes selected class from all buttons
      d3.selectAll('.' + CLASS_BUTTON).classed(CLASS_BUTTON_SELECTED, false);
    },

    createButton = function(parent, text, callBack) {
      var button = parent.append('li').attr('class', CLASS_BUTTON);
      button.text(text);
      button.on('click', function() {
        callBack()
      });
    },

    createAlgorithmButton = function(parent, buttonData) {
      var button = parent.append('li').attr('class', CLASS_BUTTON);
      button.text(buttonData.name);
      button.on('click', function() {
        if (!window.sortingVisualiser.algorithm.sortingAlgorithmCurrentlyRunning) {
          button.classed(CLASS_BUTTON_SELECTED, true);
          window.sortingVisualiser.algorithm.start(buttonData);
        }
      });
    },

    createAlgorithmButtons = function(container) {
      var container = container.append('div').attr('id', ID_ALGORITHMS_CONTAINER).attr('class', CLASS_LIST);
      container.append('h2').text(LABEL_ALGORITHMS_HEADING);
      for (var i = 0; i < sortingAlgorithmButtons.length; i++) {
        createAlgorithmButton(container, sortingAlgorithmButtons[i]);
      }
    },

    /* ------------------------------------------------------------------------- */
    /* Controls
    /* ------------------------------------------------------------------------- */

    createControls = function(parentContainer) {
      var container = parentContainer.append('div').attr('id', ID_ALGORITHMS_CONTROLS_CONTAINER).attr('class', CLASS_LIST);
      container.append('h2').text(LABEL_CONTROLS_HEADING);
      createButton(container, LABEL_CONTROLS_STOP, window.sortingVisualiser.algorithm.stop);
      createButton(container, LABEL_CONTROLS_NEW_ARRAY, window.sortingVisualiser.algorithm.generateData);
    },

    /* ------------------------------------------------------------------------- */
    /* Legend
    /* ------------------------------------------------------------------------- */

    createLegend = function(container) {
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
    },

    /* ------------------------------------------------------------------------- */
    /* Stats
    /* ------------------------------------------------------------------------- */

    createStats = function(container) {
      var statsContainer = container.append('div').attr('id', ID_STATS).attr('class', CLASS_LIST);
      statsContainer.append('h2').text(LABEL_STATS_HEADING);
      var list = statsContainer.append('ul');
      list.append('li').attr('id', ID_STATS_COMPARISONS).attr('class', CLASS_STAT);
      list.append('li').attr('id', ID_STATS_SWAPS).attr('class', CLASS_STAT);
    },

    updateStats = function(data) {
      var
        comparisons = 0,
        swaps = 0;

      if (data && data.numberOfComparisons) {
        comparisons = data.numberOfComparisons;
      }
      if (data && data.numberOfSwaps) {
        swaps = data.numberOfSwaps;
      }
      d3.select('#' + ID_STATS_COMPARISONS).text("Comparisons: " + comparisons);
      d3.select('#' + ID_STATS_SWAPS).text("Swaps: " + swaps);
    },

    /* ------------------------------------------------------------------------- */
    /* Properties
    /* ------------------------------------------------------------------------- */

    createProperties = function(container) {
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
    },

    updateAlgorithmInformation = function(algorithm) {
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
          d3.select('#' + ID_INFORMATION_ALGORITHM).text(algorithm.algorithm.replace("/\\t/g", "  "));
        }
        if (algorithm.technique != undefined) {
          d3.select('#' + ID_INFORMATION_DESCRIPTION).text(algorithm.description);
        }
      }
    },

    /* ------------------------------------------------------------------------- */
    /* Algorithm
    /* ------------------------------------------------------------------------- */

    createAlgorithmInformation = function(container) {
      var algorithmContainer = container.append('div').attr('id', ID_ALGORITHM_INFORMATION_ALGORITHM).attr('class', CLASS_LIST);
      algorithmContainer.append('h2').text(LABEL_ALGORITHM_HEADING);
      algorithmContainer.append('pre').attr('id', ID_INFORMATION_ALGORITHM);
    },

    /* ------------------------------------------------------------------------- */
    /* Description
    /* ------------------------------------------------------------------------- */

    createAlgorithmDescription = function(container) {
      var descriptionContainer = container.append('div').attr('id', ID_ALGORITHM_INFORMATION_DESCRIPTION).attr('class', CLASS_LIST);
      descriptionContainer.append('h2').text(LABEL_DESCRIPTION_HEADING);
      descriptionContainer.append('p').attr('id', ID_INFORMATION_DESCRIPTION);
    },

    createInformation = function() {
      var container = getInformationRightContainer();
      createStats(container);
      createLegend(container);
      createAlgorithmDescription(container);
      var container = getInformationLeftContainer();
      createAlgorithmProperties(container);
      createAlgorithmInformation(container);
    },

    /* ------------------------------------------------------------------------- */
    /* UI Creation
    /* ------------------------------------------------------------------------- */

    createRightContainerElements = function(parentContainer) {
      createStats(getColumn(0));
      createProperties(getColumn(0));

      createAlgorithmInformation(getColumn(1));
      createAlgorithmDescription(getColumn(1));
    },

    createLeftContainerElements = function(parentContainer) {
      createLegend(parentContainer);
      createControls(parentContainer);
      createSettings(parentContainer);
      createAlgorithmButtons(parentContainer);
    },

    /**
     * Creates the UI
     */
    createUI = function() {
      if (mainContainerExsists()) {
        createContainers();
        createGraph(getGraphContainer());
        updateGraphDimensions();
        createRightContainerElements(getLeftContainer());
        createLeftContainerElements(getRighttContainer());
      } else {
        window.sortingVisualiser.util.log('No element found with id "' + PARENT_CONTAINER_ID + '"');
        window.sortingVisualiser.util.log('Please create a div with that id where you wish for the visualiser to be created.');
      }
    },

    /* ------------------------------------------------------------------------- */
    /* Render
    /* ------------------------------------------------------------------------- */

    getClassForBar = function(d, data) {
      if (d.x == data.sortingCurrentIndex) {
        return CLASS_BAR_ACTIVE;
      }
      if (d.x == data.sortingComparisonIndex) {
        return CLASS_BAR_COMPARISON;
      }
      if (d.x == data.sortingLeftBound || d.x == data.sortingRightBound) {
        return CLASS_BAR_BOUND;
      }
      return CLASS_BAR_NORMAL;
    },

    /**
     * Returns the data to render in a usable format for d3.js
     */
    getRenderData = function(data) {
      var out = [];
      for (var i = 0; i < data.length; i++) {
        out.push({
          x: i,
          y: data[i]
        });
      }
      return out;
    },

    getWidthOfBar = function(data) {
      if (data.array.length) {
        return graphDimensions.width / data.array.length - 1;
      }
      return 0;
    },

    getHeightOfBar = function(d) {
      return graphDimensions.height - margin.top - graphScale.y(d.y);
    },

    /**
     * Renders the graph to screen
     */
    render = function(data) {
      if (!data) {
        return;
      }
      if (data.array == undefined || data.array == null) {
        return;
      }
      var dataToRender = getRenderData(data.array);
      graphScale.y.domain([0, d3.max(data.array)]);
      graphScale.x.domain([0, data.array.length]);

      var graph = d3.select('#' + ID_GRAPH);

      //Reset all bars (not used to not interact with legend)
      d3.selectAll('.' + CLASS_BAR_ACTIVE + ':not(.' + CLASS_LEGEND_ITEM + ')').attr('class', CLASS_BAR_NORMAL);
      d3.selectAll('.' + CLASS_BAR_COMPARISON + ':not(.' + CLASS_LEGEND_ITEM + ')').attr('class', CLASS_BAR_NORMAL);
      d3.selectAll('.' + CLASS_BAR_BOUND + ':not(.' + CLASS_LEGEND_ITEM + ')').attr('class', CLASS_BAR_NORMAL);

      var bars = graph.selectAll('.' + CLASS_BAR_NORMAL)
        .data(dataToRender);

      bars.enter().append("rect")
        .attr("class", function(d) {
          return getClassForBar(d, data)
        })
        .attr("x", function(d) {
          return graphScale.x(d.x);
        })
        .attr("width", getWidthOfBar(data))
        .attr("y", function(d) {
          return graphScale.y(d.y);
        })
        .attr("height", function(d) {
          return getHeightOfBar(d);
        })
        .attr("transform", "translate(" + margin.left + ", " + margin.top + "0)");

      bars.attr("class", function(d) {
          return getClassForBar(d, data)
        })
        .attr("x", function(d) {
          return graphScale.x(d.x);
        })
        .attr("width", getWidthOfBar(data))
        .attr("y", function(d) {
          return graphScale.y(d.y);
        })
        .attr("height", function(d) {
          return getHeightOfBar(d);
        })
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

      bars.exit().remove();
    },

    /* ------------------------------------------------------------------------- */
    /* Screen Arrangement
    /* ------------------------------------------------------------------------- */

    getWidthInEm = function(element) {
      return element.width() / parseFloat($('body').css('font-size'));
    },

    getWidthOfContainerInEm = function() {
      return getWidthInEm($('#' + ID_MAIN_CONTAINER));
    },

    setPercentageWidthOfElement = function(id, width) {
      //  window.sortingVisualiser.util.log('Setting ' + id + ' to width: ' + width.toString() + '%');
      $(id).outerWidth(width + "%");
    },

    setMainContainersPercentageWidths = function(leftContainerWidth, rightContainerWidth) {
      setPercentageWidthOfElement('#' + ID_LEFT_CONTAINER, leftContainerWidth);
      setPercentageWidthOfElement('#' + ID_RIGHT_CONTAINER, rightContainerWidth);
    },

    /*
     * This updates the layout for the panels as css will not allow resizing based
     * on size of a div.
     */
    updateLayout = function() {
      var width = getWidthOfContainerInEm();
      window.sortingVisualiser.util.log('Container width: ' + width + 'em');

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

      if (width < 28) {
        setPercentageWidthOfElement('.' + CLASS_COLUMN, 99);
      }
    },

    update = function(data) {
      render(data);
      updateStats(data);
    },

    resize = function() {
      updateLayout();
      updateGraphDimensions();
      update();
    },

    setUp = function() {
      window.addEventListener("resize", resize);
      createUI();
      resize();
    };

  return {
    "setUp": setUp,
    "update": update,
    "updateAlgorithmInformation": updateAlgorithmInformation,
    "deselectAllButtons": deselectAllButtons
  }

}());

window.sortingVisualiser.audio = (function() {
  "use strict";
  var
    audioContext,
    audioOscillator,
    soundOn = false,
    AudioContext,

    audioSupported = function() {
      return AudioContext;
    },

    initAudio = function() {
      AudioContext = window.AudioContext || window.webkitAudioContext || false;
      if (audioSupported()) {
        audioContext = new AudioContext();
      } else {
        window.sortingVisualiser.util.log('Audio is not supported in this browser');
      }
    },

    startSound = function() {
      if (!soundOn || !audioSupported()) {
        return;
      }
      window.sortingVisualiser.util.log('Starting sound');
      if (audioContext != undefined) {
        audioOscillator = audioContext.createOscillator();
        audioOscillator.connect(audioContext.destination);
        audioOscillator.start(0);
      }
    },

    stopSound = function() {
      if (!soundOn || !audioSupported()) {
        return;
      }
      if (audioOscillator != undefined) {
        audioOscillator.stop(0);
      }
    },

    playFrequency = function(frequency) {
      if (!soundOn || !audioSupported()) {
        return;
      }
      if (audioOscillator != undefined) {
        audioOscillator.frequency.value = frequency;
      }
    },

    playSoundForValue = function(value) {
      var frequency = 110 + Math.pow(1000, value / window.sortingVisualiser.algorithm.getInfo().maxValue);
      frequency = Math.min(10000, Math.max(0, frequency));
      playFrequency(frequency);
    },

    turnSoundOn = function() {
      window.sortingVisualiser.util.log('Turning sound on');
      soundOn = true;
      startSound();
      playFrequency(0);
    },

    turnSoundOff = function() {
      window.sortingVisualiser.util.log('Turning sound off');
      playFrequency(0);
      soundOn = false;
      stopSound();
    },

    setUp = function() {
      initAudio();
    };

  return {
    "setUp": setUp,
    "turnSoundOn": turnSoundOn,
    "turnSoundOff": turnSoundOff,
    "playSoundForValue": playSoundForValue,
    "startSound": startSound,
    "stopSound": stopSound
  }
}());

"use strict";

/* ------------------------------------------------------------------------- */
/* Sorting algorithms
/* ------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------- */
window.addEventListener("load", window.sortingVisualiser.ui.setUp);
window.addEventListener("load", window.sortingVisualiser.audio.setUp);
window.addEventListener("load", window.sortingVisualiser.algorithm.setUp);
