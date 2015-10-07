#SortingVisualiser
A application that can be embedded in a website that demonstrates a collection of different sorting algorithms and gives some information on them, this allows for the visualisation of the algorithms by displaying a bar chart representing an array of integers with different height which are then sorted into smallest to largest (left to right), and audio representation is also available within the application in the form of a sine wave that plays at a frequency relative to the height/value of the bar. 

This project was first envisioned when I began learning sorting algorithms and saw several videos on YouTube demonstrating sorting algorithms in the same manner as this application does. When I searched for an application that allowed me to adjust the settings of the arrays and algorithms I was disappoint to I decided to create one myself. This was first in the form of a Java application that performed the basic functionality but was lacking many key control features, which I then re-wrote for the web as this application.

##Usage
This project requires a div with the id 'sorting-visualiser-container', the file 'sorting-visualiser.css' and the script 'sorting-visualiser.js'.
```html
  <link href='sorting-visualiser.css' title='document' media='all' rel='stylesheet' type='text/css'>
  <div id="sorting-visualiser-container"></div>
  <script src="sorting-visualiser.js"></script>
```

##Dependencies
- d3.js
- jQuery

##To Do
- [ ] Add to information
  - [ ] Properties
  - [ ] Algorithm
  - [x] Description
- [ ] Add sorting algorithms
  - [ ] Binary Tree Sort
  - [ ] Block Sort
  - [x] Bubble Sort
  - [ ] Cocktail Sort
  - [ ] Comb Sort
  - [ ] Cubesort
  - [ ] Cycle Sort
  - [ ] Gnome Method
  - [ ] Heap Sort
  - [ ] In-place merge Sort
  - [ ] Insertion Sort
  - [ ] Introsort
  - [ ] Library Sort
  - [ ] Merge Sort
  - [ ] Odd-even Sort
  - [ ] Patience Sorting
  - [ ] Quicksort
  - [ ] Selection Sort
  - [ ] Shell Sort
  - [ ] Smooth Sort
  - [ ] Strand Sort
  - [ ] Timsort
  - [ ] Tournament Sort
