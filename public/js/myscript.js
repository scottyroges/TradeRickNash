/**
 * Created by scottrogener on 12/30/15.
 */

//$.ajax({
//    url: "/api/nhl/threeyears_reg_gPg",
//    cache: false
//})
//    .done(function( json ) {
//        var data= [];
//        console.log(json);
//        for(var i = 0; i < json.data.length; i++){
//            var obj = [json.data[i].gPg, json.data[i].caphit];
//            console.log(obj);
//            data.push(obj);
//        }
//        createScatterPlot(data);
//    });
//
//function createScatterPlot(array){
//    google.load("visualization", "1", {packages:["corechart"]});
//    google.setOnLoadCallback(drawChart);
//    function drawChart() {
//        var data = new google.visualization.DataTable();
//        data.addColumn('number', 'Goals Per Game');
//        data.addColumn('number', 'Salary');
//        data.addRows(array);
//
//        var options = {
//            title: 'Goals/Game vs. Salary in the Regular Season (3 years)',
//            hAxis: {title: 'GPG'},
//            vAxis: {title: 'Salary'},
//            legend: 'none'
//        };
//
//        var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
//
//        chart.draw(data, options);
//    }
//};
//
//createScatterPlot([]);


