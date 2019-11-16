let map = new Map();
let treeMap = new TreeMap();


Promise.all([
    d3.csv("data/fatality-rate.csv"),
    d3.csv("data/fatalities-per-100-mvt.csv"),
    d3.csv("data/ACC_AUX.csv"),
    d3.csv("data/ACCIDENT.csv")
]).then(function(files) {
    map.drawMap(files[0]);
    treeMap.drawTreeMap(files[3]);
    console.log(files[0]);
    console.log(files[1]);
    // files[1] will contain file2.csv
}).catch(function(err) {
    console.log(err)
});
