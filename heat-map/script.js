// URL for dataset
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// References from HTML
const description = d3.select("#description");
const graph = d3.select("#graph");

// Graph constants
const w = 1500;
const h = 750;
const r = 5;
const padding = 60;

// create svg element
const svg = graph.append("svg")
                 .attr("width", w)
                 .attr("height", h);

// Use fetch to get JSON data
fetch(url)
.then(res => res.json())
.then(data => {
    const points = data.monthlyVariance;
    
    // set description text
    description.text(points[0].year + " - " + points[points.length - 1].year + ": base temperature " + data.baseTemperature + "°C");

    // define x and y scales
    const xScale = d3.scaleLinear()
                     .domain([d3.min(points, d => d.year), d3.max(points, d => d.year)])
                     .range([padding, w - padding]);
    const yScale = d3.scaleLinear()
                     .domain([d3.max(points, d => d.month) + 0.5, d3.min(points, d => d.month) - 0.5])
                     .range([h - padding, padding]);

    // functions to create axis
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format(".0f"));
    const yAxis = d3.axisLeft(yScale);

    // add axis to svg
    svg.append("g")
       .attr("transform", "translate(0," + (h - padding) + ")")
       .call(xAxis)
       .attr("id", "x-axis");
    svg.append("g")
       .attr("transform", "translate(" + padding + ",0)")
       .call(yAxis)
       .attr("id", "y-axis");

    // plot data using years as x and months as y
    svg.selectAll("rect")
       .data(points)
       .enter()
       .append("rect")
       .attr("x", d => xScale(d.year))
       .attr("y", d => yScale(d.month))
       .attr("width", 10)
       .attr("height", 10)
})
