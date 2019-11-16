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

    drawState(id) {
        // var width = 960,
        //     height = 500,
        //     centered;
        //
        // var projection =  d3.geoAlbersUsa()
        //     .scale(1370)
        //     .translate([width / 2, height / 2]);
        //
        // var path = d3.geoPath()
        //     .projection(projection);
        //
        // var svg = d3.select("#stateMap")
        //     .attr("width", width)
        //     .attr("height", height);
        //
        //
        // d3.json("https://d3js.org/us-10m.v1.json")
        //     .then((json) => {
        //     console.log(json);
        //
        //
        //     svg.append('g')
        //         .selectAll("path")
        //         .attr("id", d => {return d.State})
        //         .data(topojson.feature(json, json.objects.states).features.filter(function(d) { return `s${d.id}` === id; }))
        //         .enter()
        //         .append("path")
        //         .attr("d", path)
        //         .attr("class", 'states');
        //
        //
        //
        // });

        // var width = 960,
        //     height = 500;
        //
        // var projection = d3.geoAlbersUsa();
        //
        // /*
        // var projection = d3.geo.transverseMercator()
        //           .rotate([120 + 30 / 60, -38 - 50 / 60])
        //
        // */
        //
        // var path = d3.geoPath()
        //     .projection(projection);
        //
        // var svg = d3.select("#stateMap")
        //     .attr("width", width)
        //     .attr("height", height);
        // d3.json("https://d3js.org/us-10m.v1.json")
        //     .then(us => {
        //
        //         var states = topojson.feature(us, us.objects.states),
        //             state = states.features.filter(function (d) {
        //                 return `s${d.id}` === id;
        //             })[0];
        //
        //         projection.scale(1)
        //             .translate([0, 0]);
        //
        //         var b = path.bounds(state),
        //             s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        //             t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
        //
        //         projection.scale(s)
        //             .translate(t);
        //
        //
        //         // svg.append("path")
        //         //     .datum(topojson.mesh(us, us.objects.states, function (a, b) {
        //         //         return a !== b;
        //         //     }))
        //         //     .attr("class", "mesh")
        //         //     .attr("d", path);
        //
        //         svg.append("path")
        //             .datum(state)
        //             .attr("class", "outline")
        //             .attr("d", path)
        //             .attr('id', 'land');
        //
        //         svg.append("clipPath")
        //             .attr("id", "clip-land")
        //             .append("use")
        //             .attr("xlink:href", "#land");
        //
        //         svg.selectAll("path")
        //             .data(topojson.feature(us, us.objects.counties).features)
        //             .enter().append("path")
        //             .attr("d", path)
        //             .attr('county-id', function (d) {
        //                 return d.State;
        //             }).attr("clip-path", "url(#clip-land)")
        //             .attr('class', 'county');
        //
        //     });


        // let map = d3.select("#stateMap")
        //     .attr('width', 860)
        //     .attr('height', 500)
        // ;
        // let path = d3.geoPath();
        // d3.json("https://d3js.org/us-10m.v1.json")
        //     .then((us) => {
        //         let states = topojson.feature(us, us.objects.states).features;
        //         let state = states.filter(function (d) {
        //                 return `s${d.id}` === id;
        //             })[0];
        //         console.log(state);
        //         map.append("g")
        //             .attr("class", 'states')
        //             .selectAll("path")
        //             .data(state)
        //             .enter().append("path")
        //
        //             // .attr("fill", function(d) { return colorScale(states[`s${parseInt(d.id)}`]); })
        //             .attr('id', function(d) {
        //                 return `s${parseInt(d.id)}`
        //             })
        //             .attr("d", path)
        //
        //             // .on('click', (d) => {
        //             //     console.log(`s${parseInt(d.id)}`);
        //             //     this.drawState(`s${parseInt(d.id)}`)
        //             // })
        //             // .on('mouseover', (d) => {
        //             //     this.tooltip.mouseover(states[`s${parseInt(d.id)}`])
        //             // })
        //             // .on('mouseout', (d) => {
        //             //     this.tooltip.mouseout(states[`s${parseInt(d.id)}`])
        //             // })
        //             // .on('mousemove', (d) => {
        //             //     this.tooltip.mousemove(states[`s${parseInt(d.id)}`])
        //             //
        //             // })
        //         ;
        //
        //         map.append("path")
        //             .datum(topojson.mesh(us, state, function(a, b) { return a !== b; }))
        //             .attr("class", "state-borders")
        //             .attr("d", path)
        //         ;
        //     })
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
            .on('click', (d) => {
                console.log(`s${parseInt(d.id)}`);
                this.drawState(`s${parseInt(d.id)}`)
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

                    .on('click', (d) => {
                        console.log(`s${parseInt(d.id)}`);
                        this.drawState(`s${parseInt(d.id)}`)
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
