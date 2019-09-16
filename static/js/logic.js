// Creating map object to be centered in middle of US
var myMap = L.map("map", {
    center: [39.0119, -98.4842],
    zoom: 4
  });

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Define API query URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define a function that converts a timestamp in unix time to a human readable time stamp of datetime
function date(date) {
    return date.toLocaleString();
};

// Grab data from API endpoint using d3
d3.json(url, function(response) {

  // Loop through data
  for (var i = 0; i < response.features.length; i++) {

    // Log the response
    console.log(response);

    // Set the data location property to a variable
    var location = response.features[i].geometry;

    // Set the popup content properties to variables: magnitude and timestamp
    var magnitude = response.features[i].properties.mag;
    var timestamp = new Date(response.features[i].properties.time);

    // Check for location property to see if data exists and therefore earthquake is 'plottable'
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      L.marker([location.coordinates[1], location.coordinates[0]])
             .bindPopup("<h3>Magnitude: " + magnitude + "</h3><h5>Timestamp: " + date(timestamp) + "</h5>")
             .addTo(myMap);
    };
  };
});

  