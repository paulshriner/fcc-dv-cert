// URL for dataset
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// References from HTML
const graph = document.getElementById("graph");

// Use fetch to get JSON data
fetch(url)
.then(res => res.json())
.then(data => {
    const points = data.data;
    graph.innerHTML = JSON.stringify(points);
});

// extract year from date with format "YYYY-MM-DD"
const getYear = date => date.slice(0, 4);

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
