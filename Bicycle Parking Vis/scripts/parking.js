
window.onload = function () {

  var width = 600;
  var height = 500;

  var svg = d3.select("#vis").append("svg")
      .attr("width", width).attr("height", height)


  var url = "data/city_wards_data.geojson";

  d3.json(url, function (err, json) {
    console.log(json);


    var projection = d3.geoMercator().fitSize([width, height], json);
    var path = d3.geoPath().projection(projection);


    svg.selectAll("path").data(json.features).enter().append("path")
      .attr("d", path)
      .style("fill", "red")
      .style("stroke-width", "1")
      .style("stroke", "black")
  });



};