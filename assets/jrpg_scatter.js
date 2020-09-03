var wide = document.getElementsByClassName('wrapper-main')[0];
var entry = document.getElementsByClassName('entry')[0];

// d3.select("#scatterdiv")
//     .style("width", entry.offsetWidth)

var graph = document.getElementById('scatterdiv');
// content.insertBefore(graph, content.childNodes[0]);

// graph.style.height = parseInt(0.75*main.clientWidth) + "px"

const chartWidth = 0.95*wide.offsetWidth;
const chartHeight = 0.9*entry.offsetWidth;
const nodeSize = Math.round(entry.offsetWidth/60);
const hoverNodeSize = 5*nodeSize;
const margin = 7*nodeSize;
// higher outer to inner, bigger the image
const outerToInner = 1.5
const innerRatio = 0.8
const colorList = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#b1dd2b', '#fabebe', '#008080', '#e6beff', '#9a6324', '#a59a2b', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']

d3.select("div#fakediv2")
    .style("height", chartHeight + "px")

var root = location.protocol + '//' + location.host;
  
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}


//Read the data
d3.csv("../images/vgtranscript/dat_differencing_dbscan.csv", 
    function(data) {
        data["x"] = +data["x"]
        data["y"] = +data["y"]
        data["old_x"] = +data["old_x"]
        data["old_y"] = +data["old_y"]
        return data
    }
).then(showData)

function showData(data) {
    let state = 0;
    const uniqueSeries = data.map(d => d.group).filter( onlyUnique )
    const uniqueDBSeries = data.map(d => d.cluster_db).filter( onlyUnique )

    function constructTooltipHtml(d) {
        game = d.char.split("_").slice(0,-1).join(" ")
        charName = d.char.split("_").slice(-1)[0]
        text = '<p style="font-weight:bold;">' + charName + " (" + game.toUpperCase() + ")</p>"
        return text
    }

    const oldXExtents = d3.extent(data.map(d => d.old_x))
    const oldYExtents = d3.extent(data.map(d => d.old_y))
    const XExtents = d3.extent(data.map(d => d.x))
    const YExtents = d3.extent(data.map(d => d.y))

    var svg = d3.select("div#scatterdiv")
        .append("svg")
        .attr("id", "scatter")
        .attr("width", chartWidth)
        .attr("height", chartHeight)

    svg.append("clipPath")
        .attr("id", "avatar-clip")
        .append("circle")
        .attr("cx", innerRatio*nodeSize)
        .attr("cy", innerRatio * nodeSize)
        .attr("r", innerRatio*nodeSize)

    svg.append("clipPath")
        .attr("id", "avatar-clip-selected")
        .append("circle")
        .attr("cx", innerRatio*hoverNodeSize)
        .attr("cy", innerRatio * hoverNodeSize)
        .attr("r", innerRatio*hoverNodeSize)


    // var tooltip = d3.select("div#scatterdiv")
    //     .append("div")
    //     .classed("tooltip", true)
    
    var xScale = d3.scaleLinear()
        .range([margin, chartWidth-margin])
    var yScale = d3.scaleLinear()
        .range([chartHeight-margin, margin])

    xScale.domain(oldXExtents)
    yScale.domain(oldYExtents)

    dots = svg.append('g')
        .attr("class", "scatter")
        .selectAll("g.node")
        .data(data) 
        .enter()
        .append("g")
        .attr("class", "node")
    
    dots.append("circle")
        .attr("class", "classOutline")
        .attr("cx", d => xScale(d.old_x))
        .attr("cy", d => yScale(d.old_y))
        .attr("r", nodeSize)
        .style("fill", d => colorList[uniqueSeries.indexOf(d.group)])
        .style("opacity", 0.5)

    dots.append("image")
        .attr("class", "charImage")
        .attr("xlink:href", d => "../images/vgtranscript/" + d.filename)
        .attr("height", nodeSize * outerToInner)
        .attr("width", nodeSize * outerToInner)
        .attr("clip-path", "url(#avatar-clip)")
        .attr("x", 0)
        .attr("y", 0)
        // .attr("x", d => xScale(d.old_x) - 0.5*(nodeSize * outerToInner))
        // .attr("y", d => yScale(d.old_y) - 0.5*(nodeSize * outerToInner))
        .attr("transform", function(d) {
            xTrans = xScale(d.old_x) - 0.5*(nodeSize * outerToInner)
            yTrans = yScale(d.old_y) - 0.5*(nodeSize * outerToInner)
            t = "translate(" + xTrans + "," + yTrans + ")"
            return t
        })

    dots.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            xTrans = xScale(d.old_x)
            yTrans = yScale(d.old_y) - 1.1*hoverNodeSize
            t = "translate(" + xTrans + "," + yTrans + ")"
            return t
        })
        // .attr("visibilty", "hidden")
        .text(d => d.char.split("_").slice(-1)[0] + " (" + d.char.split("_").slice(0,-1).join(" ").toUpperCase() + ")")
        .style("font-weight", "bold")
        .style("font-size", "80%")
        .style("visibility", "hidden")


    d3.selectAll("g.node")
        .on("click", function(d) {            

            if (d3.select(this).select("circle").attr("r") == nodeSize) {
                this.parentNode.appendChild(this);

                d3.select(this).select("circle")
                    .attr("r", hoverNodeSize)
                    .style("opacity", 0.9)

                d3.select(this).select("image")
                    .attr("height", hoverNodeSize * outerToInner)
                    .attr("width", hoverNodeSize * outerToInner)
                    .attr("clip-path", "url(#avatar-clip-selected)")
                    .attr("transform", function(d) {
                        xTrans = xScale(d.old_x) - 0.5*(hoverNodeSize * outerToInner)
                        yTrans = yScale(d.old_y) - 0.5*(hoverNodeSize * outerToInner)
                        t = "translate(" + xTrans + "," + yTrans + ")"
                        return t
                    })
                
                d3.select(this).select("text")
                    .style("visibility", "visible")

            } else {
                this.parentNode.insertBefore(this, this.parentNode.firstChild)

                d3.select(this).select("circle")
                    .attr("r", nodeSize)
                    .style("opacity", 0.5)
    
                d3.select(this).select("image")
                    .attr("height", nodeSize * outerToInner)
                    .attr("width", nodeSize * outerToInner)
                    .attr("clip-path", "url(#avatar-clip)")
                    .attr("transform", function(d) {
                        xTrans = xScale(d.old_x) - 0.5*(nodeSize * outerToInner)
                        yTrans = yScale(d.old_y) - 0.5*(nodeSize * outerToInner)
                        t = "translate(" + xTrans + "," + yTrans + ")"
                        return t
                    })

                d3.select(this).select("text")
                    .style("visibility", "hidden")

            }
        })
        // .on("mouseover", function(d) {
        //     tooltip
        //         .html(constructTooltipHtml(d))
        //         .style("visibility", "visible")
        // })
        // .on("mousemove", function(d) {
        //     tooltip
        //         .style("top", (d3.event.pageY)+"px")
        //         .style("left", (d3.event.pageX)+"px")
        // })
        // .on("mouseout", function(d) {
        //     tooltip
        //         .style("visibility", "hidden")

        // })    

    function updateXY(newXVar, newYVar) {

        if (newXVar == "x") {
            xScale.domain(XExtents)
            yScale.domain(YExtents)
        } else {
            xScale.domain(oldXExtents)
            yScale.domain(oldYExtents)
        }
        
        d3.select("g.scatter").selectAll("g.node circle.classOutline")
            .transition()
            .duration(1000)
            .attr("cx", d => xScale(d[newXVar]))
            .attr("cy", d => yScale(d[newYVar]))

        d3.select("g.scatter").selectAll("g.node image.charImage")
            .transition()
            .duration(1000)
            .attr("transform", function(d) {
                r = d3.select(this.parentNode).select("circle").node().getAttribute("r")
                xTrans = xScale(d[newXVar]) - 0.5*(r * outerToInner)
                yTrans = yScale(d[newYVar]) - 0.5*(r * outerToInner)
                t = "translate(" + xTrans + "," + yTrans + ")"
                return t
            })

        d3.select("g.scatter").selectAll("g.node text")
            .transition()
            .duration(1000)
            .attr("transform", function(d) {
                    xTrans = xScale(d[newXVar])
                    yTrans = yScale(d[newYVar]) - 1.1*hoverNodeSize
                    t = "translate(" + xTrans + "," + yTrans + ")"
                    return t
            })
    
        d3.selectAll("g.node")
            .on("click", function(d) {            
    
                if (d3.select(this).select("circle").attr("r") == nodeSize) {
                    this.parentNode.appendChild(this);
    
                    d3.select(this).select("circle")
                        .attr("r", hoverNodeSize)
                        .style("opacity", 0.9)
    
                    d3.select(this).select("image")
                        .attr("height", hoverNodeSize * outerToInner)
                        .attr("width", hoverNodeSize * outerToInner)
                        .attr("clip-path", "url(#avatar-clip-selected)")
                        .attr("transform", function(d) {
                            xTrans = xScale(d[newXVar]) - 0.5*(hoverNodeSize * outerToInner)
                            yTrans = yScale(d[newYVar]) - 0.5*(hoverNodeSize * outerToInner)
                            t = "translate(" + xTrans + "," + yTrans + ")"
                            return t
                        })

                    d3.select(this).select("text")
                        .style("visibility", "visible")
    
                } else {
                    this.parentNode.insertBefore(this, this.parentNode.firstChild)
    
                    d3.select(this).select("circle")
                        .attr("r", nodeSize)
                        .style("opacity", 0.5)
        
                    d3.select(this).select("image")
                        .attr("height", nodeSize * outerToInner)
                        .attr("width", nodeSize * outerToInner)
                        .attr("clip-path", "url(#avatar-clip)")
                        .attr("transform", function(d) {
                            xTrans = xScale(d[newXVar]) - 0.5*(nodeSize * outerToInner)
                            yTrans = yScale(d[newYVar]) - 0.5*(nodeSize * outerToInner)
                            t = "translate(" + xTrans + "," + yTrans + ")"
                            return t
                        })

                    d3.select(this).select("text")
                        .style("visibility", "hidden")

                }
            })
            // .on("mouseover", function(d) {
            //     tooltip
            //         .html(constructTooltipHtml(d))
            //         .style("visibility", "visible")
            // })
            // .on("mousemove", function(d) {
            //     tooltip
            //         .style("top", (d3.event.pageY)+"px")
            //         .style("left", (d3.event.pageX)+"px")
            // })
            // .on("mouseout", function(d) {
            //     tooltip
            //         .style("visibility", "hidden")
    
            // })    
                        
    
    }
    
    function updateColors(newLabel, newSeries) {
        d3.selectAll(".classOutline")
            .transition()
            .duration(1000)
            .style("fill", d => colorList[newSeries.indexOf(d[newLabel])])
    }

    d3.select("#backButton").on("click", function(d) {
        console.log(state)
        if (state == 2) {
            updateColors("group", uniqueSeries)
            state = 1
            d3.select("p#number").transition()
            .duration(1000).text("2. By subtracting the respective mean, we arrive at game-independent character vectors.")
        } else if (state == 1) {
            updateXY("old_x", "old_y")
            state = 0
            d3.select("p#number").transition()
            .duration(1000).text("1. Each character vector needs to be decentered from its game cluster.")

        }
    })
    
    d3.select("#nextButton").on("click", function(d) {
        console.log(state)
        if (state == 0) {
            updateXY("x", "y")
            state = 1
            d3.select("p#number").transition()
            .duration(1000).text("2. By subtracting the respective mean, we arrive at game-independent character vectors.")
        } else if (state == 1) {
            updateColors("cluster_db", uniqueDBSeries)
            state = 2
            d3.select("p#number").transition()
            .duration(1000).text("3. Characters are shaded based on closest neighbors.")

        }
    })
    
}


//     // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
//     // Its opacity is set to 0: we don't see it by default.
//     var tooltip = d3.select("#my_dataviz")
//       .append("div")
//       .style("opacity", 0)
//       .attr("class", "tooltip")
//       .style("background-color", "white")
//       .style("border", "solid")
//       .style("border-width", "1px")
//       .style("border-radius", "5px")
//       .style("padding", "10px")
  
  
  
//     // A function that change this tooltip when the user hover a point.
//     // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
//     var mouseover = function(d) {
//       tooltip
//         .style("opacity", 1)
//     }
  
//     var mousemove = function(d) {
//       tooltip
//         .html("The exact value of<br>the Ground Living area is: " + d.GrLivArea)
//         .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
//         .style("top", (d3.mouse(this)[1]) + "px")
//     }
  
//     // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
//     var mouseleave = function(d) {
//       tooltip
//         .transition()
//         .duration(200)
//         .style("opacity", 0)
//     }
  
//     // Add dots
//     svg.append('g')
//       .selectAll("dot")
//       .data(data.filter(function(d,i){return i<50})) // the .filter part is just to keep a few dots on the chart, not all of them
//       .enter()
//       .append("circle")
//         .attr("cx", function (d) { return x(d.GrLivArea); } )
//         .attr("cy", function (d) { return y(d.SalePrice); } )
//         .attr("r", 7)
//         .style("fill", "#69b3a2")
//         .style("opacity", 0.3)
//         .style("stroke", "white")
//       .on("mouseover", mouseover )
//       .on("mousemove", mousemove )
//       .on("mouseleave", mouseleave )
  
//   })
  