class TreeMap{

    constructor(){

    }

    drawTreeMap(data){

        let title = data[0]["YEAR"];
        let state = data[0]["STATE"];
        for(let i = 100; i < data.length; i+=100) {
            if (data[i]["STATE"] != state) {
                title = "Total";
                break;
            }
        }
        let dataTree = this.generateTree(data);
        console.log(dataTree);


        new d3.treemap()
            .data(data)
            .groupBy(["MONTH", "DAY_WEEK", "HOUR"])
            .sum("FATALS")
            .render();

        var treeMapLayout = d3.treemap();

        treeMapLayout.size(500,500)
            .paddingOuter(10);

        treeMapLayout(dataTree);

        let treeMap = d3.select('#treeMap')
            .append('g')
            .append('rect');

        treeMap.selectAll('rect')
            .data(() => root.descendents().deaths/root.descendents().persons)
            .enter()
            .append('rect')
            .attr('x', (d) => d.x0)
            .attr('y', (d) => d.y0)
            .attr('width', (d) => d.x1-d.x0)
            .attr("height", (d) => d.y1-d.y2);

         console.log(dataTree)

    }



    generateTree(data){
        let root = new TreeNode(0, 0, null, 'root');
        for(let i = 0; i < 12; i++){
            let month = new TreeNode(0, 0, root.id, `m${i}`);
            for(let j = 0; j < 7; j++){
                let day = new TreeNode(0, 0, month.id, `d${i}`);
                for(let k = 0; k <= 24; k++){
                    day.descendents.push(new TreeNode(0, 0, day.id, `h${i}`))
                }
                month.descendents.push(day);
            }
            root.descendents.push(month);
        }
        let badData = 0;


        data.forEach(item => {
            if (parseInt(item["MONTH"]) !== 99 && parseInt(item["DAY_WEEK"]) !== 9) {
                let deaths = parseInt(item["FATALS"]);
                let persons = parseInt(item["PERSONS"]);

                root.deaths += deaths;
                root.total += persons;

                root.descendents[parseInt(item["MONTH"]) - 1].deaths += deaths;
                root.descendents[parseInt(item["MONTH"]) - 1].total += persons;

                //console.log(item);
                root.descendents[parseInt(item["MONTH"]) - 1].descendents[parseInt(item["DAY_WEEK"]) - 1].deaths += deaths;
                root.descendents[parseInt(item["MONTH"]) - 1].descendents[parseInt(item["DAY_WEEK"]) - 1].total += persons;

                if (parseInt(item["HOUR"]) >= 0 && parseInt(item["HOUR"]) < 24) {
                    root.descendents[parseInt(item["MONTH"]) - 1].descendents[parseInt(item["DAY_WEEK"]) - 1].descendents[parseInt(item["HOUR"])].deaths += deaths;
                    root.descendents[parseInt(item["MONTH"]) - 1].descendents[parseInt(item["DAY_WEEK"]) - 1].descendents[parseInt(item["HOUR"])].total += persons;
                } else if(parseInt(item["HOUR"]) === 24) {
                    root.descendents[parseInt(item["MONTH"]) - 1].descendents[parseInt(item["DAY_WEEK"]) - 1].descendents[0].deaths += deaths;
                    root.descendents[parseInt(item["MONTH"]) - 1].descendents[parseInt(item["DAY_WEEK"]) - 1].descendents[0].total += persons;
                } else {
                    //24 is an unknown time of day the accident took place.
                    root.descendents[parseInt(item["MONTH"]) - 1].descendents[parseInt(item["DAY_WEEK"]) - 1].descendents[24].deaths += deaths;
                    root.descendents[parseInt(item["MONTH"]) - 1].descendents[parseInt(item["DAY_WEEK"]) - 1].descendents[24].total += persons;
                }


            } else { badData++; }
        });
        console.log(root);


        // let returnRoot = new CustomTreeNode(root.deaths/root.total, null);
        // root.descendents.forEach(i =>{
        //     let month = new CustomTreeNode(i.deaths/i.total, returnRoot);
        //     i.descendents.forEach(j => {
        //         let day = new CustomTreeNode(j.deaths/j.total, month);
        //         j.descendents.forEach(k => {
        //             day.descendents.push(new CustomTreeNode(k.deaths/k.total, day))
        //         });
        //         month.descendents.push(day);
        //     });
        //     root.descendents.push(month);
        // });
        //console.log(`return root: ${returnRoot}`);
        return root;
    }


}

class TreeNode {
    constructor(deaths, total, parent, name) {
        this.deaths = deaths;
        this.total = total;
        this.data =
        this.parent = parent;
        this.descendents = [];
        this.id = name;
    }
}
class CustomTreeNode {
    constructor(data, parent) {
        this.data = data;
        this.parent = parent;
        this.descendents = [];
    }
}