// Creating map object to be centered in middle of US
var myMap = L.map("map", {
    center: [39.0119, -98.4842],
    zoom: 3,
    preferCanvas: true
  });

// Adding tile layer to the map, choosing dark
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
}).addTo(myMap);

// Define API query URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Define a function that converts a timestamp in unix time to a human readable time stamp of datetime
function date(date) {
    return date.toLocaleString();
};

// Define list of colors to represent earthquakes of magnitudes 0-1, 1-2, 2-3, 3-4, 4-5, or 5+
var colors = ["#87EE77", "#B3EE77", "#D8EE77", "#EECA77", "#EEA477", "#EE8477"];

// Grab data from API endpoint using d3
d3.json(url, function(response) {

  // Log the response
  console.log(response);

  // Loop through data
  for (var i = 0; i < response.features.length; i++) {

    // Set the data location property to a variable
    var location = response.features[i].geometry;

    // Set the popup content properties to variables: magnitude and timestamp
    var magnitude = response.features[i].properties.mag;
    var timestamp = new Date(response.features[i].properties.time);

    // Set color and radius variable based on magnitude
    var color = "";
    var radius = "";

    if (magnitude < 1) {
      color = colors[0];
      radius = 5;
    }
    else if (magnitude < 2) {
      color = colors[1];
      radius = 10;
    }
    else if (magnitude < 3) {
      color = colors[2];
      radius = 15;
    }
    else if (magnitude < 4) {
      color = colors[3];
      radius = 20;
    }
    else if (magnitude < 5) {
      color = colors[4];
      radius = 25;
    }
    else {
      color = colors[5];
      radius = 30;
    };

    // Check for location property to see if data exists and therefore earthquake is 'plottable'
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      L.circleMarker([location.coordinates[1], location.coordinates[0]], {
        color: color,
        fillColor: color,
        fillOpacity: 0.8,
        radius: radius
      }).bindPopup("<h3>Magnitude: " + magnitude + "</h3><h5>Timestamp: " + date(timestamp) + "</h5>")
        .addTo(myMap);
    };
  };

  // Create legend mapping colors to earthquakes of different magnitudes
  // --------------------------------------------------------------------
 
  // Create legend variable and place it in bottom right part of map
  var legend = L.control({position: "bottomright"});

  // Define function that adds legend to the html
  legend.onAdd = function (map) {

    // Define div to house the legend
    var div = L.DomUtil.create("div", "legend");

    // Define categories list of different magnitude buckets
    var categories = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

    // Define list with table title to house inner html of div
    var html = ["<table style=background-color:gray><tr><th>Magnitude</tr></th>"];

    // Push remaining html elements to html list using for loop
    for (var i = 0; i < categories.length; i++) {
        html.push(
            "<tr><td>" + categories[i] + "</td><td><svg width='20' height='10'><rect x='0' y='0' width='20' height='10' fill='" + colors[i] + "'</></svg></td></tr>"
        );
    };

    // Push final closing table tag
    html.push("</table>")

    // Join elements of html list together to form final html
    div.innerHTML = html.join("");

    return div;
  };

  // Call the legend.onAdd function with the input parameter myMap
  legend.addTo(myMap);

});

  