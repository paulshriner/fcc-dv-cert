// URLs for dataset
const urls = {"ks": "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json", "movie": "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json", "vg": "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"};

// References from HTML
const title = d3.select("#title");
const description = d3.select("#description");
const graph = d3.select("#graph");
const gameBtn = document.getElementById("game-btn");
const movieBtn = document.getElementById("movie-btn");
const kickstarterBtn = document.getElementById("kickstarter-btn");

// Generates page for video games (also the default page)
const videoGames = (url) => {
    // Add title, description
    title.text("Video Game Sales");
    description.text("Top 100 Most Sold Video Games Grouped by Platform");
}

// Generates page for movies
const movies = (url) => {
    // Add title, description
    title.text("Movie Sales");
    description.text("Top 100 Highest Grossing Movies Grouped By Genre");
}

// Generates page for kickstarter
const kickstarter = (url) => {
    // Add title, description
    title.text("Kickstarter Pledges");
    description.text("Top 100 Most Pledged Kickstarter Campaigns Grouped By Category");
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
