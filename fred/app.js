
// testing simple example



//Width and height
var width = Math.max( $(window).width() * 0.95, 960 ),  //width
    height = Math.max( $(window).height() * 0.95, 600 ); //height	
	
var charge = -80;
var gravity = 0.05;
var distance = height / 2.5;
var circ_size = 10;	


var h1 = d3.select("body").append("h1");
	
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
	.charge(charge)
	.gravity(gravity)
	.linkDistance(distance)
    .size([width-100, height]);	

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
  
  h1.text(root);
	
	// Create nodes for each target.
  links.forEach(function(link) {
    var ref = link.TaxonNameRef || link.TaxonConceptRef;
	
	console.log(link);
	
    link.source = nodeByName(root);
    link.target = nodeByName(ref.uriRef);
	link.type = link.LinkTo["link-type"];
	nodesByName[ref.uriRef].type = link.LinkTo["link-type"];
	nodesByName[ref.uriRef].title = ref.dcterms_title;
  });
  
  // Extract the array of nodes from the map by name.
  var nodes = d3.values(nodesByName);
  
  // Create the link lines.
  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("line")
      .attr("class", "link")
	  .attr("class", function(d) { return "link " + d.type; });
	  
// Create the node circles.
  var g = svg.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + d.x + ","+ d.y + ")"; })
      .call(force.drag); 	
	  
  g.append("svg:circle")
      .attr("r", circ_size);
  g.append("text")
   .attr("dx", 12)
   .attr("dy", ".35em")
   .text(function(d){ 
			return d.title;
		}
	);	  
	  
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

    g.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  }	 

  function nodeByName(name) {
    return nodesByName[name] || (nodesByName[name] = {name: name});
  }
  

}

