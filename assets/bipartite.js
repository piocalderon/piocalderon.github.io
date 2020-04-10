let content = document.getElementById('main');
let graph = document.getElementById('example');
content.insertBefore(graph, content.childNodes[0]);

console.log(parseInt(main.clientWidth))
console.log(parseInt(0.75*main.clientWidth))
graph.style.height = parseInt(0.75*main.clientWidth) + "px"
console.log(main.clientHeight)

const chartWidth = main.clientWidth;
const chartHeight = main.clientHeight;
const nodeSize = main.clientWidth/13;

let root = location.protocol + '//' + location.host;

let tooltip = d3.select("div#example")
    .append("div")
    .classed("tooltip", true)
    .attr("display", "inline-block")
    // .style("top", window.innerHeight/2)
    // .style("left", window.innerWidth/2)

let simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(
                d => d.id
            ).distance(chartWidth/2))
        // .force("charge", d3.forceManyBody().strength(-50))
        .force("center", d3.forceCenter(parseInt(chartWidth/2.5), parseInt(chartHeight/2.2)))
        .force("collide",d3.forceCollide(chartWidth/18))
        .force("forceX", d3.forceX().x(d => (d.type == "Media" ? 0.2*chartWidth : 0.9*chartWidth)))
        .force("forceY", d3.forceY().y(chartHeight))

function dragger(simulation) {
    onDragStart = function(d) {
        if (!d3.event.active) simulation.alphaTarget(0.2).restart();
        d.fx = d.x
        d.fy = d.y
        // d3.select(".tooltip").style("visibility", "hidden")
    }

    onDrag = function(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
        d3.select(".tooltip").style("visibility", "hidden")

    }

    onDragEnd = function(d) {
        if (!d3.event.active) simulation.alphaTarget(0).restart();
        d.fx = null
        d.fy = null

        // tooltip.attr("visibility", "visible")
    }

    return d3.drag()
        .on("start", onDragStart)
        .on("drag", onDrag)
        .on("end", onDragEnd)
    }

function createElements(data) {
    dataNodes = data.nodes.filter(d => d.type === "Data")
    mediaNodes = data.nodes.filter(d => d.type === "Media")

    let chart = d3.select("div#example")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        // .attr("width", "100%")
        // .attr("height", "100%")
        // .attr("viewbox", "0 0 800 500")
        .style("display", "block")
        // .style("margin", "auto")

    edges = chart
        .selectAll("line.link")
        .data(data.links)
        .enter()
        .append("line")
        .classed("link", true)
        .attr("stroke", "gray")
        .attr("stroke-width", 3)
        .attr("opacity", 0.2)
    

    nodes = chart
        .selectAll(".node")
        .data(data.nodes)
        .enter()
        .append("svg:image")
        .classed("node", true)
        // .attr("fill", "red")
        // .attr("r", 5)
        .attr("href", d => d.image)
        .attr("height", nodeSize)
        .attr("width", nodeSize)
        // .attr("x", 0)
        // .attr("y", 0)
        .on("mouseover", function(d) {
            console.log(d.x)
            let toHighlight = [];
            for (let l of data.links) {
                if ((d.type === "Media") && (l.source.id === d.id)) {
                    toHighlight.push(l.target.id);
                }
                else if ((d.type === "Data") && (l.target.id === d.id)) {
                    toHighlight.push(l.source.id);
                }
            }

            toHighlight = Array.from(new Set(toHighlight))
            // console.log(toHighlight)
            d3.selectAll(".node")
                .attr("height", function(k) {
                    if (toHighlight.includes(k.id)) {
                        return 1.2*nodeSize
                    } else {
                        return nodeSize
                    }
                })
                .attr("width", function(k) {
                    if (toHighlight.includes(k.id)) {
                        return 1.2*nodeSize
                    } else {
                        return nodeSize
                    }
                })

            d3.select(this)
                .attr("x", d=> d.x - 0.5*nodeSize)
                .attr("y", d=> d.y - 0.5*nodeSize)
                .attr("height", 1.75*nodeSize)
                .attr("width", 1.75*nodeSize)
                .attr("cursor", "pointer")

                // .attr("x", d=> d.x - 0.5*nodeSize)
                // .attr("y", d=> d.y - 0.5*nodeSize)

            // console.log(d3.select("line.link").nodes()[0].__data__)
            let allLinks = d3.selectAll("line.link").nodes();
            for (link of allLinks) {
                if ((link.__data__.source.id === d.id) || (link.__data__.target.id === d.id)) {
                    link.setAttribute("class", "link selected")
                } else {
                    link.setAttribute("class", "link background")
                }
            }
            // console.log(d3.selectAll("line.link").nodes())
            //     .attr("opacity", function(d) {

            //     })
            this.parentNode.appendChild(this);
            tooltip.text(d.id).style("visibility", "visible")
        })
        // .on("mousemove", d => tooltip
        //     .style("top", (d3.event.pageY-20)+"px")
        //     .style("left", (d3.event.pageX+10)+"px")
        // )
        .on("mouseout", function(d) { 
            d3.select(this).attr("height", nodeSize)
                .attr("width", nodeSize)
            tooltip.style("visibility", "hidden")
            
            let toHighlight = []
            for (let l of data.links) {
                if ((d.type === "Media") && (l.source.id === d.id)) {
                    toHighlight.push(l.target.id)
                }
                else if ((d.type === "Data") && (l.target.id === d.id)) {
                    toHighlight.push(l.source.id)
                }
            }
            toHighlight = Array.from(new Set(toHighlight))

            d3.selectAll(".node")
                .attr("height", nodeSize)
                .attr("width", nodeSize)
                .style("z-index", 1)

            let allLinks = d3.selectAll("line.link").nodes();
            for (link of allLinks) {
                link.setAttribute("class", "link unselected")
            }

            d3.select(this)
                .attr("x", d=> d.x)
                .attr("y", d=> d.y)
            
        })
        .on("click", function(d) {
            window.location.href = root + "/categories/#" + d.id.replace(" ", "%20")
        })
        .call(dragger(simulation))


        // .on("mouseover", function(d) {
        //     tooltip.text(d.id).style("visibility", "visible")
        // })
        // .on("mousemove", d => tooltip
        //     .style("top", (d3.event.pageY-20)+"px")
        //     .style("left", (d3.event.pageX+10)+"px")
        // )
        // .on("mouseout", d => tooltip.style("visibility", "hidden"))
       // .append("circle")
        // .classed("node", true)
        // .attr("stroke", "black")
        // .attr("stroke-width", 1.5)
        // .attr("r", d => rDict[d.type])
        // .attr("fill", d=> d.type === "tribe" ? "red" : "green")
        // .call(dragger(simulation))



    // nodes = contestant_nodes.merge(tribe_nodes)
    //     .call(dragger(simulation))



    // texts = d3.select("#networkArea")
    //     .selectAll("text.label")
    //     .data(data.nodes)
    //     .enter()
    //     .append("text")
    //     .classed("label", true)
    //     .text(d => d.id)
}


function updateElements() {
    nodes
        .attr("x", d => d.x)
        .attr("y", d => d.y)
    
    edges
        .attr("x1", d => d.source.x + nodeSize/2)
        .attr("x2", d => d.target.x + nodeSize/2)
        .attr("y1", d => d.source.y + nodeSize/2)
        .attr("y2", d => d.target.y + nodeSize/2)
    
    // texts
    //     .attr("x", d => 1.2*rDict[d.type] + d.x)
    //     .attr("y", d => d.y)
}


d3.json("/assets/databipartite.json").then(showData)

function showData(data) {
    createElements(data)

    simulation.nodes(data.nodes)
    simulation.force("link").links(data.links)
    simulation.on("tick", updateElements)

    // simulation.alpha(0.01)

}