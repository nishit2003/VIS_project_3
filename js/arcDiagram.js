class ArcDiagram {
    constructor(_config, _scene, _episode) {
        // Hardcoded node names
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 900,
            containerHeight: 300,
            margin: _config.margin || { top: 50, right: 60, bottom: 50, left: 100 },
            tooltipPadding: _config.tooltipPadding || 15,
            };
    
        this.sceneArray = _scene
        this.episode = _episode
        this.initVis();
    }

    initVis() {
        let vis = this;
        vis.width = 900;
        vis.height = 300;

        vis.importantCharacter = ["Alfred", "Barbara", "Batman", "Bruce", "Bullock", "Catwoman", "Dick", "Gordon", "Harley",
                                  "Hill", "Ivy", "Joker", "Robin", "Penguin", "Scarecrow", "Summer", "Thorne", "Two-face"]
                                  
        // Append SVG to the parent element
        vis.svg = d3.select("#arc")
            .append("svg")
            .attr("width", vis.width + vis.config.margin.left + vis.config.margin.right)
            .attr("height", vis.height + vis.config.margin.top + vis.config.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.config.margin.left + "," + vis.config.margin.top + ")");
            
        this.updateVis()

        }

        
    updateVis() {
        let vis = this;
        vis.svg.selectAll("circle").remove(); // Remove existing circles
        vis.svg.selectAll("path").remove();
        vis.svg.selectAll("text").remove(); // Remove existing text elements
        vis.nodes = []
        vis.episodeCharacters = []
        vis.links = {}
        for (const [key, value] of Object.entries(vis.sceneArray[vis.episode])) {
            value.forEach(d => {
                if (vis.importantCharacter.includes(d) && !vis.episodeCharacters.includes(d)) {
                    let node = {}
                    node.name = d
                    vis.episodeCharacters.push(d)
                    vis.nodes.push(node)
                    vis.links[d] = []
                }
            })
        }
        
        vis.xScale = d3.scalePoint()
            .range([0, vis.width])
            .domain(vis.episodeCharacters);
    
        // Add nodes (circles)
        vis.circles = vis.svg.selectAll("circle")
            .data(vis.nodes)
            .enter()
            .append("circle")
            .attr("cx", d => vis.xScale(d.name))
            .attr("cy", vis.height - 30)
            .attr("r", 8)
            .style("fill", "#69b3a2")

    
        // Add node labels
        vis.svg.selectAll("text")
            .data(vis.nodes)
            .enter()
            .append("text")
            .attr("x", d => vis.xScale(d.name))
            .attr("y", vis.height - 10)
            .text(d => d.name)
            .style("text-anchor", "middle");
    
        // Draw arcs between nodes
        vis.arcPaths = []
        for (const [key, value] of Object.entries(vis.sceneArray[vis.episode])) {
    
            for (let i = 0; i < value.length; i++) {
                for (let j = i + 1; j < value.length; j++) {
                    if (vis.importantCharacter.includes(value[j]) && vis.importantCharacter.includes(value[i])) {
                        let path = `M ${vis.xScale(value[i])} ${vis.height - 30} Q ${(vis.xScale(value[i]) + vis.xScale(value[j])) / 2} ${(vis.height - 300)}, ${vis.xScale(value[j])} ${vis.height - 30}`
                        vis.links[value[i]].push(path)
                        vis.links[value[j]].push(path)
                        if (!vis.arcPaths.includes(path)) {
                            vis.arcPaths.push(path)
                        }
                    }
                }
            }
        }
    
        vis.arcPaths.forEach(path => {
            vis.svg.append("path")
                .attr("d", path)
                .style("fill", "none")
                .attr("stroke", "black")
        });

        vis.circles
        .on('mouseover', function(event,d){
            vis.circles.style('fill', "#B8B8B8")
            d3.select(this).style('fill', '#69b3b2')
            vis.svg.selectAll("path")
                .each(function() {
                    let path = d3.select(this);
                    path.style("opacity", vis.links[d.name].includes(path.attr("d")) ? 1 : 0.2)
                });
        })
        .on('mouseout', function(event,d){
            vis.circles.style('fill', "#69b3a2")
            vis.svg.selectAll("path")
                .each(function() {
                    let path = d3.select(this);
                    path.style("opacity", 2)
                });
        })
    }

    
}