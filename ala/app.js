// calculate window size
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementById("viz"),
    x = g.clientWidth || w.innerWidth || e.clientWidth,
    y = w.innerHeight|| e.clientHeight || g.clientHeight;

var width = Math.max( x * 0.9, 400 ),  //width
    height = Math.max( y * 0.9, 300 ), //height
    format = d3.format(",d"),
    fill = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([width, height])
	.padding(5);

 
var chart = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "bubble");


$(document).ready(function() {
var rows, mapped;
    $("#searchvalue").typeahead({
        minLength: 3,
		items: 20,
        source: function(query, process) {
            $.getJSON('http://bie.ala.org.au/search/auto.jsonp?callback=?', { q: query, limit: 100, idxType: "TAXON", geoOnly: "true"}, function(data) {
			
				rows = new Array();
				mapped = {};
				$.each(data.autoCompleteList, function(i, name){
					var query_label = name.matchedNames[0];
					mapped[query_label] = {rankString: name.rankString, guid: name.guid};
					
					rows.push(query_label);
				});
				//data = data.autoCompleteList;
				//for(var i=0; i<data.length; i++){
				//	rows[i] = data[i].matchedNames[0];
				//}
                process(rows);
            });
        },
		updater: function(query_label){
			var rankString = mapped[query_label].rankString;
			$("#searchtype").val(rankString);
			
			console.log(rankString + ":" + query_label + ":" + mapped[query_label].guid);
			
			doChart(mapped[query_label].guid);
						
			return query_label;			
		}
    });

});
	


function doChart(query, facet){

	var url;

	if( (/^urn:/i).test(query) ){
		query = 'lsid:"' + query + '"';
	}

	url = "http://biocache.ala.org.au/ws/occurrences/search.json?fsort=count&facets=genus&facets=collector&callback={callback}&q=" + query;
		
	d3.jsonp( url , function(json){	
	//d3.json("taxon.json", function(json){
		
		// remove old nodes if there are some
		var nodeStringLenth = d3.selectAll("g.node").toString().length; 
		if ( nodeStringLenth > 0) {
			d3.selectAll("g.node")
				.remove();
		}

		res = json.facetResults[0].fieldResult;	
		stuff = clean(res);
		console.log(stuff);
		var node = chart.selectAll("g.node")
			.data(bubble.nodes(stuff));
			
		node.enter().append("svg:g")
				.attr("class", "node")
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		
		node.attr("r", function(d) { return d.r });		
				
		node.append("svg:title")
			.text(function(d) { return d.taxon + ": " + format(d.value); });
		 
		node.append("svg:circle")
			.attr("r", function(d) { return d.r; })
			.style("fill", function(d) { return d.children ? "#fff" : fill(d.taxon); });
		 
		node.append("svg:text")
			.attr("text-anchor", "middle")
			.attr("dy", ".3em")
			.text(function(d) {  return d.taxon.substring(0, d.r/3); });
			
			console.log(node);
			node.exit().remove();
		
		
	});
	
	

}

function updateView(view){
// changes the chart view to something else

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





 
   