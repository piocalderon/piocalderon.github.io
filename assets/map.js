let content = document.getElementById('main');
let graph = document.getElementById('example');
content.insertBefore(graph, content.childNodes[0]);

graph.style.height = parseInt(0.75*main.clientWidth) + "px"


const width = main.clientWidth;
const height = main.clientHeight;
const countryList = ["Japan", "Taiwan", "Philippines", "Malaysia", "Thailand", "India", "Singapore", "Indonesia"];

let root = location.protocol + '//' + location.host;

let tooltip = d3.select("div#example")
    .append("div")
    .classed("tooltip", true)
    // .text("A simple tooltip")

Promise.all(
    [
        d3.json("/assets/countries.json"), 
        d3.json("/assets/GeoObs.json"),
        d3.csv("/assets/travel_posts/japan_tokyo.csv"),
        d3.csv("/assets/travel_posts/japan_kyoto.csv"),
        d3.csv("/assets/travel_posts/japan_osaka.csv"),
        d3.csv("/assets/travel_posts/taiwan_hualien.csv"),
        d3.csv("/assets/travel_posts/taiwan_alishan.csv"),
        d3.csv("/assets/travel_posts/taiwan_taichung.csv"),
        d3.csv("/assets/travel_posts/taiwan_taipei.csv"),
        d3.csv("/assets/travel_posts/philippines_sagada.csv"),
        d3.csv("/assets/travel_posts/malaysia_kuala lumpur.csv"),
        d3.csv("/assets/travel_posts/malaysia_johor bahru.csv"),
        d3.csv("/assets/travel_posts/malaysia_penang.csv"),
        d3.csv("/assets/travel_posts/thailand_bangkok.csv"),
        d3.csv("/assets/travel_posts/thailand_chiang mai.csv"),
        d3.csv("/assets/travel_posts/thailand_ayutthaya.csv"),
        d3.csv("/assets/travel_posts/india_new delhi.csv"),
        d3.csv("/assets/travel_posts/india_jaipur.csv"),
        d3.csv("/assets/travel_posts/india_agra.csv"),
        d3.csv("/assets/travel_posts/india_varanasi.csv"),
        d3.csv("/assets/travel_posts/singapore_singapore.csv"),
        d3.csv("/assets/travel_posts/indonesia_bali.csv"),
        d3.csv("/assets/travel_posts/thailand_chiang rai.csv"),
        d3.csv("/assets/travel_posts/thailand_phuket.csv")
    ]) 
    .then(showData)

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getIndexOfCity(city) {
    switch (city) {
        case "Tokyo":
            return 2
        case "Kyoto":
            return 3
        case "Osaka":
            return 4
        case "Hualien":
            return 5
        case "Alishan":
            return 6
        case "Taichung":
            return 7
        case "Taipei":
            return 8
        case "Sagada":
            return 9
        case "Kuala Lumpur":
            return 10
        case "Johor Bahru":
            return 11
        case "Penang":
            return 12
        case "Bangkok":
            return 13
        case "Chiang Mai":
            return 14
        case "Ayutthaya":
            return 15
        case "New Delhi":
            return 16
        case "Jaipur":
            return 17
        case "Agra":
            return 18
        case "Varanasi":
            return 19
        case "Singapore":
            return 20
        case "Bali":
            return 21
        case "Chiang Rai":
            return 22
        case "Phuket":
            return 23
        }
}

function getIndicesOfCountry(country) {
    switch (country) {
        case "Japan":
            return [2, 3, 4]
        case "Taiwan":
            return [5, 6, 7, 8]
        case "Philippines":
            return [9]
        case "Malaysia":
            return [10, 11, 12]
        case "Thailand":
            return [13, 14, 15, 22, 23]
        case "India":
            return [16, 17, 18, 19]
        case "Singapore":
            return [20]
        case "Indonesia":
            return [21]
    }
}


function showData(dataSources) {
    
    function constructTooltipHtmlOfCity(city) {
        text = '<h2 style="font-weight:bold;">' + city + "</h2>"
        posts = dataSources[getIndexOfCity(city)]
        for (post of posts) {
            text += "<p>" + post["post"] + "</p>"
        }
        return text
    }

    function constructTooltipHtmlOfCountry(country) {
        cityIndices = getIndicesOfCountry(country)
        text = '<h2 style="font-weight:bold;">' + country + "</h2>"
        // for (cityIndex of cityIndices) {
        //     posts = dataSources[cityIndex]
        //     for (post of posts) {
        //         text += "<p>" + post["post"] + "</p>"
        //     }
        // }
        return text
    }

    let countryData = dataSources[0]
    let cityLoc = dataSources[1]

    for (city of cityLoc.features) {
        city.properties.content = constructTooltipHtmlOfCity(city.properties.city)
    }

    for (country of countryData.features) {
        if (countryList.includes(country.properties.name)) {
            country.properties.content = constructTooltipHtmlOfCountry(country.properties.name)
        } else (
            country.properties.content = ""
        )
    }
    console.log(countryData)

    let chart = d3.select("div#example")
        .append("svg")
        .attr("id", "map")
        .attr("width", width)
        .attr("height", height)
        // .attr("preserveAspectRatio", "xMidYMid slice")
        // .style("border", "solid 3px black")
    
    let countries = chart.append("g")
    let cities = chart.append("g")

    let projection = d3.geoMercator()
        // .scale(470)
        .scale(width/1.5)
        .center([105, 15])
        .translate([width/2, height/2])

    let geoPath = d3.geoPath()
        .projection(projection)

    countries.selectAll("path")
        .data(countryData.features)
        .enter()
        .append("path")
        .classed("country", true)
        .attr("stroke", "gray")
        .attr("fill", d => countryList.includes(d.properties.name) ? "#EA738DFF" : "lightgray")
        .attr("d", geoPath)
        .on("mouseover", function(d) {
            // d3.selectAll("path.country").attr("fill", "white")
            
            d3.select(this).attr("fill", d => countryList.includes(d.properties.name) ? "#00539CFF" : "lightgray")
            tooltip
                .html(d.properties.content)
                .style("visibility", "visible")
        })
        .on("mousemove", function(d) {
            tooltip
                .style("top", (d3.event.pageY-20)+"px")
                .style("left", (d3.event.pageX+10)+"px")
        })
        .on("mouseout", function(d) {
            d3.selectAll("path.country").attr("fill", d => countryList.includes(d.properties.name) ? "#EA738DFF" : "lightgray")
            // d3.select(this)
            tooltip
                .style("visibility", "hidden")
        })
        .on("click", function(d) {
            if (countryList.includes(d.properties.name) )
                window.location.href = root + "/categories/#" + d.properties.name
        })


    cities.selectAll("path")
        .data(cityLoc.features)
        .enter()
        .filter(d=>d.properties.city!="Johor Bahru")
        .append("path")
        .attr("fill", "#FDD20EFF")
        .attr("stroke", "orange")
        .attr("stroke-width", "1px")
        .attr("d", geoPath)
        .on("mouseover", function(d) {
            d3.select(this).attr("fill", "#00539CFF").attr("cursor", "pointer")
            console.log(d.properties.city)
            tooltip
                .html(d.properties.content)
                .style("visibility", "visible")
        })
        .on("mousemove", function(d) {
            tooltip
                .style("top", (d3.event.pageY-20)+"px")
                .style("left", (d3.event.pageX+10)+"px")
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("fill", "#FDD20EFF")
            tooltip
                .style("visibility", "hidden")
        })
        .on("click", function(d) {
            window.location.href = root + "/" + d.properties.city.toLowerCase().replace(" ", "-")
        })

}