class StateMap {
    /**
     * Creates a Map Object
     */
    constructor(data, vmtData, stateData, tooltip) {
        this.data = data;
        this.vmtData = vmtData;
        this.stateData = stateData;
        this.width = 960;
        this.height =  600;
        this.projection = d3.geoAlbersUsa()
            .scale(1200)
            .translate([this.width / 2, this.height / 2]);
        this.tooltip = tooltip;
    }

    /**
     * Function that clears the map
     */
    clearMap() {

    }

    drawPoints(id, scale, translate) {
        let year = document.getElementById('year').value;
        let matches = this.stateData.filter(d => {
            if ((d.YEAR === year || d.YEAR === year.substring(2, 5)) && d.id === `s${id}`)
                return d;
        });
        let coords = matches.map(d => {
            if (isNaN(parseFloat(d.LONGITUD)))
                return [parseFloat(d.longitud), parseFloat(d.latitude)];
            else
                return [parseFloat(d.LONGITUD), parseFloat(d.LATITUDE)];
        });

        let svg = d3.select('#map');
        svg.selectAll('g')
            .selectAll('circle')
            .remove()
        ;

        svg.append('g')
            .selectAll('circle')
            .data(coords)
            .enter()
            .append('circle')
            .attr('cx', (d,i) => {
                if (d !== undefined)
                    if (this.projection(d) !== null)
                        return this.projection(d)[0]
            })
            .attr('cy', (d,i) => {
                if (d !== undefined)
                    if (this.projection(d) !== null)
                        return this.projection(d)[1];
            })
            .attr('r', '1')
            .classed('crash-dot', true)
            .transition()
            .duration(750)
            .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
        treemap.drawTreeMap(matches, id);
        parset.drawParset(matches);
    }

    drawLegend(fatalities) {
        d3.select('#legend')
            .remove()
        ;
        let key = d3.select('#map')
            .append("g")
            .attr("width", 300)
            .attr("height", 30)
            .attr('id', 'legend')
        ;
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
            .domain([d3.max(fatalities), d3.min(fatalities)])
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
            .text("axis title")

        ;

    }

    updateMap(year, selected) {
        let data = selected === 'total' ? this.data : this.vmtData;
        let total = 0;
        let fatalities = data.map(s => {
            if (s.ID !== "9999")
                return parseFloat(s[year]);
            else
                total = parseFloat(s[year]);
        });
        if (selected === 'total')
            document.getElementById('national-total').innerHTML = `Total Fatalities: ${total}`;
        else
            document.getElementById('national-total').innerHTML = `Total Fatalities per 100 Million Miles Traveled: ${total}`;

        let ids = data.map(s => {return `s${s.ID}`});
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

        this.drawLegend(fatalities);

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
        let ids = this.data.map(s => {
            return `s${s.ID}`
        });
        let states = {};
        ids.forEach((id, i) => {
            states[id] = fatalities[i]
        });
        let colorScale = d3.scaleSequential()
            .domain([d3.min(fatalities), d3.max(fatalities)])
            .interpolator(d3.interpolateReds);


        let _this = this;

        let active = d3.select(null),
            width = this.width,
            height = this.height
        ;

        let map = d3.select("#map")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `0 0 ${this.width} ${this.height}`)
        ;


        let path = d3.geoPath().projection(this.projection);
        map.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .on("click", reset);
        let g = map.append('g')
            .classed('states', true)
        ;
        d3.json("us.json")
            .then((us) => {
                g.selectAll("path")
                    .data(topojson.feature(us, us.objects.states).features)
                    .enter()
                    .append("path")
                    .attr("fill", function (d) {
                        return colorScale(states[`s${parseInt(d.id)}`]);
                    })
                    .attr('id', function (d) {
                        return `s${parseInt(d.id)}`
                    })
                    .attr("d", path)
                    .on('click', zoom)
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

                g.append("path")
                    .datum(topojson.mesh(us, us.objects.states, function (a, b) {
                        return a !== b;
                    }))
                    .attr("class", "state-borders")
                    .attr("d", path)
                ;
            });

        function zoom(d) {
            if (active.node() === this) return reset();

            active.classed("active", false);
            active = d3.select(this).classed("active", true);

            let bounds = path.bounds(d),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = .9 / Math.max(dx / width, dy / height),
                translate = [width / 2 - scale * x, height / 2 - scale * y];
            _this.drawPoints(d.id, scale, translate);
            g.transition()
                .duration(750)
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
        }

        function reset() {
            let svg = d3.select('#map');
            svg.selectAll('g')
                .selectAll('circle')
                .remove()
            ;
            active.classed("active", false);
            active = d3.select(null);

            g.transition()
                .duration(750)
                .attr("transform", "");
            treemap.clearTreemap();
            parset.clearParset();
        }

        this.drawLegend(fatalities);
    }

}
