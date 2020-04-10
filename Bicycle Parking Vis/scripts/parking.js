
window.onload = function () {

  var width = 800;
  var height = 600;

  var svg = d3.select("#vis").append("svg")
      .attr("width", width).attr("height", height)


  var url = "data/city_wards_data.geojson";

  d3.json(url, function (err, json) {
    console.log(json);


    var projection = d3.geoMercator().fitSize([width, height], json);
    var path = d3.geoPath().projection(projection);


    svg.selectAll("path").data(json.features).enter().append("path")
      .attr("d", path)
      .style("fill", "#ffffe8")
      .style("stroke-width", "1.5")
      .style("stroke", "black")
  });



};