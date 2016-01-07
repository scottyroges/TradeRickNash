/**
 * Created by scottrogener on 1/1/16.
 */

var margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
//var margin = {top: 20, right: 20, bottom: 30, left: 60},
//    width = 500 - margin.left - margin.right,
//    height = 300 - margin.top - margin.bottom;

/*
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */

// setup x
var xValue = function(d) { return d.gPg;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");
//
//// setup y
var yValue = function(d) { return d.caphit;}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");
//
//// setup fill color
var cValue = function(d) { if(d.name === "Rick Nash") { return 5;} else {return d};},
    color = d3.scale.category10();
//
//// add the graph canvas to the body of the webpage
var psvg = d3.select("#gPg_playoffs").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var ptooltip = d3.select("#gPg_playoffs").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.json("/api/nhl/threeyears_playoffs_gPg", function(error, json) {
    var data = json.data;

    var regressiondata = [];

        data.forEach(function(d) {
            var point = [xValue(d),yValue(d)];
            regressiondata.push(point);

        });

    var lr = regression('linear', regressiondata);
    var x1 = 0;
    var x2 = .75;
    var y1 = (x1 * lr.equation[0]) + lr.equation[1];
    var y2 = (x2 * lr.equation[0]) + lr.equation[1];

    // don't want dots overlapping axis, so add in buffer to data domain
//    xScale.domain([d3.min(data, xValue)-10000, d3.max(data, xValue)+10000]);
//    yScale.domain([0, d3.max(data, yValue) +.1]);
    xScale.domain([0,.7 ]);
    yScale.domain([0, d3.max(data, yValue)+10000]);



    // x-axis
    psvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("gPg");

    // y-axis
    psvg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Cap Hit");

    psvg.append('line')
        .attr("class", "line")
        .attr('x1',xScale(x1))
        .attr('x2',xScale(x2))
        .attr('y1',yScale(y1))
        .attr('y2',yScale(y2));

    // draw dots
    psvg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) { return color(cValue(d));})
        .on("mouseover", function(d) {
            ptooltip.transition()
                .duration(200)
                .style("opacity", .9);
            ptooltip.html(d.name + "<br/> (" + xValue(d)
                + ", " + yValue(d) + ")")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            ptooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });


});
