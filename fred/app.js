
// testing simple example



//Width and height
var w = 500;
var h = 100;

var dataset;

jQuery.getJSON("taxon.json", function(json, status){
  dataset = json[0];
  console.log(dataset);
  visualizeit();
});

function visualizeit(){

	links = dataset.LinksTo;

	d3.select("body").selectAll("p")
    .data(links)
    .enter()
    .append("p")
    .text(function(d){
		ret = "?";
		title ="";
		if(d.TaxonConceptRef){
			title = d.TaxonConceptRef.dcterms_title;
		}
		else if(d.TaxonNameRef){
			title = d.TaxonNameRef.dcterms_title;
		}
		if (d.LinkTo) {
			ret = d.LinkTo["link-type"] + " " + title;
		}
		
		return ret;
	});	   
	   
}



