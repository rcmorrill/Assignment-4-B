console.log("Assignment 4-B");

var margin = {t:50,r:100,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var canvas = d3.select('.canvas');
var plot = canvas
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');


//Scales
var scaleX = d3.scale.linear().domain([1960,2015]).range([0,width]),
    scaleY = d3.scale.linear().domain([0,11000000]).range([height,0]);

//Axis
var axisX = d3.svg.axis()
    .orient('bottom')
    .scale(scaleX)
    .tickFormat( d3.format('d') ); //https://github.com/mbostock/d3/wiki/Formatting
var axisY = d3.svg.axis()
    .orient('right')
    .tickSize(width)
    .scale(scaleY);

//Draw axes
plot.append('g').attr('class','axis axis-x')
    .attr('transform','translate(0,'+height+')')
    .call(axisX);
plot.append('g').attr('class','axis axis-y')
    .call(axisY);

var lineGenerator = d3.svg.line()
    .x(function(d) { return scaleX(d.year);})
    .y(function(d) { return scaleY(d.value);})
    //.interpolate("step-before");

//Start importing data

queue()
    .defer(d3.csv,'data/fao_combined_world_1963_2013.csv',parse)
    .defer(d3.csv,'data/metadata.csv',parseMetadata)
    .await(dataLoaded)

function dataLoaded(err,data,metadata){

    var nestedData = d3.nest()
        .key(function(d) {return d.bevType})
        .entries(data);

    console.log(nestedData);
 

 /*nestedData.forEach(function(t){
        console.log(t.key);

        t.bevType = t.key; 
        t.totalProduction = 
        t.totalProduction = function(t){
            var total = 0;
            t.values.forEach(function(each) {
                total = total + each.value;

            })
            return total;
        };
    });*/


 /* nestedData.sort(function(a,b){
        return b.year - a.year;
    })*/

//tea


plot.append('path')
    .attr('class','tea-data-line data-line')
    .datum(nestedData[0].values)
    .attr('d',lineGenerator);



plot.append('path')
    .attr('class','coffee-data-line data-line')
    .datum(nestedData[1].values)
    .attr('d',lineGenerator);

/*var chart = plot.selectALl('.line'),
    .data(nestedData),
    .enter()
    .append('line')*/


plot.selectAll('.circle')
    .data(data)
    .enter()


data.on('mouseenter', function(d){
                console.log('enter');
                console.log(d.year);

        var tooltip = d3.select('.custom-tooltip');

            tooltip.
                transition()
                .style('opacity',1);

            tooltip.select('#type').html(d.bevType);
            tooltip.select('#year').html(d.year);
            tooltip.select('#value').html(d.value);
        })
    .on('mouseleave', function(d){
            d3.select('.custom-tooltip')
                .transition()
                .style('opacity',0);
        })
    .on('mousemove', function(d){
            var xy = d3.mouse(document.getElementById('plot'));
            //this finds the xy of the mouse in relation to this element
            console.log(xy);
            d3.select('.custom-tooltip').style('opacity',1);

            var left = xy[0], top = xy[1];

            d3.select('.custom-tooltip')
                .style('left', left + -40 + 'px')
                .style('top', top + 30 + 'px');
        })
}
function parse(d){

    return {
        value: +d.Value,
        year: +d.Year,
        bevType: d.ItemName,
    }
}

function parseMetadata(d){
}
