class TreeMap {

    constructor() {

    }

    drawTreeMap(data) {

        let title = data[0]["YEAR"];
        let state = data[0]["STATE"];
        for (let i = 100; i < data.length; i += 100) {
            if (data[i]["STATE"] != state) {
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


        // Add, remove or change the key values to change the hierarchy.
        var nested_data = d3.nest()
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
        console.log("nested data: ", nested_data);

        // var format = d3.formatLocale({
        //     decimal: ".",
        //     thousands: ",",
        //     grouping: [3],
        //     fatals: ["Fatalities", ""]
        // }).format("$,d");


        var treemap = d3.treemap()
            .size([width, height])
            .padding(1)
            .round(true);

        d3.csv("data/ACCIDENT.csv", type, function (error, data) {
            //console.log(error);

            //     var root = d3.hierarchy({values: nested_data.entries(data)}, function(d) { return d.values; })
            //         .sum(function(d) { return d.value; })
            //         .sort(function(a, b) { return b.value - a.value; });
            //
            //     treemap(root);
            //
            //     var node = d3.select("#treeMap")
            //         .selectAll(".node")
            //         .data(root.leaves())
            //         .enter().append("div")
            //         .attr("class", "node")
            //         .style("left", function(d) { return d.x0 + "px"; })
            //         .style("top", function(d) { return d.y0 + "px"; })
            //         .style("width", function(d) { return d.x1 - d.x0 + "px"; })
            //         .style("height", function(d) { return d.y1 - d.y0 + "px"; });
            //
            //     node.append("div")
            //         .attr("class", "node-label")
            //         .text(function(d) { d.data.key; });
            //
            //     node.append("div")
            //         .attr("class", "node-value")
            //         .text(function(d) { return parseInt(d.value); });
            // });
            if (error) throw error;
            var root = stratify(data)
                .sum(function (d) {
                    return d.value;
                });
                // .sort(function (a, b) {
                //     return b.value - a.value;
                // });

            treemap(root);

            var cell = svg
                .selectAll(".node")
                .data(root.descendants())
                .enter().append("g")
                .attr("transform", function (d) {
                    return "translate(" + d.x0 + "," + d.y0 + ")";
                })
                .attr("class", "node")
                .each(function (d) {
                    d.node = this;
                })
                // .on("mouseover", hovered(true))
                // .on("mouseout", hovered(false));
            cell.append("rect")
                .attr("id", function (d) {
                    return "rect-" + d.id;
                })
                .attr("width", function (d) {
                    return d.x1 - d.x0;
                })
                .attr("height", function (d) {
                    return d.y1 - d.y0;
                })
                .style("fill", function (d) {
                    return color(d.depth);
                });
            cell.append("clipPath")
                .attr("id", function (d) {
                    return "clip-" + d.id;
                })
                .append("use")
                .attr("xlink:href", function (d) {
                    return "#rect-" + d.id + "";
                });
            var label = cell.append("text")
                .attr("clip-path", function (d) {
                    return "url(#clip-" + d.id + ")";
                });
            label
                .filter(function (d) {
                    return d.children;
                })
                .selectAll("tspan")
                .data(function (d) {
                    return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).concat("\xa0" + format(d.value));
                })
                .enter().append("tspan")
                .attr("x", function (d, i) {
                    return i ? null : 4;
                })
                .attr("y", 13)
                .text(function (d) {
                    return d;
                });
            label
                .filter(function (d) {
                    return !d.children;
                })
                .selectAll("tspan")
                .data(function (d) {
                    return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).concat(format(d.value));
                })
                .enter().append("tspan")
                .attr("x", 4)
                .attr("y", function (d, i) {
                    return 13 + i * 10;
                })
                .text(function (d) {
                    return d;
                });
            cell.append("title")
                .text(function (d) {
                    return d.id + "\n" + format(d.value);
                });
        });
        //
        // function hovered(hover) {
        //     return function (d) {
        //         d3.selectAll(d.ancestors().map(function (d) {
        //             return d.node;
        //         }))
        //             .classed("node--hover", hover)
        //             .select("rect")
        //             .attr("width", function (d) {
        //                 return d.x1 - d.x0 - hover;
        //             })
        //             .attr("height", function (d) {
        //                 return d.y1 - d.y0 - hover;
        //             });
        //     };



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
