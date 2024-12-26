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
    const baseTemp = data.baseTemperature;
    
    // set description text
    description.text(points[0].year + " - " + points[points.length - 1].year + ": base temperature " + baseTemp + "°C");

    // define x and y scales
    const xScale = d3.scaleLinear()
                     .domain([d3.min(points, d => d.year), d3.max(points, d => d.year)])
                     .range([padding, w - padding]);
    const yScale = d3.scaleLinear()
                     .domain([d3.max(points, d => d.month) + 1, d3.min(points, d => d.month)])
                     .range([h - padding, padding]);

    // functions to create axis
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format(".0f"));
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d => getMonth(d));

    // plot data using years as x and months as y
    svg.selectAll("rect")
       .data(points)
       .enter()
       .append("rect")
       .attr("x", d => xScale(d.year))
       .attr("y", d => yScale(d.month))
       .attr("width", 10)
       .attr("height", d => yScale(d.month) - yScale(d.month - 1))
       .attr("class", "cell")
       .attr("data-month", d => d.month - 1)
       .attr("data-year", d => d.year)
       .attr("data-temp", d => d.variance + baseTemp)
       .style("fill", d => getColor(d.variance, baseTemp));

    // add axis to svg
    svg.append("g")
       .attr("transform", "translate(0," + (h - padding) + ")")
       .call(xAxis)
       .attr("id", "x-axis");
    svg.append("g")
       .attr("transform", "translate(" + padding + ",0)")
       .call(yAxis)
       .attr("id", "y-axis");
})

// Finds resulting color corresponding to variance of base temperature
const getColor = (variance, base) => {
    const result = base + variance;

    // Used https://rgbcolorpicker.com/ to find colors
    if (result <= 3.9)
        return "#0053ff";
    if (result <= 5.0)
        return "#008cff";
    if (result <= 6.1)
        return "#00c9ff";
    if (result <= 7.2)
        return "#00fffb";
    if (result <= 8.3)
        return "#fff500";
    if (result <= 9.5)
        return "#ffd200";
    if (result <= 10.6)
        return "#ff9500";
    if (result <= 11.7)
        return "#ff6700";

    return "#ff2e00";
}

// Takes a numeric month 1-12, returns the written month
const getMonth = (month) => {
    switch (month) {
        case 1:
            return "January";
        case 2:
            return "February";
        case 3:
            return "March";
        case 4:
            return "April";
        case 5:
            return "May";
        case 6:
            return "June";
        case 7:
            return "July";
        case 8:
            return "August";
        case 9:
            return "September";
        case 10:
            return "October";
        case 11:
            return "November";
        case 12:
            return "December";
        default:
            return "";
    }
}
