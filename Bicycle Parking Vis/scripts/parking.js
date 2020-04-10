
window.onload = function () {

  const width = 800;
  const height = 600;

  let svg = d3.select("#vis").append("svg")
      .attr("width", width).attr("height", height)


  const data = "data/city_wards_data.geojson";

  d3.json(data, function (err, geojson) {
    console.log(geojson);


    let projection = d3.geoMercator().fitSize([width, height], geojson);
    let path = d3.geoPath().projection(projection);


    svg.selectAll("path").data(geojson.features).enter().append("path")
      .attr("d", path)
      .style("fill", "#ffffe8")
      .style("stroke-width", "1.5")
      .style("stroke", "black")
  });



};