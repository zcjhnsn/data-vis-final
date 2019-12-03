class Parset {
    constructor(data) {
        this.data = data;
        this.chart = d3.parsets()
            .dimensions(["Drunk Drivers","Vehicles Involved", "Accident Type", "People Involved", 'FATALS'])
        ;

        this.width = 960;
        this.height = 600;

        this.parset = d3.select("#parsets").append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `0 0 ${this.width} ${this.height}`)
        ;

    }

    clearParset() {
       d3.select('#parsets')
           .selectAll('g')
           .remove()
        ;
        document.getElementById('parsetHeading').innerHTML = '';
    }

    drawParset(data) {
        data.forEach(d => {
            d['Accident Type'] = codes['Accident Type'][+d['Accident Type']]
        });
        document.getElementById('parsetHeading').innerHTML = 'Additional Information about each fatality';
        this.parset.datum(data)
            .call(this.chart)
        ;
    }
}