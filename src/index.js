import {SpaceX} from "./api/spacex";
import * as d3 from "d3";
import * as Geo from './geo.json'

document.addEventListener("DOMContentLoaded", setup)

function setup(){
    const spaceX = new SpaceX();
    spaceX.launches().then(data=>{
        const listContainer = document.getElementById("listContainer")
        renderLaunches(data, listContainer);
        drawMap();
    })
}

function renderLaunches(launches, container){
    const list = document.createElement("ul");
    launches.forEach(launch=>{
        const item = document.createElement("li");
        item.innerHTML = launch.name;
        list.appendChild(item);
    })
    container.replaceChildren(list);
}

function drawMap(){
    const width = 640;
    const height = 480;
    const margin = {top: 20, right: 10, bottom: 40, left: 100};
    const svg = d3.select('#map').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    const projection = d3.geoMercator()
        .scale(70)
        .center([0,20])
        .translate([width / 2 - margin.left, height / 2]);

    const spaceX = new SpaceX();
    spaceX.launchpads().then(data=>{
        for (let i = 0; i < data.length; i++) {
            coords = projection([data[i].longitude, data[i].latitude])
            svg.append("circle")
            .attr("cx", coords[0])
            .attr("cy", coords[1])
            .attr("r", 2)
            .attr("fill", "blue");
        }
    })

    /*item.addEventListener("mouseover", () => {
        const spaceX = new SpaceX();
        spaceX.launchpad(launch.launchpad).then(data=>{
            coords = projection([data.longitude, data.latitude])
            svg.append("circle")
            .attr("cx", coords[0])
            .attr("cy", coords[1])
            .attr("r", 5)
            .attr("fill", "green");
        })
    })

    item.addEventListener("mouseout", () => {

    })*/

    svg.append("g")
        .selectAll("path")
        .data(Geo.features)
        .enter()
        .append("path")
        .attr("class", "topo")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .style("opacity", .7)
}
