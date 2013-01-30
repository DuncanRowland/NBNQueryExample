
// testing simple example



//Width and height
var w = 500;
var h = 100;

var data;

jQuery.getJSON("http://biodiversity.org.au/apni.name/28354.json?callback=?", function(error, json){
  //if (error) return console.warn(error);
  data = json;
  alert(data[0]);
  visualizeit();
	console.log("hello");

	
});

function visualizeit(){
  				
	var svg = d3.select("body").append("svg");
	svg.attr("width", w)
	   .attr("height", h);

    svg.data(data[0]).selectAll("div")
	.enter().append("div")
	.text(function(d){ return "Helllllo";});	   
	   
}



