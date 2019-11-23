class TreeMap {

    constructor(data, tooltip) {
        this.data = data;
        this.nested_data = d3.nest()
        //.key(d => d.YEAR)
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
            .rollup(function(values) { return d3.sum(values, function(value) { return value.FATALS; })})

    .entries(data);

        this.width = 900;
        this.height =  600;
        this.tooltip = tooltip;


        this.treemapLayout = d3.treemap()
            .size([900, 600])
            .paddingOuter(10);
    }

    drawTreeMap() {


        var width = 900, height = 600;

        var svg = d3.select("#treeMap")
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        console.log("next");


        var root = d3.hierarchy({values: this.nested_data.entries(this.data)}, function(d) { return d.values; })
            .sum(function(d) { console.log(d.value); return d.value; })
            .sort(function(a, b) { return b.value - a.value ; });



        console.log("root.Desendents");
        console.log(root.descendants());


        this.treemapLayout(root);




        svg.selectAll('rect')
            .data(root.leaves())
            .enter()
            .append('rect')
            .attr("class", "rect")
            .attr('x', function(d) { return d.x0; })
            .attr('y', function(d) { return d.y0; })
            .attr('width', function(d) { return d.x1 - d.x0; })
            .attr('height', function(d) { return d.y1 - d.y0; });


        console.log(this.nested_data);
        console.log('########################');
        console.log(this.data);
        // let title = this.data[0]["YEAR"];
        // let state = this.data[0]["STATE"];
        // for (let i = 100; i < data.length; i += 100) {
        //     if (this.data[i]["STATE"] != state) {
        //         title = "Total";
        //         break;
        //     }
        // }

        // let format = d3.formatLocal({
        //     'groupings': [3],
        // })




       // }
        function type(d) {
            d['FATALS'] = +d.FATALS;
            d["PERSONS"] = +d.PERSONS;
            d['MONTH'] = +d.MONTH;
            d['HOUR'] = +d.HOUR;
            d['DAY_WEEK'] = +d.DAY_WEEK;
            return d;
        }
    }
}
