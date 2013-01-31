
// testing simple example



//Width and height
var width = 960,
    height = 500;
	
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
	.charge(-100)
	.gravity(.05)
	.linkDistance(100)
    .size([width, height]);	

var dataset;
var nodesByName = {}; 

jQuery.getJSON("taxon.json", function(json, status){
  dataset = json[0];
  console.log(dataset);
  visualizeit();
});
 

 
 
function visualizeit(){

  links = dataset.LinksTo;
  root = dataset.uri
	
	// Create nodes for each target.
  links.forEach(function(link) {
    var ref = link.TaxonNameRef || link.TaxonConceptRef;
    link.source = nodeByName(root);
    link.target = nodeByName(ref.uriRef);
  });
  
  // Extract the array of nodes from the map by name.
  var nodes = d3.values(nodesByName);
  
  // Create the link lines.
  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("line")
      .attr("class", "link");
	  
// Create the node circles.
  var node = svg.selectAll(".node")
      .data(nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .call(force.drag);

  // Start the force layout.
  force
      .nodes(nodes)
      .links(links)
      .on("tick", tick)
      .start();

	  
  function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }	 

  function nodeByName(name) {
    return nodesByName[name] || (nodesByName[name] = {name: name});
  }

}

