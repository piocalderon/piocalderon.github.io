var wide = document.getElementsByClassName('wrapper-main')[0];
var entry = document.getElementsByClassName('entry')[0];
var graph = document.getElementById('lollipopdiv');
const width = 0.95*wide.offsetWidth;
const height = 0.9*entry.offsetWidth;
const ns = Math.round(entry.offsetWidth/30);
const lolimargin = 2;
// higher outer to inner, bigger the image
const loliOuterToInner = 1.5
const loliInnerRatio = 0.8
const loliColorList = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#b1dd2b', '#fabebe', '#008080', '#e6beff', '#9a6324', '#a59a2b', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']

const urX = 6
const urY = 0.75
const urSize = 1.8*ns

d3.select("div#fakediv1")
    .style("height", height + "px")

var root = location.protocol + '//' + location.host;
  
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}


var svg = d3.select("div#lollipopdiv")
    .append("svg")
    .attr("id", "lollipop")
    .attr("width", width)
    .attr("height", height)
  
svg.append("clipPath")
    .attr("id", "avatar-clip-loli")
    .append("circle")
    .attr("cx", loliInnerRatio*ns)
    .attr("cy", loliInnerRatio * ns)
    .attr("r", loliInnerRatio*ns)

    svg.append("clipPath")
    .attr("id", "avatar-clip-loli-big")
    .append("circle")
    .attr("cx", loliInnerRatio*urSize)
    .attr("cy", loliInnerRatio * urSize)
    .attr("r", loliInnerRatio*urSize)


  // Parse the Data
d3.csv("../images/vgtranscript/dat_lollipop.csv", function(d) {
    d.gamechar_filename = "../images/vgtranscript/" + d.gamechar_filename
    d.seed_filename = "../images/vgtranscript/" + d.seed_filename
    return d
}).then(showData)

function showData(data) {

    var xVals = data.filter(d=>d.seed=="ff_10_Yuna").map(function(d) { return d.gamechar; })
    var sims = data.filter(d=>d.seed=="ff_10_Yuna").map(function(d) { return d.sim; })
    const uniqueDBSeries = data.map(d => d.game).filter( onlyUnique )

  // X axis
  var x = d3.scaleBand()
    .range([ lolimargin, width-lolimargin ])
    .domain(xVals)
    .padding(1);

  svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height-lolimargin) + ")")
    .call(d3.axisBottom(x).tickValues([]))
    // .selectAll("text")
    //   .attr("transform", "translate(-10,0)rotate(-45)")
    //   .style("text-anchor", "end");
  
  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 0.73])
    .range([ height-lolimargin, lolimargin+4*ns]);
//   svg.append("g")
//     .attr("transform", "translate(" + (lolimargin) + ",0)")
//     .call(d3.axisLeft(y));
  
  // Lines
  svg.selectAll("line.myline")
    .data(data.filter(d => (d.seed == "ff_10_Yuna")))
    .enter()
    .append("line")
      .attr("class", "myline")
      .attr("x1", function(d) { return x(d.gamechar); })
      .attr("x2", function(d) { return x(d.gamechar); })
      .attr("y1", function(d) { return y(d.sim); })
      .attr("y2", y(0))
      .attr("stroke", d=>loliColorList[uniqueDBSeries.indexOf(d.game)])
      .attr("stroke-width", 2)
      
  // Circles
  svg.selectAll("circle.mycircle")
    .data(data.filter(d => (d.seed == "ff_10_Yuna")))
        .enter()
        .append("circle")
        .attr("class", "mycircle")
        .attr("cx", function(d) { return x(d.gamechar); })
      .attr("cy", function(d) { return y(d.sim); })
      .attr("r", ns)
      .style("fill", "white")
      .attr("stroke", d=>loliColorList[uniqueDBSeries.indexOf(d.game)])
      .attr("stroke-width", 2)

 svg.selectAll("image")
    .data(data.filter(d => (d.seed == "ff_10_Yuna")))
    .enter()
    .append("image")
    .attr("class", "myimage")
    .attr("xlink:href", d => d.gamechar_filename)
    .attr("height", ns * loliOuterToInner)
    .attr("width", ns * loliOuterToInner)
    .attr("clip-path", "url(#avatar-clip-loli)")
    .attr("x", 0)
    .attr("y", 0)
      // .attr("x", d => xScale(d.old_x) - 0.5*(ns * loliOuterToInner))
      // .attr("y", d => yScale(d.old_y) - 0.5*(ns * loliOuterToInner))
      .attr("transform", function(d) {
          xTrans = x(d.gamechar) - 0.5*(ns * loliOuterToInner)
          yTrans = y(d.sim) - 0.5*(ns * loliOuterToInner)
          t = "translate(" + xTrans + "," + yTrans + ")"
          return t
      })


    svg.selectAll("text.mytextChar")
        .data(data.filter(d => (d.seed == "ff_10_Yuna")))
        .enter()
        .append("text")
        .attr("class", "mytextChar")
        .attr("x", function(d) { return x(d.gamechar); })
        .attr("y", function(d) { return y(d.sim) - 2.9*ns; })
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "70%")
        .text(d=>d.char)

    svg.selectAll("text.mytextGame")
        .data(data.filter(d => (d.seed == "ff_10_Yuna")))
        .enter()
        .append("text")
        .attr("class", "mytextGame")
        .attr("x", function(d) { return x(d.gamechar); })
        .attr("y", function(d) { return y(d.sim) - 2.2*ns; })
        .attr("text-anchor", "middle")
        .style("font-size", "70%")
        .text(d=>d.game.replace(/_/g, " ").toUpperCase())
  
    svg.selectAll("text.mytextSim")
        .data(data.filter(d => (d.seed == "ff_10_Yuna")))
        .enter()
        .append("text")
        .attr("class", "mytextSim")
        .attr("x", function(d) { return x(d.gamechar); })
        .attr("y", function(d) { return y(d.sim) - 1.5*ns; })
        .attr("text-anchor", "middle")
        .style("font-size", "70%")
        .text(d=>"("+d.sim+")")

    d3.select("path.domain")
      .style("stroke-width", 2)
      .style("stroke", "#d5d4d2")

    svg.selectAll("circle.bigcircle")
      .data(data.filter(d => (d.seed == "ff_10_Yuna")))
          .enter()
          .append("circle")
          .attr("class", "bigcircle")
          .attr("cx", function(d) { return (x(xVals[urX]) + x(xVals[urX+1]))/2; })
        .attr("cy", function(d) { return y(urY); })
        .attr("r", urSize)
        .style("fill", "white")
        .attr("stroke", "#ff5e5b")
        .attr("stroke-width", 3)

    svg.selectAll("image.bigimage")
        .data(data.filter(d => (d.seed == "ff_10_Yuna")))
        .enter()
        .append("image")
        .attr("class", "bigimage")
        .attr("xlink:href", d => d.seed_filename)
        .attr("height", urSize * loliOuterToInner)
        .attr("width", urSize * loliOuterToInner)
        .attr("clip-path", "url(#avatar-clip-loli-big)")
        .attr("x", 0)
        .attr("y", 0)
          // .attr("x", d => xScale(d.old_x) - 0.5*(ns * loliOuterToInner))
          // .attr("y", d => yScale(d.old_y) - 0.5*(ns * loliOuterToInner))
          .attr("transform", function(d) {
              xTrans = (x(xVals[urX]) + x(xVals[urX+1]))/2 - 0.5*(urSize * loliOuterToInner)
              yTrans = y(urY) - 0.5*(urSize * loliOuterToInner)
              t = "translate(" + xTrans + "," + yTrans + ")"
              return t
          })
    


    
    d3.select('#lollipop_selection')
      .on('change', function() {
          focusChar = d3.select("option:checked").node().getAttribute("value")
        console.log("changed")
        console.log(focusChar)
        
        var xVals = data.filter(d=>d.seed==focusChar).map(function(d) { return d.gamechar; })
        var sims = data.filter(d=>d.seed==focusChar).map(function(d) { return d.sim; })
    
        x.domain(xVals)
    
        d3.select("g.Axis")
            .attr("transform", "translate(0," + (height-lolimargin) + ")")
            .call(d3.axisBottom(x).tickValues([]))
      
        // y.domain([d3.min(sims), d3.max(sims)])

        svg.selectAll("line.myline")
            .data(data.filter(d => (d.seed == focusChar)))
            .transition()
            .duration(1000)
            .attr("x1", function(d) { return x(d.gamechar); })
            .attr("x2", function(d) { return x(d.gamechar); })
            .attr("y1", function(d) { return y(d.sim); })
            .attr("y2", y(0))
            .attr("stroke", d=>loliColorList[uniqueDBSeries.indexOf(d.game)])
    
        svg.selectAll("circle.mycircle")
            .data(data.filter(d => (d.seed == focusChar)))
            .transition()
            .duration(1000)
            .attr("cx", function(d) { return x(d.gamechar); })
            .attr("cy", function(d) { return y(d.sim); })
            .attr("r", ns)
            .style("fill", "white")
            .attr("stroke", d=>loliColorList[uniqueDBSeries.indexOf(d.game)])

        svg.selectAll("image.myimage")
            .data(data.filter(d => (d.seed == focusChar)))
            .attr("height", ns * loliOuterToInner)
            .attr("width", ns * loliOuterToInner)
            .attr("clip-path", "url(#avatar-clip-loli)")
            .attr("xlink:href", function(d) {
                console.log(d.gamechar_filename)
                return d.gamechar_filename})    
            .attr("x", 0)
            .attr("y", 0)
            .transition()
            .duration(1000)
            .attr("transform", function(d) {
                xTrans = x(d.gamechar) - 0.5*(ns * loliOuterToInner)
                yTrans = y(d.sim) - 0.5*(ns * loliOuterToInner)
                t = "translate(" + xTrans + "," + yTrans + ")"
                return t
            })

        svg.selectAll("text.mytextChar")
            .data(data.filter(d => (d.seed == focusChar)))
            .transition()
            .duration(1000)
            .attr("x", function(d) { return x(d.gamechar); })
            .attr("y", function(d) { return y(d.sim) - 2.9*ns; })
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("font-size", "70%")
            .text(d=>d.char)
    
        svg.selectAll("text.mytextGame")
            .data(data.filter(d => (d.seed == focusChar)))
            .transition()
            .duration(1000)
            .attr("x", function(d) { return x(d.gamechar); })
            .attr("y", function(d) { return y(d.sim) - 2.2*ns; })
            .attr("text-anchor", "middle")
            .style("font-size", "70%")
            .text(d=>d.game.replace(/_/g, " ").toUpperCase())
      
        svg.selectAll("text.mytextSim")
            .data(data.filter(d => (d.seed == focusChar)))
            .transition()
            .duration(1000)
            .attr("x", function(d) { return x(d.gamechar); })
            .attr("y", function(d) { return y(d.sim) - 1.5*ns; })
            .attr("text-anchor", "middle")
            .style("font-size", "70%")
            .text(d=>"("+d.sim+")")
      
          svg.selectAll("image.bigimage")
              .data(data.filter(d => (d.seed == focusChar)))
              .attr("xlink:href", d => d.seed_filename)
    })
}

