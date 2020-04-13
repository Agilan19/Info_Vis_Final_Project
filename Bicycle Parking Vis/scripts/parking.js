
const width = 800;
const height = 600;
const data = "data/city_wards_data.geojson";
const bike_data = "data/bicycle_parking_map_data.geojson";
const park_data = "data/city_green_space.json";
const street_parking_data = "data/street_bicycle_parking_data.geojson";
const school_data = "data/school_all_types_data.geojson";

window.onload = function () {
    
  // Start view at Toronto    
  const mymap = L.map('mapid').setView([43.6707, -79.3930], 11);
    
  var myIcon = L.icon({
    iconUrl: 'icons/school_icon.png',
    iconSize: [50, 32],
    iconAnchor: [25, 16]
  });
//  const marker = L.marker([0, 0], { icon: myIcon }).addTo(mymap);
    

    
var longStorage = [];
var latStorage = [];
    
var counter = 0;
$(document).ready(function () {    
    $.getJSON(school_data, function (data) {
        $.each(data.features, function (key, val) {
            counter++;
            $.each(val.properties, function(i,j){
                if (i == "LATITUDE") {
                    latStorage.push(j);
//                    console.log(latStorage);
                }
                if (i == "LONGITUDE") {
                    longStorage[counter] = j;
//                    console.log(longStorage);
                }
            })
        });
    });
});

    console.log(longStorage);
    
  for (var i = 0; i < latStorage.length; i++) {
    const marker = new L.marker(latStorage[i],longStorage[i])
        .bindPopup(longStorage[i])
        .addTo(mymap);
  }

  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    
  const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'; 
  // Limit user zooming
  const tiles = L.tileLayer(tileURL, { attribution, maxZoom: 14 , minZoom: 10 } );   
  tiles.addTo(mymap);

  svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)

  // Define the div for the tooltip
  div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // default view
  var checkbox_variation = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  displayGeoMap(checkbox_variation[0]);

  // attach event listeners to these
  const checkboxBike = document.getElementById('bikeParkingCheckbox');
  const checkboxPark = document.getElementById('parksCheckbox');
  const checkboxStreet = document.getElementById('streetParkingCheckbox');
  const checkboxSchool = document.getElementById('schoolCheckbox');


  checkboxBike.addEventListener('change', (event) => {
    changeView(svg, checkbox_variation);
  })

  checkboxPark.addEventListener('change', (event) => {
    changeView(svg, checkbox_variation);
  })
    
  checkboxStreet.addEventListener('change', (event) => {
    changeView(svg, checkbox_variation);
  })
 
  checkboxSchool.addEventListener('change', (event) => {
    changeView(svg, checkbox_variation);
  })

};

function changeView(svg, checkbox_variation) {
  // clear view
  svg.selectAll("*").remove();

  // retrieve and display next view
  var nextView = nextMapView();
  displayGeoMap(checkbox_variation[nextView]);
}


// helper function to determine view combinations
function viewCombinations(){
  /*
  View Tested  Combinations
      [x]        outdoor bike
      [x]        parks
      [x]        street bikes
      [x]        schools
      [x]        outdoor bike, parks
      [x]        outdoor bike, street bikes
      [x]        outdoor bike, schools
      []        parks, street bikes
      []        parks, schools
      []        street bikes, schools
      []        outdoor bike, parks, street bikes
      []        outdoor bike, parks, schools
      []        outdoor bike,street bikes, schools
      []        parks, street bikes, schools
      []        outdoor bike, parks, street bikes, schools
  */
 
  var list = ["outdoor bike", "parks", "street bikes", "schools"];
  var combi = [];
  var temp= "";
  var combLen = Math.pow(2, list.length);

  for (var i = 0; i < combLen ; i++){
      temp= "";
      for (var j=0;j<list.length;j++) {
          if ((i & Math.pow(2,j))){ 
              temp += list[j]
          }
      }
      if (temp !== "") {
          combi.push(temp);
      }
  }
  console.log(combi.join("\n"));
}

// View management through checkboxes
function nextMapView() {
  const checkboxBike = document.getElementById('bikeParkingCheckbox');
  const checkboxPark = document.getElementById('parksCheckbox');
  const checkboxStreet = document.getElementById('streetParkingCheckbox');
  const checkboxSchool = document.getElementById('schoolCheckbox');

  //viewCombinations();

  if (checkboxPark.checked == false && checkboxBike.checked == false && checkboxStreet.checked == false && checkboxSchool.checked == false){
      // default
      return 0;
  } else if (checkboxPark.checked == false && checkboxBike.checked == true && checkboxStreet.checked == false && checkboxSchool.checked == false){
      // outdoor bike
      return 1;
  } else if (checkboxPark.checked == true && checkboxBike.checked == false && checkboxStreet.checked == false && checkboxSchool.checked == false){
      // parks
      return 2;
  } else if (checkboxPark.checked == true && checkboxBike.checked == true && checkboxStreet.checked == false && checkboxSchool.checked == false){
      // parks + outdoor bikes
      return 3;
  } else if (checkboxPark.checked == false && checkboxBike.checked == false && checkboxStreet.checked == true && checkboxSchool.checked == false) {
      // street bikes
      return 4;
  } else if (checkboxPark.checked == false && checkboxBike.checked == false && checkboxStreet.checked == false && checkboxSchool.checked == true) {
      // schools
      return 5;
  } else if (checkboxPark.checked == false && checkboxBike.checked == true && checkboxStreet.checked == true && checkboxSchool.checked == false) {
      // outdoor bikes + street bikes
      return 6;
  } else if (checkboxPark.checked == false && checkboxBike.checked == true && checkboxStreet.checked == false && checkboxSchool.checked == true) {
      // outdoor bikes + schools
      return 7;
  }

}

function displayGeoMap(display_variation) {

  if (display_variation == 0) {

    // EMPTY VIEW --------------------------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {

      displayDefaultMap(geojson);
    })
  } else if (display_variation == 1) {

    // BIKE VIEW --------------------------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(bike_data, function (err, geojson_bike) {
  
        displayDefaultMap(geojson);
        displayBikeMapLayer(geojson_bike);
      })
    })
  } else if (display_variation == 2) {

    // PARKS VIEW --------------------------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(park_data, function (err, geojson_parks) {

        displayDefaultMap(geojson);
        displayParkMapLayer(geojson_parks);
      })
    })
  } else if (display_variation == 3) {

    // BIKE + PARKS VIEW --------------------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(park_data, function (err, geojson_parks) {
        d3.json(bike_data, function (err, geojson_bike) {

          displayDefaultMap(geojson);
          displayBikeMapLayer(geojson_bike);
          displayParkMapLayer(geojson_parks);
        })
      })
    })
  } else if (display_variation == 4) {

    // STREET PARKING VIEW ------------------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(street_parking_data, function (err, geojson_street) {

          displayDefaultMap(geojson);
          displayStreetMapLayer(geojson_street);
      })
    })
  } else if (display_variation == 5) {

    // SCHOOLS VIEW -------------------------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(school_data, function (err, geojson_school) {

          displayDefaultMap(geojson);
          displaySchoolMapLayer(geojson_school);
      })
    })
  } else if (display_variation == 6) {

    // BIKE + STREET BIKES VIEW -------------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(bike_data, function (err, geojson_bike) {
        d3.json(street_parking_data, function (err, geojson_street) {
          
          displayDefaultMap(geojson);
          displayStreetMapLayer(geojson_street);
          displayBikeMapLayer(geojson_bike);
        })
      })
    })
  } else if (display_variation == 7) {

    // BIKE + SCHOOLS -------------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(bike_data, function (err, geojson_bike) {
        d3.json(school_data, function (err, geojson_school) {
          
          displayDefaultMap(geojson);
          displayBikeMapLayer(geojson_bike);
          displaySchoolMapLayer(geojson_school);
        })
      })
    })
  }
  // end of if cases

};

function displayParkMapLayer(geojson_parks) {
  let park_projection = d3.geoMercator().fitSize([width, height], geojson_parks);
  let park_path = d3.geoPath().projection(park_projection);
  svg.selectAll("path").data(geojson_parks.features).enter().append("path")
    .attr("d", park_path)
    .attr("fill", "#04a057");
}

function displayDefaultMap(geojson) {
  let projection = d3.geoMercator().fitSize([width, height], geojson);
  let path = d3.geoPath().projection(projection);
  
  svg.selectAll("path").data(geojson.features).enter().append("path")
    .attr("d", path)
    .attr("class", "svg-style")  // calls the entire css class with styles, same as .style(...)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
}

function displayBikeMapLayer(geojson_bike) {
  let bike_projection = d3.geoMercator().fitSize([width, height], geojson_bike);
  let bike_path = d3.geoPath().projection(bike_projection);

  svg.selectAll("path").data(geojson_bike.features).enter().append("path")
    .attr("d", bike_path)
    .attr("fill", "#4287f5");
}

function displayStreetMapLayer(geojson_street) {
  let street_projection = d3.geoMercator().fitSize([width, height], geojson_street);
  let street_path = d3.geoPath().projection(street_projection);
  svg.selectAll("path").data(geojson_street.features).enter().append("path")
    .attr("d", street_path)
    .attr("fill", "#eb3462");
}

function displaySchoolMapLayer(geojson_school) {
  let school_projection = d3.geoMercator().fitSize([width, height], geojson_school);
  let school_path = d3.geoPath().projection(school_projection);
  svg.selectAll("path").data(geojson_school.features).enter().append("path")
    .attr("d", school_path)
    .attr("fill", "#34ebc6");
}

function handleMouseOver(d, i) {

  console.log(d.properties.AREA_NAME);

  d3.select(this).transition()
    .duration('50')
    .attr('opacity', '.35');

  div.transition()
    .duration(200)
    .style("opacity", .92);
  div.html(d.properties.AREA_NAME)
    .style("left", (d3.event.pageX + 10) + "px")
    .style("top", (d3.event.pageY - 15) + "px");
}

function handleMouseOut(d, i) {
  d3.select(this).transition()
    .duration('50')
    .attr('opacity', '1');

  div.transition()
    .duration(500)
    .style("opacity", 0);
}

// this displays the ward names. Not enough space to fit the names so commenting it out
//instead gona use hover and tooltip

/*     svg.selectAll(".ward-label")
      .data(geojson.features)
      .enter().append("text")
      .attr("class", function (d) { return "ward-label " + d.id; })
      .attr("transform", function (d) { return "translate(" + path.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function (d) { return d.properties.AREA_NAME; }) */