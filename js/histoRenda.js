


function createHistogram(dados){

	var x = d3.scaleLinear()
          .domain([1,6])
          .rangeRound([0, width]);

	var y = d3.scaleLinear()
          .range([height, 0]);

	var histogram = d3.histogram()
    	.value(function(d) { return d.qtd; })
    	.domain(x.domain());

    var bins = histogram(dados);

    y.domain([0, d3.max(bins, function(d) { return d.qtd; })]);

    var svg = d3.select("body").select("#svgRenda");

    svg.selectAll("rect")
      .data(bins)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 1)
      .attr("transform", function(d) {
		  return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
      .attr("height", function(d) { return height - y(d.length); });

	  // add the x Axis
	svg.append("g")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x));

	  // add the y Axis
	svg.append("g")
	    .call(d3.axisLeft(y));
	
}


