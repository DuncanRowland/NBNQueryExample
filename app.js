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

var search_current = "";
var search_facet = "species";

var facets = ['genus', 'species', 'collector', 'year', 'state'];

var facet_limit = 50;

var fulldata;

$(document).ready(function() {

// set up some of the UI
$("#waiting").hide();
$("a.facet").addClass("disabled");
$("a.facet").click(function(e) {
    e.preventDefault();
});

var rows, mapped;
    $("#searchvalue").typeahead({
        minLength: 3,
		items: 20,
        source: function(query, process) {
            //DUNCAN - changed url to nbnatlas
            //$.getJSON('http://bie.ala.org.au/search/auto.jsonp?callback=?',
            ////
            $.getJSON('https://species-ws.nbnatlas.org/search/auto.jsonp?callback=?',
		      { q: query, limit: 100, idxType: "TAXON", geoOnly: "true"}, 
		      function(data) {
			
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
			
			//console.log(rankString + ":" + query_label + ":" + mapped[query_label].guid);
			$("#splash").hide();

			search_current = rankString;
			
			$("#waiting").show();
	
			doChart(mapped[query_label].guid, rankString);
			
			//$("a.facet").removeClass("disabled");
			//$("a[href='taxon']").addClass("btn-primary");
						
			return query_label;			
		}
    });


    // add listener to buttons
    $("button.facet").on('click', function () {
		f = $(this).attr('value').toLowerCase();
		//$("a.facet").removeClass("btn-primary");
		//$(this).addClass("btn-primary");
		
		updateView(f);
		
		return false;
    });

});
	


function doChart(query, facet){

	//console.log("doChart - query: " + query + ", facet: " + facet);

	search_current = facet;

	var url;

        //DUNCAN - Hack to change query field
        if( (/^NHMSYS*/i).test(query) ){
           if(facet=='species'){facet = 'species_guid';}
        }
        if( (/^NBNSYS*/i).test(query) ){
           if(facet=='genus'){facet = 'genus_guid';}
        }
        ////

	if( (/^urn:/i).test(query) ){
		query = 'lsid:"' + query + '"';
	}
	else{
		query = facet + ':"' + query + '"';
	}

        //DUNCAN - changed url to nbnatlas and q->fq
	//url = "http://biocache.ala.org.au/ws/occurrences/search.json?fsort=count&facets=genus&facets=species&facets=collector&facets=year&facets=state&callback={callback}&flimit=" + facet_limit + "&q=" + query;
        ////
        url = "https://records-ws.nbnatlas.org/occurrences/search.json?fsort=count&facets=genus&facets=species&facets=collector&facets=year&facets=class&callback={callback}&flimit="+facet_limit+"&q=*:*&fq="+query;

	d3.jsonp( url , function(json){	
	//d3.json("taxon.json", function(json){
		
		fulldata = json;		
	
		// remove old nodes if there are some
		var nodeStringLenth = d3.selectAll("g.node").toString().length; 
		if ( nodeStringLenth > 0) {
			d3.selectAll("g.node")
				.remove();
		}

		// a bit of logic to show the lower ranks if we are faceting on taxon
		switch(search_current){
			case "family":
				search_facet = "genus";
				break;
			case "genus":
				search_facet = "species";
		}

		index = jQuery.inArray(search_facet, facets);
		index = index >= 0 ? index : 0;

		res = json.facetResults[index].fieldResult;	
		current_facet = json.facetResults[index].fieldName;

		//update the page title
                //DUNCAN - put query as title
		//jQuery("#queryTitle").html(json.queryTitle);
                ////
                jQuery("#queryTitle").html(decodeURIComponent(json.query));
		//console.log(json.queryTitle);

		stuff = clean(res);
		//console.log(stuff);
		var node = chart.selectAll("g.node")
			.data(bubble.nodes(stuff));
			
		node.enter().append("svg:g")
				.attr("class", "node")
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		
		node.append("svg:title")
		.text(function(d) { return d.taxon + ": " + format(d.value); });

		//node.append("a").attr("xlink:href", function(d) { return buildURL(d.taxon, d.value); })	
		//.attr("r", function(d) { return d.r })		
		node.append("svg:circle")
			.attr("r", function(d) { return d.r; })
			.style("fill", function(d) { return d.children ? "#fff" : fill(d.taxon); });
		 
		node.append("svg:text")
			.attr("text-anchor", "middle")
			.attr("dy", ".3em")
			.text(function(d) {  return d.taxon.substring(0, d.r/3); })

		//add interactions
		node.on('click', function(d,i){
			
						
			$("#waiting").show();				
			doChart(d.taxon, current_facet);
			
			
		});
		
		node.exit().remove();
		
		$("#waiting").hide();		
	});
	
	

}

function updateView(view){
// changes the chart view to something else

	//bork if there is nothing to update
	if(search_current.length == 0){
		return false;
	}	

	$("#waiting").show();
	
			// remove old nodes if there are some
		var nodeStringLenth = d3.selectAll("g.node").toString().length; 
		if ( nodeStringLenth > 0) {
			d3.selectAll("g.node")
				.remove();
		}

      index = jQuery.inArray(view, facets);
      index = index >= 0 ? index : 0;

      res = fulldata.facetResults[index].fieldResult;
      current_facet = fulldata.facetResults[index].fieldName;
	  
	  //jQuery("#queryTitle").html(fulldata.queryTitle);

      stuff = clean(res);
      node = chart.selectAll("g.node")
                 .data(bubble.nodes(stuff));

		node.enter().append("svg:g")
				.attr("class", "node")
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		
		node.append("svg:title")
		.text(function(d) { return d.taxon + ": " + format(d.value); });

		//node.append("a").attr("xlink:href", function(d) { return buildURL(d.taxon, d.value); })	
		//.attr("r", function(d) { return d.r })		
		node.append("svg:circle")
			.attr("r", function(d) { return d.r; })
			.style("fill", function(d) { return d.children ? "#fff" : fill(d.taxon); });
		 
		node.append("svg:text")
			.attr("text-anchor", "middle")
			.attr("dy", ".3em")
			.text(function(d) {  return d.taxon.substring(0, d.r/3); })

		//add interactions
		node.on('click', function(d,i){
			$("input#searchvalue").val('');
			doChart(d.taxon, current_facet);
		});
		

		
		$("#waiting").hide();
		


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


