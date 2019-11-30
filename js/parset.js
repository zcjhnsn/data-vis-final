class Parset {
    constructor(data) {
        this.data = data;
        this.chart = d3.parsets()
            .dimensions(["Drunk Drivers","Vehicles Involved", "Accident Type", "People Involved", 'FATALS'])
        ;

        this.parset = d3.select("#parsets").append("svg")
            .attr("width", this.chart.width())
            .attr("height", this.chart.height())
        ;


    }

    drawParset(data) {
        this.parset
            .datum(data)
            .call(this.chart)
        ;
    }
}