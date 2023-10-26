import {SpaceX} from "./api/spacex";
import * as d3 from "d3";
import * as Geo from './geo.json'

document.addEventListener("DOMContentLoaded", setup)

let svg;
const width = 640;
const height = 480;
const margin = {top: 20, right: 10, bottom: 40, left: 100};
const projection = d3.geoMercator()
    .scale(70)
    .center([0,20])
    .translate([width / 2 - margin.left, height / 2]);
const spaceX = new SpaceX();
let launchpads = [];
spaceX.launchpads().then(data => {launchpads = data});

function setup(){
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

        item.addEventListener("mouseover", () => {
            launchpads.forEach(launchpad => {
                if (launchpad.id === launch.launchpad) {
                    coords = projection([launchpad.longitude, launchpad.latitude])
                    circle = document.getElementById("flypoint");
                    circle.setAttribute("cx", coords[0]);
                    circle.setAttribute("cy", coords[1]);
                }
            })
        })

        /*item.addEventListener("mouseover", () => {
            spaceX.launchpad(launch.launchpad).then(data=>{
                coords = projection([data.longitude, data.latitude])
                circle = document.getElementById("flypoint");
                circle.setAttribute("cx", coords[0]);
                circle.setAttribute("cy", coords[1]);
            })
        })*/
    })
    container.replaceChildren(list);
}

function drawMap(){
    svg = d3.select('#map').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
            spaceX.launchpads().then(data=>{
        for (let i = 0; i < data.length; i++) {
            coords = projection([data[i].longitude, data[i].latitude])
            svg.append("circle")
            .attr("cx", coords[0])
            .attr("cy", coords[1])
            .attr("r", 5)
            .attr("fill", "red");
        }
    })

    svg.append("circle")
            .attr("cx", -1000)
            .attr("cy", -1000)
            .attr("r", 10)
            .attr("fill", "green")
            .attr("id", "flypoint");

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
