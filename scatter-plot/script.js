// URL for dataset
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

// References from HTML
const graph = document.getElementById("graph");

// Graph constants
const w = 800;
const h = 500;
const r = 5;
const padding = 50;

// create svg element
const svg = d3.select(graph)
              .append("svg")
              .attr("width", w)
              .attr("height", h);

// Use fetch to get JSON data
fetch(url)
.then(res => res.json())
.then(data => {
    // define x and y scales
    const xScale = d3.scaleLinear()
                     .domain([d3.min(data, d => d["Year"]) - 1, d3.max(data, d => d["Year"]) + 1])
                     .range([padding, w - padding]);
    const yScale = d3.scaleLinear()
                     .domain([d3.max(data, d => d["Seconds"]), d3.min(data, d => d["Seconds"])])
                     .range([h - padding, padding]);

    // functions to create axis
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format(".0f"));
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d => format(d));

    // add axis to svg
    svg.append("g")
       .attr("transform", "translate(0," + (h - padding) + ")")
       .call(xAxis)
       .attr("id", "x-axis");
    svg.append("g")
       .attr("transform", "translate(" + padding + ",0)")
       .call(yAxis)
       .attr("id", "y-axis");

    // plot points using year as x and time as y
    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", d => xScale(d["Year"]))
       .attr("cy", d => yScale(d["Seconds"]))
       .attr("r", r)
       .attr("class", "dot")
       .attr("data-xvalue", d => d["Year"])
       .attr("data-yvalue", d => d["Seconds"]);
});

// Thanks https://stackoverflow.com/questions/61791234/how-to-display-countdown-timer-in-react for time formatting
// Pads a zero if the digit is one (less than 10)
const padTime = time => {
    return time < 10 ? `0${time}` : `${time}`;
}

const format = time => {
    // Gets minutes using integer division
    const minutes = Math.floor(time / 60);

    // Get remainder seconds
    const seconds = time % 60;

    // Return formatted sring using padTime for seconds
    return `${padTime(minutes)}:${padTime(seconds)}`;
}
