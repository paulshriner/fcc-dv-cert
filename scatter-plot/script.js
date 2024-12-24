// URL for dataset
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

// References from HTML
const graph = document.getElementById("graph");

// Graph constants
const w = 800;
const h = 500;
const r = 5;
const padding = 60;

// create svg element
const svg = d3.select(graph)
              .append("svg")
              .attr("width", w)
              .attr("height", h);

// Thanks https://forum.freecodecamp.org/t/data-visualization-projects-visualize-data-with-a-scatterplot-graph/607807 for help with timeParse and timeFormat
const parse = d3.timeParse("%M:%S");
const format = d3.timeFormat("%M:%S");

// Use fetch to get JSON data
fetch(url)
.then(res => res.json())
.then(data => {
    // define x and y scales
    const xScale = d3.scaleLinear()
                     .domain([d3.min(data, d => d["Year"]) - 1, d3.max(data, d => d["Year"]) + 1])
                     .range([padding, w - padding]);
    const yScale = d3.scaleTime()
                     .domain([d3.max(data, d => parse(d["Time"])), d3.min(data, d => parse(d["Time"]))])
                     .range([h - padding, padding]);

    // functions to create axis
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format(".0f"));
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(format);

    // add x axis to svg
    svg.append("g")
       .attr("transform", "translate(0," + (h - padding) + ")")
       .call(xAxis)
       .attr("id", "x-axis");
    svg.append("text")
       .text("Year")
       .attr("x", 400)
       .attr("y", 480);

    // y axis
    svg.append("g")
       .attr("transform", "translate(" + padding + ",0)")
       .call(yAxis)
       .attr("id", "y-axis");
    svg.append("text")
       .text("Time in Minutes")
       .attr("transform", "rotate(-90)")
       .attr("x", -310)
       .attr("y", 15);

    // plot points using year as x and time as y
    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", d => xScale(d["Year"]))
       .attr("cy", d => yScale(parse(d["Time"])))
       .attr("r", r)
       .attr("class", "dot")
       .attr("data-xvalue", d => d["Year"])
       .attr("data-yvalue", d => parse(d["Time"]));
});
