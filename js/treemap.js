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
                return d.depth === 1 ? '36px' : '18px';
            })
            .attr('fill', 'white')
            .attr('opacity', d => {
                return opacity(d.depth)
            })


        this.drawLegend()
    }

    drawLegend() {
        var sizes = [40, 30, 20, 10]
        var xs = [0, 42, 74, 96, 108]
        var ys = [0, 40, 70, 90]

        let colorScale = d3.scaleSequential()
            .domain([0, 4])
            .interpolator(d3.interpolateOrRd);

        var width = 140, height = 150

        var spacer = d3.select('#tmap').append('svg').attr('width', 10).attr('height', 10).attr('fill', 'black');

        var svg = d3.select('#tmap').append('svg').attr('width', width).attr('height', height);



        svg.selectAll('rectGroup').data(sizes)
            .enter()
            .append('rect')
            .attr('width', function(d) {
                return d
            }).attr('height', function(d) {
            return d
        }).attr('x', function(d) {
            return xs[sizes.indexOf(d)]
        }).attr('y', function(d) {
            return ys[sizes.indexOf(d)]
        }).style('fill', function(d) {
            return colorScale(sizes.length - sizes.indexOf(d))
        })

        svg.append('text')
            .text('More Fatal')
            .attr('y', 130)
            .attr('x', 30)

        svg.append('text')
            .text('More Fatal')
            .attr('transform', 'translate(120,20),rotate(90)')

        svg.append('svg:defs').append('svg:marker')
            .attr('id', 'triangle')
            .attr('refX', 6)
            .attr('refY', 6)
            .attr('markerWidth', 30)
            .attr('markerHeight', 30)
            .attr('markerUnits', 'userSpaceOnUse')
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0 0 12 6 0 12 3 6')
            .style('fill', 'black')

        svg.append('line')
            .attr('x1', 100)
            .attr('y1', 112)
            .attr('x2', 10)
            .attr('y2', 112)
            .attr('stroke-width', 1)
            .attr('stroke', 'black')
            .attr('marker-end', 'url(#triangle)')

        svg.append('line')
            .attr('x1', 115)
            .attr('y1', 92)
            .attr('x2', 115)
            .attr('y2', 12)
            .attr('stroke-width', 1)
            .attr('stroke', 'black')
            .attr('marker-end', 'url(#triangle)')
    }
}
