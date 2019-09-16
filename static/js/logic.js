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

    // Set color variable based on magnitude
    var color = "";
    if (magnitude < 1) {
      color = "#87EE77";
    }
    else if (magnitude < 2) {
      color = "#B3EE77";
    }
    else if (magnitude < 3) {
      color = "#D8EE77";
    }
    else if (magnitude < 4) {
        color = "#EECA77";
    }
    else if (magnitude < 5) {
        color = "#EEA477";
    }
    else {
      color = "#EE8477";
    };

    // Check for location property to see if data exists and therefore earthquake is 'plottable'
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      var circle = L.circleMarker([location.coordinates[1], location.coordinates[0]], {
        color: color
      }).bindPopup("<h3>Magnitude: " + magnitude + "</h3><h5>Timestamp: " + date(timestamp) + "</h5>")
        .addTo(myMap);
    };
  };

// // Write a on click method so that popup appears on top of other markers
// circle.on("click", function() {
//     layer.openPopup();
// });

});

  