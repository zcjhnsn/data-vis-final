class TreeMap{

    constructor(){

    }

    drawTreeMap(data){
        let treeMap = d3.select('#treeMap')
            .attr('width', 500)
            .attr('height', 500)
            .append('g')
            .attr('transform',
                'translate(' + margin.left + ',' + margin.top + ')');



    }


}