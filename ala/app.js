// calculate window size
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementById("container"),
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

var width = Math.max( x * 0.85, 400 ),  //width
    height = Math.max( y * 0.85, 300 ), //height
    format = d3.format(",d"),
    fill = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([width, height])
	.padding(5);

 
var chart = d3.select("#viz").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "bubble");


$(document).ready(function() {
    $("#searchfield").typeahead({
        minLength: 3,
        source: function(query, process) {
            $.getJSON('http://bie.ala.org.au/search/auto.jsonp?callback=?', { q: query, limit: 10 }, function(data) {
				var rows = new Array();
				data = data.autoCompleteList;
				for(var i=0; i<data.length; i++){
					rows[i] = data[i].matchedNames[0];
				}

                process(rows);

            });
        }
    });
	doChart("Rutaceae");
});
	

function doChart(tax){
	
//d3.jsonp("http://biocache.ala.org.au/ws/occurrences/search.json?fsort=count&facets=genus&facets=collector&callback={callback}&q=family:" + tax  , function(json){	
d3.json("taxon.json", function(json){

res = json.facetResults[0].fieldResult;	
stuff = clean(res);
var node = chart.selectAll("g.node")
    .data(bubble.nodes(stuff))
    .enter().append("svg:g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
 
node.append("svg:title")
    .text(function(d) { return d.taxon + ": " + format(d.value); });
 
node.append("svg:circle")
    .attr("r", function(d) { return d.r; })
    .style("fill", function(d) { return d.children ? "#fff" : fill(d.taxon); });
 
node.append("svg:text")
    .attr("text-anchor", "middle")
    .attr("dy", ".3em")
    .text(function(d) {  return d.taxon.substring(0, d.r/3); });
});

}
function clean(result){
        var classes = [];
        for (var key in result)
        {
			
           if (result.hasOwnProperty(key))
           {
                  // here you have access to
                  var tax = result[key].label;
				  var num = result[key].count;
                  if (tax.length && num){
                        classes.push({taxon: tax, value: num});
                  }
           }
        }
		//
        return {taxon: "", children: classes};

}


function buildURL(tax, other){
        // TO DO
        var url = "http://google.com?q="+tax;
        return url;
}

function updateWindow(){
    x = w.innerWidth || e.clientWidth || g.clientWidth;
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    chart.attr("width", x).attr("height", y);
}
window.onresize = updateWindow;




 
   