class StateMap {
    /**
     * Creates a Map Object
     */
    constructor(data, tooltip) {
        this.data = data;
        this.projection = d3.geoAlbersUsa().scale(1300);
        this.tooltip = tooltip;
    }

    /**
     * Function that clears the map
     */
    clearMap() {

    }


    updateMap(year) {
        let total = 0;
        let fatalities = this.data.map(s => {
            if (s.ID !== "9999")
                return parseInt(s[year]);
            else
                total = parseInt(s[year]);
        });
        document.getElementById('national-total').innerHTML = `Total Fatalities: ${total}`;
        let ids = this.data.map(s => {return `s${s.ID}`});
        let states = {};
        ids.forEach((id, i) => {
            states[id] = fatalities[i]
        });
        let colorScale = d3.scaleSequential()
            .domain([d3.min(fatalities), d3.max(fatalities)])
            .interpolator(d3.interpolateReds);

        d3.select('.states')
            .selectAll('path')
            .attr("fill", function(d) { return colorScale(states[`s${parseInt(d.id)}`]); })
            .on('click', function(d) {
                console.log(`s${parseInt(d.id)}`);
            })
            .on('mouseover', (d) => {
                this.tooltip.mouseover(states[`s${parseInt(d.id)}`])
            })
            .on('mouseout', (d) => {
                this.tooltip.mouseout(states[`s${parseInt(d.id)}`])
            })
            .on('mousemove', (d) => {
                this.tooltip.mousemove(states[`s${parseInt(d.id)}`])
            })
        ;

    }

    /**
     * Adapted from https://bl.ocks.org/adamjanes/6cf85a4fd79e122695ebde7d41fe327f
     */


    drawMap() {
        let year = document.getElementById('year').value;
        let total = 0;
        let fatalities = this.data.map(s => {
            if (s.ID !== "9999")
                return parseInt(s[year]);
            else
                total = parseInt(s[year]);
        });
        document.getElementById('national-total').innerHTML = `Total Fatalities: ${total}`;
        let ids = this.data.map(s => {return `s${s.ID}`});
        let states = {};
        ids.forEach((id, i) => {
            states[id] = fatalities[i]
        });
        let colorScale = d3.scaleSequential()
            .domain([d3.min(fatalities), d3.max(fatalities)])
            .interpolator(d3.interpolateReds);

        // let colorScale = d3.scaleQuantize()
        //     .domain([d3.min(fatalities),d3.max(fatalities)])
        //     .range(["#1e99be", "#2b8cbe","#3138bd", "#0a0fc2", "#020053"])

        let map = d3.select("#map")
            .attr('width', 960)
            .attr('height', 600)
        ;

        let key = map
            .append("g")
            .attr("width", 300)
            .attr("height", 30);

        let legend = key.append("defs")
            .append("svg:linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "100%")
            .attr("x2", "100%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");

        legend.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#fff3ed")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "33%")
            .attr("stop-color", "#fcb69e")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "66%")
            .attr("stop-color", "#d86c69")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#4f000d")
            .attr("stop-opacity", 1);

        key.append("rect")
            .attr("width", 300)
            .attr("height", 50 - 30)
            .style("fill", "url(#gradient)")
            .attr("transform", "translate(600,0)");

        let y = d3.scaleLinear()
            .domain([4000, 0])
            .range([300, 0])
        ;

        let yAxis = d3.axisBottom()
            .scale(y)
            .ticks(5);

        key.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(600,20)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("axis title");



        let path = d3.geoPath();
        d3.json("https://d3js.org/us-10m.v1.json")
            .then((us) => {
                map.append("g")
                    .attr("class", 'states')
                    .selectAll("path")
                    .data(topojson.feature(us, us.objects.states).features)
                    .enter().append("path")

                    .attr("fill", function(d) { return colorScale(states[`s${parseInt(d.id)}`]); })
                    .attr('id', function(d) {
                        return `s${parseInt(d.id)}`
                    })
                    .attr("d", path)

                    .on('click', function(d) {
                        console.log(`s${parseInt(d.id)}`);
                    })
                    .on('mouseover', (d) => {
                        this.tooltip.mouseover(states[`s${parseInt(d.id)}`])
                    })
                    .on('mouseout', (d) => {
                        this.tooltip.mouseout(states[`s${parseInt(d.id)}`])
                    })
                    .on('mousemove', (d) => {
                        this.tooltip.mousemove(states[`s${parseInt(d.id)}`])

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
