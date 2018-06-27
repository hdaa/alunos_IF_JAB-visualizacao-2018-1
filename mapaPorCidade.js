
 function getColor(d) {
    return d > 50  ? '#E31A1C' :
           d > 15  ?  '#FC4E2A' :
           d > 10  ? '#FD8D3C' :
           d > 0   ? '#FEB24C' :
                     '#FFEDA0';
}

var dados = "";
var polygon = "", tile = "";

function createCircle(coords, size){
	
	//console.log(coords);
	var circle = L.circle(coords, {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5,
		radius: size*100
	});
	
	return circle;
}

/*Função que cira um marcador indicando onde fica o Campus no periodo selecionado*/
function createMarker(periodo){
	var coord;
	
	if(periodo == "20162" || periodo == "20171" || periodo == "20172"){
		coord = [-8.1758379, -34.9196489];
	}else{
		coord = [-8.1124534, -35.0160643];
	}
	
	
	return L.marker(coord);
	
}

function changePeriodo(){
	
	map.eachLayer(function (layer) {
		if(layer != tile){
    		map.removeLayer(layer);
		}
	});
	
	var periodo = $("#periodo").val().replace(".","");
	if(periodo=="") periodo="20181";

	console.log(periodo);
	
	var cidade = $("#cidade").val();

	if(cidade=="") cidade = "2607901";

	console.log("cidade "+cidade);
	
	
	L.geoJson(regiaoRecife, 
  	{
    	style: function(feature) {
			if(feature.properties.GEOCODIGO != cidade)
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.5
			};
    	}
    }
  ).addTo(map);
		

	var indice = alunosIFPE.findIndex(x => x.periodo === periodo);
	
	if(indice != -1){

		dados = alunosIFPE[indice].alunos;

		document.getElementById("descPeriodo").innerHTML = "Período Letivo: "+periodo + " / Alunos: "+dados.length;

		var bairros =[]; var freqRenda = [];

		//console.log(dados);
		for(var i =0; i < dados.length; i++){
			if(dados[i].cod_cidade_res == cidade){
			//	console.log("eieiei");
				var index = bairros.findIndex(x => x.cod_bairro === dados[i].cod_bairro);
				var iRenda = freqRenda.findIndex(x => x.faixa === dados[i].qtd_salario);
				
				if(index == -1)
					bairros.push({"cod_bairro":dados[i].cod_bairro, "qtd":1, "nome":dados[i].bairro, "coord":dados[i].coord_bairro});
				else
					bairros[index].qtd = bairros[index].qtd +1;

				if(iRenda == -1)
					freqRenda.push({"faixa":dados[i].qtd_salario, "qtd":1});
				else
					freqRenda[iRenda].qtd = freqRenda[iRenda].qtd +1;
			}
		}

		//console.log(bairros);
		//console.log(freqRenda);

		tile = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		});

		tile.addTo(map);

		for(var i = 0; i < bairros.length; i ++){
			createCircle(bairros[i].coord, bairros[i].qtd).addTo(map);
		}

	}
	createMarker(periodo).addTo(map);
}


function geraHistogramaRenda(periodo){
	//console.log(periodo);
  var svg = d3.select("#svgRenda"),
      margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.select("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  	  g.selectAll("*").remove();

  var x = d3.scaleBand()
      .rangeRound([0, width/2])
      .paddingInner(0.05)
      .align(0.1);

  var y = d3.scaleLinear()
      .rangeRound([height, 0]);

  var z = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  d3.csv("../data/dadosSalario.csv", function(d, i, columns) {
  	
    	for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    	d.total = t;
	
    return d;
  }, function(error, data) {
    if (error) throw error;
    
    var keys = data.columns.slice(1);

    data.sort(function(a, b) {return b.total - a.total; });
    x.domain(data.map(function(d) { if(d.Periodo==periodo) return d.Periodo; }));
    y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
    z.domain(keys);

    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
        .attr("fill", function(d) { return z(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { if(d.data.Periodo==periodo) return x(d.data.Periodo); })
        .attr("y", function(d) { if(d.data.Periodo==periodo) return y(d[1]); })
        .attr("height", function(d) { if(d.data.Periodo==periodo) return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth());

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Quantidade Alunos");

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width/2 + 140)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width/2 + 120)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
  });
}

