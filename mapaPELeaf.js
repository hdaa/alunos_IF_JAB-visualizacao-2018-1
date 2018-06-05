 var map = L.map('mapid').setView([-8.05, -35.05], 10);

 function getColor(d) {
    return d > 50  ? '#E31A1C' :
           d > 15  ?  '#FC4E2A' :
           d > 10  ? '#FD8D3C' :
           d > 0   ? '#FEB24C' :
                     '#FFEDA0';
}

var dados = "";
var polygon = "", tile = "";

function changePeriodo(){
	map.eachLayer(function (layer) {
		if(layer != tile){
    		map.removeLayer(layer);
		}
	});
	
	var periodo = $("input[name=periodo]:checked").attr("id");
	//console.log(periodo);
	
	var turno = $("input[name=turno]:checked").attr("id");
	//console.log("turno "+turno);
	
	var indice = alunosIFPE.findIndex(x => x.periodo === periodo);
	
	dados = alunosIFPE[indice].alunos;
	
	var cidades =[{"cod":2607901.0,"qtd":0},
	  {"cod":2611606.0,"qtd":0},
	  {"cod":2610707.0,"qtd":0},
	  {"cod":2609600.0,"qtd":0},
	  {"cod":2609402.0,"qtd":0},
	  {"cod":2602902.0,"qtd":0},
	  {"cod":2613701.0,"qtd":0},
	  {"cod":2603454.0,"qtd":0},
	  {"cod":2607208.0,"qtd":0}
	 ];

	for(var i =0; i < dados.length; i++){
		var index = cidades.findIndex(x => x.cod === dados[i].cod_cidade_res);
		if(turno == "todos"){
			if(index == -1)
				cidades.push({"cod":dados[i].cod_cidade_res, "qtd":1});
			else
				cidades[index].qtd = cidades[index].qtd +1;
		}else{
			if(dados[i].turno == turno){
				if(index == -1)
					cidades.push({"cod":dados[i].cod_cidade_res, "qtd":1});
				else
					cidades[index].qtd = cidades[index].qtd +1;
			}
		}
	}
	
	tile = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
	
	tile.addTo(map);

	L.geoJson(regiaoRecife, 
  	{
    	style: function(feature) {
			var index = cidades.findIndex(x => x.cod === feature.properties.GEOCODIGO);
		//	console.log("index of "+index);
			return {
				fillColor: getColor(cidades[index].qtd),
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.5
			};
    	},
  
    	onEachFeature: function (feature, layer) {
			console.log("dados "+dados.length);
			var index = cidades.findIndex(x => x.cod === feature.properties.GEOCODIGO);
			layer.bindPopup('<h3>'+feature.properties.NOME+'</h3><p>Qtde Alunos: '+cidades[index].qtd+'<br>	Proporção: '+(cidades[index].qtd*100/dados.length).toFixed(0)+'%</p>');
      	}
    }
  ).addTo(map);
	
	document.getElementById("descPeriodo").innerHTML = "Período Letivo: "+periodo + "--- Qtde Alunos: "+dados.length+"  ---  Turno: "+turno;
	

}
/*
 L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

 L.geoJson(regiaoRecife, 
  {
    style: function(feature) {
		
		var index = cidades.findIndex(x => x.cod === feature.properties.GEOCODIGO);
		console.log("index of "+index);
       return {
            fillColor: getColor(cidades[index].qtd),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    },
  
    onEachFeature: function (feature, layer) {
		var index = cidades.findIndex(x => x.cod === feature.properties.GEOCODIGO);
        layer.bindPopup('<h3>'+feature.properties.NOME+'</h3><p>Qtde Alunos: '+cidades[index].qtd+'</p>');
      }

    }
    
  ).addTo(map);*/

