

//Width and height
var stuff = { children:[
    {taxon:"TVI",  label:"aa", value:2000},
    {taxon:"Boronia",  label:"aa", value:1520},
    {taxon:"RTP1", label:"bb", value: 800},
    {taxon:"RTP2", label:"bb", value: 150}
]};

var width = 1100,
	height = 800,
    format = d3.format(",d"),
    fill = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([width, height])
	.padding(5);

	
 
var chart = d3.select("body").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "bubble");

	
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
    .text(function(d) { console.log(d); return d.taxon.substring(0, d.r/3); });

	
});
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
		console.log({children: classes});
        return {taxon: "", children: classes};

}


function buildURL(tax, other){
        // TO DO
        var url = "http://google.com?q="+tax;
        return url;
}

 
   