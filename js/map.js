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

        let selected = document.getElementById('year').value;
        let fatalities = data.map(s => {return parseInt(s[selected])});
        let ids = data.map(s => {return `s${s.ID}`});
        let states = {};
        ids.forEach((id, i) => states[id] = fatalities[i]);

        console.log(states);

        let colorScale = d3.scaleOrdinal()
            .domain([d3.min(fatalities), d3.max(fatalities)])
            .range(d3.schemeReds[9]);

        // let colorScale = d3.scaleQuantize()
        //     .domain([d3.min(fatalities),d3.max(fatalities)])
        //     .range(["#1e99be", "#2b8cbe","#3138bd", "#0a0fc2", "#020053"])

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
                    .data(topojson.feature(us, us.objects.states).features)
                    .enter().append("path")
                    .attr("fill", function(d) { return colorScale(states[`s${d.id}`]); })
                    .attr('id', function(d) {return `s${d.id}`})
                    .attr("d", path)

                    .on('click', function(d) {
                        console.log(`s${d.id}`);
                    })
                ;

                map.append("path")
                    .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
                    .attr("class", "state-borders")
                    .attr("d", path)
                ;
            })



    }


}
