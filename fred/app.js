
// testing simple example


var dataset = [];                        //Initialize empty array
for (var i = 0; i < 5; i++) {           //Loop 25 times
    var newNumber = Math.random() * 30;  //New random number (0-30)
    dataset.push(newNumber);             //Add new number to array
}

//Width and height
var w = 500;
var h = 500;
				
var svg = d3.select("body").append("svg");
svg.attr("width", w)
   .attr("height", h);
   
var circles = svg.selectAll("circle")
                 .data(dataset)
                 .enter()
                 .append("circle");
				 
circles.attr("cx", function(d, i) {
            return (i * 50) + 25;
        })
       .attr("cy", h/2)
       .attr("r", function(d) {
            return d;
       })
	   .attr("fill", "yellow")
.attr("stroke", "orange")
.attr("stroke-width", function(d) {
    return d/2;
});			

var circle = svg.selectAll("circle")
    .data([32, 57, 150], String);

circle.enter().append("circle")
    .attr("cy", 90)
    .attr("cx", String)
    .attr("r", Math.sqrt);

circle.exit().remove();	 
   