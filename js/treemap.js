class TreeMap {

    constructor(data, tooltip) {
        this.data = data;
    }

    drawTreeMap() {
        var data = this.data;

        data.forEach(function (d) {
            d['FATALS'] = +d.FATALS;
            d["PERSONS"] = +d.PERSONS;
            d['MONTH'] = +d.MONTH;
            d['HOUR'] = +d.HOUR;
            d['DAY_WEEK'] = +d.DAY_WEEK;
        });

        var nest = d3.nest()
            .key(function (d) {
                return d.MONTH;
            })
            .key(function (d) {
                return d.DAY_WEEK;
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


        var treemapLayout = d3.treemap()
            .size([1300, 1000])
            .paddingOuter(10);

        var root = d3.hierarchy({values: nest.entries(data)}, function (d) {
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
            .attr('width', 1300)
            .attr('height', 1000)
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
            });

    }
}
