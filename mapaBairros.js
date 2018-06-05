 var map = L.map('mapid').setView([-8.05, -35.05], 10);


 function getColor(d) {
    return d > 10  ? '#E31A1C' :
           d > 9  ? '#FC4E2A' :
           d > 5   ? '#FD8D3C' :
           d > 3   ? '#FEB24C' :
           d > 2   ? '#FED976' :
                      '#FFEDA0';
}


/*function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.)
    .openOn(map);
}*/

/*function onMapClick(e) {
  //console.log(e);
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e)
    .openOn(map);
}*/

function style(feature) {
 return {
      fillColor: getColor(feature.properties.qtd),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}


 L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

 L.geoJson(bairrosRecife, 
  {
    style: function(feature) {
       return {
            fillColor: 'blue',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    },
  
    onEachFeature: function (feature, layer) {
        layer.bindPopup('<h3>'+feature.properties.bairro_nome_ca+' ('+feature.properties.bairro_codigo+')</h3>');
      }

    }
    
  ).addTo(map);

 console.log(map);

/*L.geoJSON(regiaoRecife, {
    style: function(feature) {
        switch (feature.properties.NOME) {
            case 'Recife': return {color: "#ff0000"};
            case 'Paulista':   return {color: "#00ff00"};
        }
    }
}).addTo(map);*/