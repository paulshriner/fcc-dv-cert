// URLs for dataset
const url = ["https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json", "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"];

// References from HTML
const graph = d3.select("#graph");

// Finds resulting color corresponding to percentage of bachelor's degrees
const getColor = (value) => {
    // used https://rgbcolorpicker.com/ to get color values
    if (value <= 3)
        return "#00ff77";
    if (value <= 12)
        return "#00de68";
    if (value <= 21)
        return "#00bd58";
    if (value <= 30)
        return "#009445";
    if (value <= 39)
        return "#007d3a";
    if (value <= 48)
        return "#006931";
    if (value <= 57)
        return "#00592a";
    if (value <= 66)
        return "#004d24";

    return "#002e15";
}

// Choropleth map constants
const cw = 1500;
const ch = 750;
const r = 5;
const cpadding = 60;

// Legend constants
const legendRecs = [[0, 3], [30, 12], [60, 21], [90, 30], [120, 39], [150, 48], [180, 57], [210, 66], [240, 75]];
const lw = 270;
const lh = 70;

// create svg element for legend
const legendSVG = graph.append("svg")
                       .attr("width", lw)
                       .attr("height", lh)
                       .attr("id", "legend");

// define x and y scales for legend
const lxScale = d3.scaleBand()
                    .domain([3, 12, 21, 30, 39, 48, 57, 66, 75])
                    .range([0, lw]);
const lxAxis = d3.axisBottom(lxScale)
                 .tickFormat(d => d + "%");

// add rectangles to legend
legendSVG.selectAll("rect")
         .data(legendRecs)
         .enter()
         .append("rect")
         .attr("x", d => lxScale(d[1]))
         .attr("y", 10)
         .attr("width", 30)
         .attr("height", 40)
         .style("fill", d => getColor(d[1]));

// add axis to legend
legendSVG.append("g")
         .attr("transform", "translate(0," + (lh - 20) + ")")
         .call(lxAxis)
         .attr("id", "lx-axis");

// create svg element for choropleth map
const cSVG = graph.append("svg")
                 .attr("width", cw)
                 .attr("height", ch);

// Thanks https://stackoverflow.com/questions/59037553/fetch-multiple-urls-at-the-same-time for Promise.all
// This allows fetching multiple urls at the same time
Promise.all([
    fetch(url[0]).then(res => res.json()),
    fetch(url[1]).then(res => res.json())
]).then(data => {
    // This was helpful for starting tips: https://forum.freecodecamp.org/t/data-visualization-choropleth-map-tips-to-start/594672/2
    // Thanks https://gis.stackexchange.com/questions/310209/converting-topojson-data-to-geojson-using-javascript-in-browser for topojson.feature()
    const nation = topojson.feature(data[1], data[1].objects.nation);
    const states = topojson.feature(data[1], data[1].objects.states).features;
    const counties = topojson.feature(data[1], data[1].objects.counties).features;
    
    // Thanks https://billmill.org/making_a_us_map.html for help with drawing the map
    // Draw the nation
    cSVG.append("g")
        .append("path")
        .datum(nation)
        .attr("d", d3.geoPath());

    // Draw the states
    cSVG.append("g")
        .attr("stroke", "#444")
        .selectAll("path")
        .data(states)
        .join("path")
        .attr("d", d3.geoPath());

    // Draw the counties
    cSVG.append("g")
        .attr("stroke", "#444")
        .selectAll("path")
        .data(counties)
        .join("path")
        .attr("d", d3.geoPath())
        .attr("class", "county")
        .attr("data-fips", d => d.id)
        .attr("data-education", d => data[0].filter(i => i.fips === d.id)[0].bachelorsOrHigher)
        .attr("fill", d => getColor(data[0].filter(i => i.fips === d.id)[0].bachelorsOrHigher));
});
