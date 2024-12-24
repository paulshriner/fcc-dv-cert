// URL for dataset
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

// References from HTML
const graph = document.getElementById("graph");

// Graph constants
const w = 1500;
const h = 750;
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
       .attr("x", 770)
       .attr("y", 725)
       .attr("id", "x-label")
       .style("font-size", "10px");

    // y axis
    svg.append("g")
       .attr("transform", "translate(" + padding + ",0)")
       .call(yAxis)
       .attr("id", "y-axis");
    svg.append("text")
       .text("Time in Minutes")
       .attr("transform", "rotate(-90)")
       .attr("x", -423)
       .attr("y", 15)
       .attr("id", "y-label")
       .style("font-size", "10px");

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
       .attr("data-yvalue", d => parse(d["Time"]))
       .style("fill", d => d["Doping"] === "" && "lightgreen")
       .on("mouseover", (d, i) => {
         // use rect for background color
         tooltip.append("rect")
                .attr("x", xScale(i["Year"]) + 10)
                .attr("y", yScale(parse(i["Time"])))
                .attr("width", 310)
                .attr("height", 70);

         // text in tooltip
         tooltip.attr("data-year", i["Year"])
                .style("opacity", 1)
                .append("text")
                .text(i["Name"] + ": " + i["Nationality"] + "\nYear: " + i["Year"] + ", Time: " + i["Time"] + "\n\n" + i["Doping"])
                .attr("x", xScale(i["Year"]) + 10)
                .attr("y", yScale(parse(i["Time"])) + 10);
       })
       .on("mouseleave", () => {
         // Thanks https://stackoverflow.com/questions/44079951/remove-element-in-d3-js for d3 remove()
         tooltip.style("opacity", 0)
                .select("text").remove();
         tooltip.select("rect").remove();
       });

    // create legend container
    const legend = svg.append("g")
                      .attr("id", "legend");
    
    // create no doping text
    legend.append("text")
          .text("No doping allegations")
          .attr("x", 1321)
          .attr("y", 300)
          .style("font-size", "10px");
   
    // create no doping shape
    legend.append("rect")
          .attr("x", 1430)
          .attr("y", 289)
          .attr("width", 15)
          .attr("height", 15)
          .style("fill", "lightgreen");

    // create doping text
    legend.append("text")
          .text("Riders with doping allegations")
          .attr("x", 1280)
          .attr("y", 317)
          .style("font-size", "10px");
   
    // create doping shape
    legend.append("rect")
          .attr("x", 1430)
          .attr("y", 307)
          .attr("width", 15)
          .attr("height", 15);
          
    // create tooltip container
    const tooltip = svg.append("g")
                       .attr("id", "tooltip");
});
