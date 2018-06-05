 var map = L.map('mapid').setView([-8.1721658, -34.9986835], 12);

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
	
	console.log(coords);
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
	
	var periodo = $("input[name=periodo]:checked").attr("id");
	//console.log(periodo);
	
	var cidade = $("input[name=cidade]:checked").attr("id");
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

		document.getElementById("descPeriodo").innerHTML = "Período Letivo: "+periodo + "--- Qtde Alunos: "+dados.length;

		var bairros =[]; var freqRenda = [];

		console.log(dados);
		for(var i =0; i < dados.length; i++){
			if(dados[i].cod_cidade_res == cidade){
				console.log("eieiei");
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

		console.log(bairros);
		console.log(freqRenda);

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

