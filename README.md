# calcpie
JavaScript+JQuery Interactive Pie Chart

calcpie.js: Requires jQuery 1.8+, jQueryUI 1.7+, CSS "fill" colors for each pie slice (e.g. path.calc-pie:nth-child(1){fill: #4d4550;})

Draws a pie chart over the initialized tag. Accepts the following arguments:

* defaultUnits: units displayed on the label. Accepts: "Degrees"† or "Percent"
* start: comma-separated list of the starting amounts for each pie slice (amount should correspond to whether degrees or percent is selected). Default: '60,60,60,60,60,60'
* width: with of the SVG pie chart area. Default: 120px
* height: height of the SVG pie chart area, Default: 130px
* diameter: diameter of the SVG pie chart. Default: 130px
* labelPosition: defines placement of labels, whether it's on the pie slice or outside. Accepts "outer" or "inner"†. 
* showLabel: defines whether the label is displayed and how. Accepts: "mouseover" or "static"†.
* interactive: defines whether the chart can be manipulated with click & drag. Accepts: "true"† or "false".
* sensitivity: in interactive mode, how quickly the values change as the mouse is moved. Default: 1.5.
* legend: creates a div and adds a legend. (I don't believe this is fully supported yet.)

† denotes default value

When set to interactive mode, the pie slices can be clicked on and dragged in the direction of the clockwise-rightmost side to increase/decrease the value.

Values can be queried directly via $('#yourtag').calcpie('position'); this will return all pie slice selectors "calcpie-pN" where N is the slice number.

Values can be updated via $('#yourtag').move(slice,amount);

Unless all values are passed, the next pie slice (clockwise) will be updated to accommodate the new value.

Areas for improvement: 
* Providing a bad element height/width to diameter size ratio can cause unexpected display of the pie chart.
* Label text size can be changed via CSS styling class "calcpie-pietext" but this can cause some unexpected text display issues.
* Legend currently sets up a div to display the legend but I don't believe it currently does anything else.
