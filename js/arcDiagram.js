class ArcDiagram {
    constructor(_config, _data, _character) {
        // Hardcoded node names
        this.nodes = [{ name: "Batman" }, { name: "Joker" }, { name: "Catwoman" }];
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 900,
            containerHeight: 300,
            margin: _config.margin || { top: 50, right: 60, bottom: 50, left: 100 },
            tooltipPadding: _config.tooltipPadding || 15,
            };
    
        this.data = _data;
        this.character = _character
        this.initVis();
    }

    initVis() {
        let vis = this;
        vis.width = 900;
        vis.height = 300;

        // Append SVG to the parent element
        vis.svg = d3.select("#arc")
            .append("svg")
            .attr("width", vis.width + vis.config.margin.left + vis.config.margin.right)
            .attr("height", vis.height + vis.config.margin.top + vis.config.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.config.margin.left + "," + vis.config.margin.top + ")");

        // Position nodes on X-axis
        vis.xScale = d3.scalePoint()
            .range([0, vis.width])
            .domain(["Batman", "Joker", "Catwoman"]);

        // Add nodes (circles)
        vis.svg.selectAll("circle")
            .data(vis.nodes)
            .enter()
            .append("circle")
            .attr("cx", d => vis.xScale(d.name))
            .attr("cy", vis.height - 30)
            .attr("r", 8)
            .style("fill", "#69b3a2");

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
        vis.arcPaths = [
            `M ${vis.xScale("Batman")} ${vis.height - 30} Q ${(vis.xScale("Batman") + vis.xScale("Joker")) / 2} ${(vis.height - 300)}, ${vis.xScale("Joker")} ${vis.height - 30}`,
            `M ${vis.xScale("Joker")} ${vis.height - 30} Q ${(vis.xScale("Joker") + vis.xScale("Catwoman")) / 2} ${(vis.height - 300)}, ${vis.xScale("Catwoman")} ${vis.height - 30}`,
            `M ${vis.xScale("Catwoman")} ${vis.height - 30} Q ${(vis.xScale("Catwoman") + vis.xScale("Batman")) / 2} ${(vis.height - 300)}, ${vis.xScale("Batman")} ${vis.height - 30}`
        ];

        vis.arcPaths.forEach(path => {
            vis.svg.append("path")
                .attr("d", path)
                .style("fill", "none")
                .attr("stroke", "black");
        });

    }

    updateVis() {
        let vis = this;
        this.svg.selectAll("circle").remove(); // Remove existing circles
        vis.svg.selectAll("path").remove();
        vis.svg.selectAll("text").remove(); // Remove existing text elements
    
        // Define new nodes
        vis.nodes = [{ name: "Boy #1" }, { name: "Boy #2" }, { name: "Boy #3" }];
        vis.xScale.domain(["Boy #1", "Boy #2", "Boy #3"] )

        // Add circles for the new nodes
        vis.svg.selectAll("circle")
            .data(vis.nodes)
            .enter()
            .append("circle")
            .attr("cx", d => vis.xScale(d.name))
            .attr("cy", vis.height - 30)
            .attr("r", 8)
            .style("fill", "#69b3a2");
    
        // Add node labels for the new nodes
        vis.svg.selectAll("text")
            .data(vis.nodes)
            .enter()
            .append("text")
            .attr("x", d => vis.xScale(d.name))
            .attr("y", vis.height - 10)
            .text(d => d.name)
            .style("text-anchor", "middle");
    
        // Update the arc path to connect the new nodes
        const controlPointY = vis.height - 300; // Adjust the height of the control point
        vis.arcPaths = `M ${vis.xScale("Boy #1")} ${vis.height - 30} Q ${(vis.xScale("Boy #1") + vis.xScale("Boy #2")) / 2} ${controlPointY}, ${vis.xScale("Boy #2")} ${vis.height - 30}`;
    
        // Append the updated arc path to the SVG
        vis.svg.append("path")
            .attr("d", vis.arcPaths)
            .style("fill", "none")
            .attr("stroke", "black");
    }
    
}