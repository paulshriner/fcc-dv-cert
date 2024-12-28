// URLs for dataset
const urls = {"ks": "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json", "movie": "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json", "vg": "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"};

// References from HTML
const title = d3.select("#title");
const description = d3.select("#description");
const graph = d3.select("#graph");
const gameBtn = document.getElementById("game-btn");
const movieBtn = document.getElementById("movie-btn");
const kickstarterBtn = document.getElementById("kickstarter-btn");

// Tree map constants
const tw = 1000;
const th = 750;
const tpadding = 60;

// Legend constants
const lw = 510;
const lh = 180;

// create svg element for tree map
const tSVG = graph.append("svg")
                 .attr("width", tw)
                 .attr("height", th);

// create svg element for legend
const legendSVG = graph.append("svg")
                       .attr("width", lw)
                       .attr("height", lh)
                       .attr("id", "legend");

// create tooltip element
const tooltip = graph.append("div")
                     .attr("id", "tooltip");

// Color values for tree map
// Used https://www.gigacalculator.com/randomizers/random-color-generator.php to generate color values
const colors = ["#dd66ac", "#19cced", "#188723", "#3572e3", "#d2c1b1", "#f4477b", "#576168", "#de9473", "#f20681", "#250c7f", "#401269", "#d0ccba", "#6e4964", "#62e384", "#26c2c0", "#47ca7d", "#57e610", "#1dbb9f"];

// Generates page for video games (also the default page)
const videoGames = url => {
    // Add title, description
    title.text("Video Game Sales");
    description.text("Top 100 Most Sold Video Games Grouped by Platform");

    // Render the tree map
    cleanup();
    renderPage(url);
}

// Generates page for movies
const movies = url => {
    // Add title, description
    title.text("Movie Sales");
    description.text("Top 100 Highest Grossing Movies Grouped By Genre");

    // Render the tree map
    cleanup();
    renderPage(url);
}

// Generates page for kickstarter
const kickstarter = url => {
    // Add title, description
    title.text("Kickstarter Pledges");
    description.text("Top 100 Most Pledged Kickstarter Campaigns Grouped By Category");

    // Render the tree map
    cleanup();
    renderPage(url);
}

// Generates a random UUID
// Thanks https://webtips.dev/how-to-make-stunning-data-visualizations-with-d3-js
const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);

        return v.toString(16);
    });
}

const renderPage = url => {
    // Use fetch to get JSON data
    fetch(url)
    .then(res => res.json())
    .then(data => {
        // Thanks https://d3-graph-gallery.com/graph/treemap_json.html for help with tree map
        // Calculates size for each block
        let root = d3.hierarchy(data).sum(d => d.value);

        // Used for colors of blocks
        let color = -1;
        let system = "";
        let xLine = -1;
        let yLine = 0;

        // Calculates position for each block
        d3.treemap()
          .size([tw, th])
          (root);

        // Adds blocks to svg
        tSVG.selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("id", d => d.nodeId = uuidv4())
            .attr("class", "tile")
            .attr("data-name", d => d.data.name)
            .attr("data-category", d => d.data.category)
            .attr("data-value", d => d.data.value)
            .style("stroke", "white")
            .style("fill", d => {
                // Change color for different system
                if (d.data.category !== system) {
                    ++color;
                    system = d.data.category;

                    // Add color to legend
                    legendSVG.append("g")
                             .attr("id", "c" + color)
                             .append("rect")
                             .attr("y", () => {
                                // have 3 items per line
                                if (xLine >= 2) {
                                    ++yLine;
                                    xLine = -1;
                                }

                                return 30 * yLine;
                             })
                             .attr("x", () => {
                                ++xLine;
                                return xLine * 160;
                             })
                             .attr("width", 20)
                             .attr("height", 20)
                             .attr("class", "legend-item")
                             .style("fill", colors[color]);

                    // Add text to color
                    legendSVG.select("#c" + color)
                             .append("text")
                             .attr("y", (30 * yLine) + 20)
                             .attr("x", (xLine * 160) + 30)
                             .text(system);
                }

                return colors[color];
            })
            .on("mousemove", (d, i) => {
                // tooltip will move as cursor moves around blocks
                tooltip.attr("data-value", i.data.value)
                       .style("left", d.pageX + "px")
                       .style("top", d.pageY + "px")
                       .style("opacity", 0.9)
                       .text("Name: " + i.data.name + "\nCategory: " + i.data.category + "\nValue: " + i.data.value);
            });

        // hide tooltip on leave
        tSVG.on("mouseleave", () => tooltip.style("opacity", 0));

        // Thanks https://webtips.dev/how-to-make-stunning-data-visualizations-with-d3-js for clipPath
        // This makes it so text cuts off at end of block instead of cutting into other blocks
        tSVG.selectAll("clipPath")
            .data(root.leaves())
            .enter()
            .append("clipPath") 
            .attr("id", d => d.clipId = uuidv4())
            .append("use")
            .attr("href", d => `#${d.nodeId}`);

        // Add text labels
        tSVG.selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr("clip-path", d => `url(#${d.clipId})`)
            .attr("x", d => d.x0 + 5)
            .attr("y", d => d.y0 + 13)
            .text(d => d.data.name)
            .attr("font-size", "12px")
            .attr("fill", "white");
    });
}

// Clean elements from svgs
const cleanup = () => {
    tSVG.selectAll("rect").remove();
    tSVG.selectAll("clipPath").remove();
    tSVG.selectAll("text").remove();
    legendSVG.selectAll("g").remove();
}

// Actions for when page first loads
window.onload = () => {
    videoGames(urls.vg);
}

// Actions for video game button
gameBtn.addEventListener("click", () => {
    videoGames(urls.vg);
});

// Actions for movie button
movieBtn.addEventListener("click", () => {
    movies(urls.movie);
});

// Actions for kickstarter button
kickstarterBtn.addEventListener("click", () => {
    kickstarter(urls.ks);
});
