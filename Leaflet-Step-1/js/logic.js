
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

function chooseColor(mag) {
    switch (true) {
    case mag < 1:
      return "#40ff00";
    case mag < 2:
      return "#bfff00";
    case mag < 3:
      return "#ffff00";
    case mag < 4:
      return "#ffbf00";
    case mag < 5:
      return "#ff8000";
    default:
      return "#ff0000";
    }
  }
  
function magSize(magnitude) {
    return magnitude * 5;
}

// Perform a GET request to the query URL
d3.json(url, function(data) {
  
  createFeatures(data.features);
  console.log(data)
});

function createFeatures(earthquakeData) {
    
  function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " + feature.properties.mag + "</p>");
      }
    
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, coords) {
            return new L.circleMarker(coords, {
                radius: magSize(feature.properties.mag),
                color: "black",
                fillColor: chooseColor(feature.properties.mag),
                fillOpacity: 0.8,
                weight: 1
            });


        },
    onEachFeature: onEachFeature   
  });



// Sending our earthquakes layer to the createMap function
createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });


  // Define baseMap
  var baseMaps = {
    "Street Map": streetmap
    };

  // Create overlay
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map
  var myMap = L.map("mapid", {
    center: [
      37.09, -122.42
    ],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });

    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  

//Legend

   var legend = L.control({
     position: 'bottomleft'});

   legend.onAdd = function () {
   
       var div = L.DomUtil.create('div', 'info legend')
       
       div.innerHTML = "<h3> Magnitude Legend </h3><table><tr><th>< 1 - </th><td>Harlequin</td></tr><tr><th>< 2 - </th><td>Lime</td></tr><tr><th><3 - </th><td>Yellow</td></tr><tr><th><4 - </th><td>Orange</td></tr><tr><th>< 5 - </th><td>Dark Orange</td></tr><tr><th>>5 - </th><td>Red</td></tr></table>";

       return div;
   };

legend.addTo(myMap);
}