// URL for dataset
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// References from HTML
const graph = document.getElementById("graph");

// Graph constants
const w = 800;
const h = 500;
const padding = 50;

// create tooltip element
d3.select(graph)
  .append("div")
  .attr("id", "tooltip");

// create svg element
const svg = d3.select(graph)
              .append("svg")
              .attr("width", w)
              .attr("height", h);

// Use fetch to get JSON data
fetch(url)
.then(res => res.json())
.then(data => {
    // get points from data json
    const points = data.data;

    // define x and y scales
    const xScale = d3.scaleLinear()
                     .domain([d3.min(points, d => getYear(d[0])), d3.max(points, d => getYear(d[0]))])
                     .range([padding, w - padding]);
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(points, d => d[1])])
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
            
    // add rect for each point
    svg.selectAll("rect")
       .data(points)
       .enter()
       .append("rect")
       .attr("x", d => xScale(getYear(d[0])))
       .attr("y", d => yScale(d[1]))
       .attr("width", 12)
       .attr("height", d => d[1] / 45.21)
       .attr("class", "bar")
       .attr("data-date", d => d[0])
       .attr("data-gdp", d => d[1])
       .on("mouseover", d => updateTooltip(d.explicitOriginalTarget["__data__"]))
       .on("mouseout", d => hideTooltip());
});

// extract year from date with format "YYYY-MM-DD"
const getYear = date => parseInt(date.slice(0, 4));

// return quarter that month falls in, takes date with format "YYYY-MM-DD"
const getQuarter = date => {
    const month = parseInt(date.slice(5, 7));

    if (month < 4) {
        return "Q1";
    }
    if (month < 7) {
        return "Q2";
    }
    if (month < 10) {
        return "Q3";
    }
    if (month < 13) {
        return "Q4";
    }

    return month;
}

// updates tooltip element with information from bar, takes an individual array of date and GDP
const updateTooltip = bar => {
    d3.select("#tooltip")
    .attr("data-date", bar[0])
    .style("opacity", 1)
    .text(getYear(bar[0]) + " " + getQuarter(bar[0]) + "\n$" + bar[1] + " Billion");    
}

// hides tooltip by setting opacity to 0
const hideTooltip = () => {
    d3.select("#tooltip")
    .style("opacity", 0);
}
