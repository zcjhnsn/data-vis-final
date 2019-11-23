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
            .rollup(function (d) {
                return d3.sum(d, function (d) {
                    return d.FATALS;
                });
            })
            .entries(data);

        this.width = 500;
        this.height =  500;
        this.tooltip = tooltip;
    }

    drawTreeMap() {

        let title = this.data[0]["YEAR"];
        let state = this.data[0]["STATE"];
        for (let i = 100; i < data.length; i += 100) {
            if (this.data[i]["STATE"] != state) {
                title = "Total";
                break;
            }
        }

        // let format = d3.formatLocal({
        //     'groupings': [3],
        // })
        var width = 500, height = 500;

        var svg = d3.select("#treeMap")
            .append('svg')
            .attr('width', width)
            .attr('height', height);



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
