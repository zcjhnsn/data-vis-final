class TreeMap {

    constructor(data, tooltip) {
        this.data = data;
    }

    clearTreemap(){
        d3.select('#treeMap')
            .selectAll('g')
            .remove()
        ;
        d3.select('#treeMap')
            .selectAll('text')
            .remove()
        ;
        document.getElementById('tmapHeading').innerHTML = ''
    }

    drawTreeMap(data, state) {
        this.clearTreemap();
        document.getElementById('tmapHeading').innerHTML = `Date and Times of all Fatalities for ${codes['State'][state]}`;
        let fatals = 0;
        data.forEach(function (d) {
            d['FATALS'] = +d.FATALS;
            d["PERSONS"] = +d.PERSONS;
            d['month'] = codes['MONTH'][+d.MONTH];
            d['HOUR'] = +d.HOUR;
            d['day_week'] = codes['DAY_WEEK'][+d.DAY_WEEK];
            d['weather'] = codes['WEATHER'][+d.WEATHER];
            fatals += +d.FATALS;
        });

        let nest = d3.nest()
            .key(function (d) {
                return d.month;
            })
            .key(function (d) {
                return d.day_week;
            })
            .key(function (d) {
                return d.HOUR;
            })
            //.rollup(function(leaves) { return {"length": leaves.length, "total_fatal": d3.sum(leaves, function(d) {return parseInt(d.FATALS);})} })
            // .rollup(function (d) {
            //     return d3.sum(d, function (d) {
            //         return d.FATALS;
            //     });
            //})
            .rollup(function (values) {
                return d3.sum(values, function (value) {
                    return value.FATALS;
                })
            });

        let colorScale = d3.scaleSequential()
            .domain([0, fatals/12])
            .interpolator(d3.interpolateOrRd);

        let opacity = d3.scaleLinear()
            .domain([0, 3])
            .range([1, .5, .25])
        ;
        let width = 960,
            height = 600;

        let treemapLayout = d3.treemap()
            .size([width, height])
            .paddingOuter(10);

        let root = d3.hierarchy({values: nest.entries(data)}, function (d) {
            return d.values;
        })
            .sum(function (d) {
                return d.value;
            })
            .sort(function (a, b) {
                return b.value - a.value;
            });

        treemapLayout(root);
        let map = d3.select('#treeMap')
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", `0 0 ${width} ${height}`)
            ;

            map.append('g')
                .selectAll('rect')
                .data(root.descendants())
                .enter()
                .append('rect')
                .attr("class", "rect")
                .attr('x', function (d) {
                    return d.x0;
                })
                .attr('y', function (d) {
                    return d.y0;
                })
                .attr('width', function (d) {
                    return d.x1 - d.x0;
                })
                .attr('height', function (d) {
                    return d.y1 - d.y0;
                })
                .style('fill', function (d) {
                    if (d.depth === 3 || d.depth === 2)
                        return colorScale(d.parent.value);
                    else
                        return colorScale(d.value)
                })
                .style('opacity', function (d) {
                    return opacity(d.depth)
                })
            ;
            map.selectAll('text')
                .data(root.leaves())
                .enter()
                .append('text')
                .attr("x", function(d){ return d.x0+5})
                .attr("y", function(d){ return d.y0+20})
                .text(function (d) {
                    return d.data.key > 12 ? d.data.key - 12 + ' PM' : d.data.key + ' AM';
                })
                .attr('font-size', '10px')
                .attr('opacity', d => {return opacity(d.depth)})
        ;
            map.selectAll("titles")
                .data(root.descendants().filter(function(d){return d.depth === 1 || d.depth === 2}))
                .enter()
                .append("text")
                .attr("x", function(d){ return d.x0 - 18 + (d.x1 - d.x0) / 2})
                .attr("y", function(d){ return d.y0 + (d.y1 - d.y0) / 2})
                .text(function(d){ return d.data.key })
                .attr('font-size', d => {
                    return d.depth === 1 ? '32px' : '18px';
                })
                .attr('fill', 'white')
                .attr('opacity', d => {
                    return opacity(d.depth)
                })
    }
}
