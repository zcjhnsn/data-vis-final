class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoAlbersUsa().scale(1300)

    }

    /**
     * Function that clears the map
     */
    clearMap() {

    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap() {

        //Clear any previous selections;
        this.clearMap();

    }

    /**
     * Adapted from https://bl.ocks.org/adamjanes/6cf85a4fd79e122695ebde7d41fe327f
     */

    drawMap(data) {

        let scalex = d3.scaleLinear()
            .domain([1, 10])
            .rangeRound([600, 860]);

        let colorScale = d3.scaleThreshold()
            .domain(d3.range(d3.max(data)))
            .range(d3.schemeReds[9]);

        let map = d3.select("#map")
            .attr('width', 960)
            .attr('height', 600)
        ;

        let path = d3.geoPath();
        d3.json("https://d3js.org/us-10m.v1.json")
            .then((us) => {
                map.append("g")
                    .attr("class", 'states')
                    .selectAll("path")
                    // .attr('id', topojson.feature(us, us.object.states.id))
                    .data(topojson.feature(us, us.objects.states).features)
                    .enter().append("path")
                    .attr('id', function(d) {return `s${d.id}`})
                    .attr("d", path);

                map.append("path")
                    .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
                    .attr("class", "state-borders")
                    .attr("d", path);
            })



    }


}
