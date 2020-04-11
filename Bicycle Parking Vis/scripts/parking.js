
const width = 800;
const height = 600;
const data = "data/city_wards_data.geojson";
const bike_data = "data/bicycle_parking_map_data.geojson";

window.onload = function () {
  svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height)

  // Define the div for the tooltip
  div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  displayGeoMap();

};

function displayGeoMap() {

  d3.json(data, function (err, geojson) {
    d3.json(bike_data, function (err, geojson_bike) {

      console.log(geojson);
      console.log('bike');
      console.log(geojson_bike);

      let projection = d3.geoMercator().fitSize([width, height], geojson);
      let path = d3.geoPath().projection(projection);

      svg.selectAll("path").data(geojson.features).enter().append("path")
        .attr("d", path)
        .attr("class", "svg-style")  // calls the entire css class with styles, same as .style(...)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

      let bike_projection = d3.geoMercator().fitSize([width, height], geojson_bike);
      let bike_path = d3.geoPath().projection(bike_projection);
    
      svg.selectAll("path").data(geojson_bike.features).enter().append("path")
        .attr("d", bike_path)
    })

      // this displays the ward names. Not enough space to fit the names so commenting it out
      //instead gona use hover and tooltip

      /*     svg.selectAll(".ward-label")
            .data(geojson.features)
            .enter().append("text")
            .attr("class", function (d) { return "ward-label " + d.id; })
            .attr("transform", function (d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function (d) { return d.properties.AREA_NAME; }) */
  })
};

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
