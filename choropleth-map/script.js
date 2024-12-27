// URLs for dataset
const url = ["https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json", "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"];

// References from HTML
const graph = d3.select("#graph");

// Choropleth map constants
const cw = 1500;
const ch = 750;
const r = 5;
const cpadding = 60;

// create svg element for choropleth map
const cSVG = graph.append("svg")
                 .attr("width", cw)
                 .attr("height", ch);

// Draw the map
fetch(url[1])
.then(res => res.json())
.then(data => {
    // Thanks https://gis.stackexchange.com/questions/310209/converting-topojson-data-to-geojson-using-javascript-in-browser for topojson.feature()
    const nation = topojson.feature(data, data.objects.nation);
    const states = topojson.feature(data, data.objects.states).features;
    const counties = topojson.feature(data, data.objects.counties).features;
    
    // Thanks https://billmill.org/making_a_us_map.html for help with drawing the map
    // Draw the nation
    cSVG.append("g")
        .append("path")
        .datum(nation)
        .attr("d", d3.geoPath());

    // Draw the states
    cSVG.append("g")
        .attr("stroke", "#444")
        .attr("fill", "#eee")
        .selectAll("path")
        .data(states)
        .join("path")
        .attr("d", d3.geoPath());

    // Draw the counties
    cSVG.append("g")
        .attr("stroke", "#444")
        .attr("fill", "#eee")
        .selectAll("path")
        .data(counties)
        .join("path")
        .attr("d", d3.geoPath())
        .attr("class", "county");
})
