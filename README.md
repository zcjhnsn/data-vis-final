# data-vis-final

## Overview
<p>
The primary goal of this visualizaiton is to find patterns and trends of crash fatalities. Using this visualization you 
can see multiple aspects of the National Highways Data in an easy to see and understand way.

When first visited, the site displays a heatmap of the United States with the number of fatalities for a given year. The hue of the state shows the relative number of fatal crashes for that state. Obviously, the states with a larger population have more fatal accidents than states with lower population. When a state is selected, the location of each fatality is displayed. Population centers and major highways are made easily visible due to the plotted points. While the US map shows the location and density of fatal accidents, the treemap shows trends for time of the year (month, day, and hour) and the parallel set displays their causes (weather, drunk driving, etc)

    
</p>

## Code Analysis

### TreeMap Class-
<p>
    The treemap class utilizes two D3 libraries, d3.nest and d3.treemap.  The first library gets the data into a nested structure that the treemap library can then read from and have a sense of hierarchy.</p>

### Map Class-
<p>
    The map class utilizes d3.geoAlbersUsa for the map projection.  We also found an example of drawing a similar map at <a href= "https://bl.ocks.org/adamjanes/6cf85a4fd79e122695ebde7d41fe327f">https://bl.ocks.org/adamjanes</a> this was adapted to work for our needs.
</p>

### Parallel Sets Class-
<p>
    The parellel sets class uses the library <a href="https://github.com/jasondavies/d3-parsets">d3.parsets</a>. It was not originally written for d3 v5 so some tweaking was involved to comply with that version of d3. It is the same library used for the Titanic visualization found <a href="https://www.jasondavies.com/parallel-sets/">here</a>.
</p>

### ToolTip Class-
<p>
    We came across most of the code for a tool tip in a git repo. We were then able to modify it for our needs.
</p>

## Links
<a href="https://zcjhnsn.github.io/data-vis-final/">Two And A Half Beards Web Site</a> <br>
<a href="https://www.youtube.com/embed/zRr8s84guPQ">Screen Cast</a>
