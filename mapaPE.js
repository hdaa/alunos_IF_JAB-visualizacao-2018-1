var width = 500, height = 400;
var marginTop = 500, marginLeft = 400;


var map = L.map('mapid').setView([37.8, -96], 4);

var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

L.geoJSON(states).addTo(map);

/*var projection = d3.geoMercator() 
  .scale(1000)
  .translate([0,0]);



var path = d3.geoPath().projection(projection);



//d3.csv("aids.csv",function(aids){
  d3.json("regiao_recife.json",
      function(error,dados){
        console.log(dados);
        svg.append("path")
        .attr("d",path(dados))
        .attr("fill","#cccccc")
        .style("stroke","blue")
     ;
    });
//});*/

/*var width = 400, height = 350;
var marginTop = 50, marginLeft = 130;

var lowColor = '#f9f9f9'
var highColor = '#bc2a66'

var svg = d3.select("svg")
  .attr("width",width)
  .attr("height",height);

var projection = d3.geoMercator()
  .scale(width,height)
  .translate([width+marginLeft, marginTop]);

var path = d3.geoPath().projection(projection);


function changeYear(year){

  d3.csv("aids.csv",function(data){

  console.log(data[0]);
  var dataArray = [];
  for(var d = 0; d < data.length; d++){
    dataArray.push(data[d][year]);
  }

  
  var minVal = d3.min(dataArray);
  var maxVal = d3.max(dataArray);

  var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor]);
  d3.json("geoPEmun.json",
      function(json){
      console.log(json.features);

      svg.selectAll("path").remove();

     for (var i = 0; i < data.length; i++) {
      // Grab State Name
      var estado = data[i].UF;

      // valores pra cada ano  padrao eh 1990 
      var valorAno = data[i][year];
      // Find the corresponding state inside the GeoJSON
       for (var j = 0; j < json.features.length; j++) {
          var jsonState = json.features[j].properties.L1;

          if (estado == jsonState) {

            // Copy the data value into the JSON
            json.features[j].properties.value = valorAno;

            // Stop looking through the JSON
            break;
          }
        }
      }

      svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", function(d) { return ramp(d.properties.value) });
    });
  });

  document.getElementById("choosenYear").value = year;

}





*/