let map,
    treemap,
    parset;
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
        d3.csv("fatality-rate.csv"),
        d3.csv("fatalities-per-100-mvt.csv"),
        d3.csv('accident2.csv', function (d) {
            d.id = `s${parseInt(d.STATE)}`;
            d.fatal = +d.FATALS;

            return d;
        })
    ]).then(function (files) {
        map = new StateMap(files[0], files[1], files[2], tooltip);
        map.drawMap();
        treemap = new TreeMap(files[2], tooltip);
        parset = new Parset(files[2]);
        spinner.stop();
    }).catch(function (err) {
        console.log(err);
        spinner.stop();
    });
}

function updateData() {
    let year = document.getElementById('year').value;
    let selected;
    if (document.getElementById('total').checked) {
        selected = 'total';
    }
    else
        selected = 'vmt';
    map.updateMap(year, selected)
}

init();