
const width = 800;
const height = 600;
const data = "data/city_wards_data.geojson";
const bike_data = "data/bicycle_parking_map_data.geojson";
const park_data = "data/city_green_space.json";
const street_parking_data = "data/street_bicycle_parking_data.geojson";
const school_data = "data/school_all_types_data.geojson";



function openTab(e, tabName) {
    
  // Get all the tabcontent and hide them
  var tabcontent = document.getElementsByClassName("tabcontent");
  for (var m = 0; m < tabcontent.length; m++) {
    tabcontent[m].style.display = "none";
  }

  // Get all the tablinks and remove the class "active" to make them inactive
  var tablinks = document.getElementsByClassName("tablinks");
  for (var n = 0; n < tablinks.length; n++) {
    tablinks[n].className = tablinks[n].className.replace(" active", "");
  }

  // Show the current tab, and make it "active"
  document.getElementById(tabName).style.display = "block";
  e.currentTarget.className += " active";
}

window.onload = function () { 

// Open the default tab when the window first loads     
document.getElementById("defaultOpen").click();
    
L.TopoJSON = L.GeoJSON.extend({  
  addData: function(topoData) {    
    if (topoData.type === 'Topology') {
      for (key in topoData.objects) {
        geojson = topojson.feature(topoData, topoData.objects[key]);
        L.GeoJSON.prototype.addData.call(this, geojson);
      }
    }    
    else {
      L.GeoJSON.prototype.addData.call(this, topoData);
    }
  }  
});
    
const topoLayer = new L.TopoJSON();

$.getJSON('data/city_wards_data.topojson')
    .done(addTopoData);

function addTopoData(topoData) {  
    topoLayer.addData(topoData);
    topoLayer.addTo(mymap);
}    

  // Start view at Toronto    
const mymap = L.map('mapid').setView([43.6707, -79.3930], 12);
    mymap.flyTo([43.7436, -79.4659], 10);
    
var myIcon = L.icon({
    iconUrl: 'images/school_icon.png',
    iconSize: [5, 5],
    iconAnchor: [25, 16]
});
    
var myBigIcon = L.icon({
    iconUrl: 'images/school_icon.png',
    iconSize: [25, 25],
    iconAnchor: [25, 16]
});
            
    
var longStorage = [];
var latStorage = [];
var schoolNames = [];
var schoolAddress = [];
var municipality = [];
        
var counter = 0;
$(document).ready(function () {    
    $.getJSON(school_data, function (data) {
        $.each(data.features, function (key, val) {
            $.each(val.properties, function(i,j) {
                if (i == "LATITUDE") {
                    latStorage.push(j);
                }
                else if (i == "LONGITUDE") {
                    // Other way to store into array    
//                    longStorage[counter] = j;
                    longStorage.push(j);
                }
                else if (i == "NAME") {
                    schoolNames.push(j);
                }
                else if (i == "SOURCE_ADDRESS") {
                    schoolAddress.push(j);
                }
                else if (i == "MUNICIPALITY") {
                    municipality.push(j);
                }
            })
//            counter++;
        });
        
        for (var l = 0; l < longStorage.length; l++) {
            
            var marker = new L.marker([latStorage[l],longStorage[l]], { icon: myIcon })
                .bindPopup('<h3>'+schoolNames[l]+'</h2>' + '\n' + '<h5>'+ schoolAddress[l]+'</h5>' + '<h5>'+ municipality[l]+'</h5>')
                .addTo(mymap);
            
//                mymap.on('zoomend', function() {
//                    var currentZoom = mymap.getZoom();
//                    if (currentZoom >= 12) {
//                        var marker = new L.marker([latStorage[l],longStorage[l]], { icon: myBigIcon })
//                            .bindPopup('<h5>'+ longStorage[l]+'</h5>')
//                            .addTo(mymap);
//                    }
//                    else {
//                        var marker = new L.marker([latStorage[l],longStorage[l]], { icon: myIcon })
//                            .bindPopup('<h5>'+ longStorage[l]+'</h5>')
//                            .addTo(mymap);
//                    }
////                    myIcon.iconSize * 2000;
////                    marker.setIcon(myIcon);
//                });
        }
    });
});
    
//  var imgOverlay = L.imageOverlay('images/mun13.png', [[43.857750, -79.758847], [43.590913, -78.962680]]).addTo(mymap);

  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    
  const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'; 
  // Limit user zooming
  const tiles = L.tileLayer(tileURL, { attribution, maxZoom: 14 , minZoom: 9 } );   
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
      [x]        parks, street bikes
      [x]        parks, schools
      [x]        street bikes, schools
      [x]        outdoor bike, parks, street bikes
      [x]        outdoor bike, parks, schools
      [x]        outdoor bike,street bikes, schools
      [x]        parks, street bikes, schools
      [x]        outdoor bike, parks, street bikes, schools
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
  } else if (checkboxPark.checked == true && checkboxBike.checked == false && checkboxStreet.checked == true && checkboxSchool.checked == false) {
      // parks + street bikes
      return 8;
  } else if (checkboxPark.checked == true && checkboxBike.checked == false && checkboxStreet.checked == false && checkboxSchool.checked == true) {
      // parks + schools
      return 9;
  } else if (checkboxPark.checked == false && checkboxBike.checked == false && checkboxStreet.checked == true && checkboxSchool.checked == true) {
      // street bikes + schools
      return 10;
  } else if (checkboxPark.checked == true && checkboxBike.checked == true && checkboxStreet.checked == true && checkboxSchool.checked == false) {
      // outdoor bike + parks + street bikes
      return 11;
  } else if (checkboxPark.checked == true && checkboxBike.checked == true && checkboxStreet.checked == false && checkboxSchool.checked == true) {
      // outdoor bike + parks + schools
      return 12;
  } else if (checkboxPark.checked == false && checkboxBike.checked == true && checkboxStreet.checked == true && checkboxSchool.checked == true) {
      // outdoor bike + street bikes + schools
      return 13;
  } else if (checkboxPark.checked == true && checkboxBike.checked == false && checkboxStreet.checked == true && checkboxSchool.checked == true) {
      // parks + street bikes + schools
      return 14;
  } else if (checkboxPark.checked == true && checkboxBike.checked == true && checkboxStreet.checked == true && checkboxSchool.checked == true) {
      // parks + street bikes + schools + outdoor bikes
      return 15;
  }
  // end of if statements
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
        displayDefaultMapTransparent(geojson);
      })
    })
  } else if (display_variation == 2) {

    // PARKS VIEW --------------------------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(park_data, function (err, geojson_parks) {

        displayDefaultMap(geojson);
        displayParkMapLayer(geojson_parks);
        displayDefaultMapTransparent(geojson);
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
          displayDefaultMapTransparent(geojson);
        })
      })
    })
  } else if (display_variation == 4) {

    // STREET PARKING VIEW ------------------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(street_parking_data, function (err, geojson_street) {

          displayDefaultMap(geojson);
          displayStreetMapLayer(geojson_street);
          displayDefaultMapTransparent(geojson);
      })
    })
  } else if (display_variation == 5) {

    // SCHOOLS VIEW -------------------------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(school_data, function (err, geojson_school) {

          displayDefaultMap(geojson);
          displaySchoolMapLayer(geojson_school);
          displayDefaultMapTransparent(geojson);
      })
    })
  } else if (display_variation == 6) {

    // BIKE + STREET BIKES VIEW -------------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(bike_data, function (err, geojson_bike) {
        d3.json(street_parking_data, function (err, geojson_street) {
          
          displayDefaultMap(geojson);
          displayBikeMapLayer(geojson_bike);
          displayStreetMapLayer(geojson_street);
          displayDefaultMapTransparent(geojson);
        })
      })
    })
  } else if (display_variation == 7) {

    // BIKE + SCHOOLS -----------------------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(bike_data, function (err, geojson_bike) {
        d3.json(school_data, function (err, geojson_school) {
          
          displayDefaultMap(geojson);
          displayBikeMapLayer(geojson_bike);
          displaySchoolMapLayer(geojson_school);
          displayDefaultMapTransparent(geojson);
        })
      })
    })
  } else if (display_variation == 8) {

    // PARKS + STREET BIKES ----------------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(park_data, function (err, geojson_parks) {
        d3.json(street_parking_data, function (err, geojson_street) {
          
          displayDefaultMap(geojson);
          displayParkMapLayer(geojson_parks);
          displayStreetMapLayer(geojson_street);
          displayDefaultMapTransparent(geojson);
        })
      })
    })
  } else if (display_variation == 9) {

    // PARKS + SCHOOLS --------------------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(park_data, function (err, geojson_parks) {
        d3.json(school_data, function (err, geojson_school) {
          
          displayDefaultMap(geojson);
          displaySchoolMapLayer(geojson_school);
          displayParkMapLayer(geojson_parks);
          displayDefaultMapTransparent(geojson);
        })
      })
    })
  } else if (display_variation == 10) {

    // STREET BIKES + SCHOOLS -------------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(street_parking_data, function (err, geojson_street) {
        d3.json(school_data, function (err, geojson_school) {
          
          displayDefaultMap(geojson);
          displaySchoolMapLayer(geojson_school);
          displayStreetMapLayer(geojson_street);
          displayDefaultMapTransparent(geojson);
        })
      })
    })
  } else if (display_variation == 11) {

    // STREET BIKES + BIKE + PARKS --------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(street_parking_data, function (err, geojson_street) {
        d3.json(bike_data, function (err, geojson_bike) {
          d3.json(park_data, function (err, geojson_parks) {
          
            displayDefaultMap(geojson);
            displayBikeMapLayer(geojson_bike);
            displayParkMapLayer(geojson_parks);
            displayStreetMapLayer(geojson_street); 
            displayDefaultMapTransparent(geojson);
          })
        })
      })
    })
  } else if (display_variation == 12) {

    // BIKE + SCHOOLS + PARKS ------------------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(school_data, function (err, geojson_school) {
        d3.json(bike_data, function (err, geojson_bike) {
          d3.json(park_data, function (err, geojson_parks) {
          
            displayDefaultMap(geojson);
            displayBikeMapLayer(geojson_bike);
            displaySchoolMapLayer(geojson_school);
            displayParkMapLayer(geojson_parks);
            displayDefaultMapTransparent(geojson);
          })
        })
      })
    })
  } else if (display_variation == 13) {

    // BIKE + STREET BIKES + SCHOOLS -----------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(school_data, function (err, geojson_school) {
        d3.json(bike_data, function (err, geojson_bike) {
          d3.json(street_parking_data, function (err, geojson_street) {
          
            displayDefaultMap(geojson);
            displayBikeMapLayer(geojson_bike);
            displaySchoolMapLayer(geojson_school);
            displayStreetMapLayer(geojson_street); 
            displayDefaultMapTransparent(geojson);
          })
        })
      })
    })
  } else if (display_variation == 14) {

    // PARKS + STREET BIKES + SCHOOLS -----------------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(school_data, function (err, geojson_school) {
        d3.json(park_data, function (err, geojson_parks) {
          d3.json(street_parking_data, function (err, geojson_street) {
          
            displayDefaultMap(geojson);
            displaySchoolMapLayer(geojson_school);
            displayParkMapLayer(geojson_parks);
            displayStreetMapLayer(geojson_street); 
            displayDefaultMapTransparent(geojson);
          })
        })
      })
    })
  } else if (display_variation == 15) {

    // PARKS + STREET BIKES + SCHOOLS + BIKE ---------------------------------------------------------------------//
    d3.json(data, function (err, geojson) {
      d3.json(school_data, function (err, geojson_school) {
        d3.json(park_data, function (err, geojson_parks) {
          d3.json(street_parking_data, function (err, geojson_street) {
            d3.json(bike_data, function (err, geojson_bike) {
          
              displayDefaultMap(geojson);
              displayBikeMapLayer(geojson_bike);
              displaySchoolMapLayer(geojson_school);
              displayParkMapLayer(geojson_parks);
              displayStreetMapLayer(geojson_street); 
              displayDefaultMapTransparent(geojson);
            })
          })
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

// Add this layer on top of stack to display tooltip data
function displayDefaultMapTransparent(geojson) {
  let projection = d3.geoMercator().fitSize([width, height], geojson);
  let path = d3.geoPath().projection(projection);
  
  svg.selectAll("path").data(geojson.features).enter().append("path")
    .attr("d", path)
    .attr("class", "svg-style-transparent")  // calls the entire css class with styles, same as .style(...)
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
    .attr("fill", "#eb3462")
    .attr("fill-opacity", "0.4");;
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