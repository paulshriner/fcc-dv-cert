// URL for dataset
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// References from HTML
const description = d3.select("#description");
const graph = d3.select("#graph");

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

// Heat map constants
const hw = 1500;
const hh = 750;
const r = 5;
const padding = 60;

// create svg element for heat map
const graphSVG = graph.append("svg")
                 .attr("width", hw)
                 .attr("height", hh);

// create tooltip element
const tooltip = graph.append("div")
                     .attr("id", "tooltip");

// Legend constants
const legendRecs = [[0, 3.9], [30, 5.0], [60, 6.1], [90, 7.2], [120, 8.3], [150, 9.5], [180, 10.6], [210, 11.7], [240, 12.8]];
const lw = 270;
const lh = 70;

// create svg element for legend
const legendSVG = graph.append("svg")
                       .attr("width", lw)
                       .attr("height", lh)
                       .attr("id", "legend");

// define x and y scales for legend
const lxScale = d3.scaleBand()
                    .domain([3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8])
                    .range([0, lw]);
const lxAxis = d3.axisBottom(lxScale);

// add rectangles to legend
legendSVG.selectAll("rect")
         .data(legendRecs)
         .enter()
         .append("rect")
         .attr("x", d => lxScale(d[1]))
         .attr("y", 10)
         .attr("width", 30)
         .attr("height", 40)
         .style("fill", d => getColor(d[1], 0));

// add axis to legend
legendSVG.append("g")
         .attr("transform", "translate(0," + (lh - 20) + ")")
         .call(lxAxis)
         .attr("id", "lx-axis");

// Use fetch to get JSON data
fetch(url)
.then(res => res.json())
.then(data => {
    const points = data.monthlyVariance;
    const baseTemp = data.baseTemperature;
    const years = [...new Set(points.map(d => d.year))];
    
    // set description text
    description.text(points[0].year + " - " + points[points.length - 1].year + ": base temperature " + baseTemp + "°C");

    // define x and y scales
    // Thanks https://forum.freecodecamp.org/t/visualize-data-with-a-heat-map/230440/5 for scaleBand
    // This makes it so the ticks start halfway in the bar rather than at the start
    const xScale = d3.scaleBand()
                     .domain(years)
                     .range([padding, hw - padding]);
    const yScale = d3.scaleBand()
                     .domain([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
                     .range([hh - padding, padding]);

    // functions to create axis
    const xAxis = d3.axisBottom(xScale)
                    .tickValues(years.filter(d => d % 10 === 0));
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d => getMonth(d));

    // plot data using years as x and months as y
    graphSVG.selectAll("rect")
       .data(points)
       .enter()
       .append("rect")
       .attr("x", d => xScale(d.year))
       .attr("y", d => yScale(d.month))
       .attr("width", 10)
       .attr("height", 52.5)
       .attr("class", "cell")
       .attr("data-month", d => d.month - 1)
       .attr("data-year", d => d.year)
       .attr("data-temp", d => d.variance + baseTemp)
       .style("fill", d => getColor(d.variance, baseTemp))
       .on("mouseover", (d, i) => {
        // text in tooltip
        tooltip.attr("data-year", i.year)
               .text(i.year + " - " + getMonth(i.month) + '\n' + Math.round((i.variance + baseTemp) * 10) / 10 + "°C\n" + Math.round(i.variance * 10) / 10 + "°C")
               .style("left", d.pageX + "px")
               .style("top", d.pageY + "px")
               .style("opacity", 0.9);
       });

    // hide tooltip on leave
    graphSVG.on("mouseleave", () => tooltip.style("opacity", 0));

    // add x axis to svg
    graphSVG.append("g")
       .attr("transform", "translate(0," + (hh - padding) + ")")
       .call(xAxis)
       .attr("id", "x-axis");
    graphSVG.append("text")
       .text("Years")
       .attr("x", 737)
       .attr("y", 725)
       .attr("id", "x-label")
       .style("font-size", "10px");

    // y axis
    graphSVG.append("g")
       .attr("transform", "translate(" + padding + ",0)")
       .call(yAxis)
       .attr("id", "y-axis");
    graphSVG.append("text")
       .text("Months")
       .attr("transform", "rotate(-90)")
       .attr("x", -393)
       .attr("y", 15)
       .attr("id", "y-label")
       .style("font-size", "10px");
})
