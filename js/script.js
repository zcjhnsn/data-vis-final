let map;
let opts = {
    lines: 9, // The number of lines to draw
    length: 9, // The length of each line
    width: 5, // The line thickness
    radius: 14, // The radius of the inner circle
    color: '#2d65bd', // #rgb or #rrggbb or array of colors
    speed: 1.9, // Rounds per second
    trail: 40, // Afterglow percentage
    className: 'spinner', // The CSS class to assign to the spinner
};
let spinnerConfig = {
    target : 'spinner',
    width: 900,
    height: 450,
    val: 90
};
let target = document.getElementById(spinnerConfig.target);

function init() {
    let spinner = new Spinner(opts).spin(target);
    let tooltip = new Tooltip();

    Promise.all([
        d3.csv("data/fatality-rate.csv"),
        d3.csv("data/fatalities-per-100-mvt.csv"),
        d3.csv('data/ACCIDENT.csv', function (d) {
            d.id = `s${parseInt(d.STATE)}`;
            d.fatal = +d.FATALS;

            return d;
        })
    ]).then(function (files) {
        map = new StateMap(files[0], files[2], tooltip);
        map.drawMap();
        // console.log(files[0]);
        // console.log(files[1]);
        spinner.stop();
    }).catch(function (err) {
        console.log(err);
        spinner.stop();
    });
}

function updateData() {
    let selected = document.getElementById('year').value;
    map.updateMap(selected)
}

init();