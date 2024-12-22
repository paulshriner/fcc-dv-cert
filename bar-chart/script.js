// URL for dataset
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// References from HTML
const graph = document.getElementById("graph");

// Graph constants
const w = 800;
const h = 500;

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
                     .range([0, w]);
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(points, d => d[1])])
                     .range([h, 0]);
            
    // add rect for each point
    svg.selectAll("rect")
       .data(points)
       .enter()
       .append("rect")
       .attr("x", d => xScale(getYear(d[0])))
       .attr("y", d => yScale(d[1]))
       .attr("width", 12)
       .attr("height", d => d[1])
       .attr("class", "bar");
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
        return "Q4";
    }
    if (month < 13) {
        return "Q5";
    }

    return month;
}
