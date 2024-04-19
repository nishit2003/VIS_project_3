class ArcDiagram {
    constructor() {
        // Hardcoded node names
        this.nodes = [{ name: "Batman" }, { name: "Joker" }, { name: "Catwoman" }];

        // Initialize visualization
        this.initVis();
    }

    initVis() {
        let vis = this;
        vis.width = 900;
        vis.height = 600;
        let margin = { top: 50, right: 60, bottom: 50, left: 100 };

        // Append SVG to the parent element
        vis.svg = d3.select("#arc")
            .append("svg")
            .attr("width", vis.width + margin.left + margin.right)
            .attr("height", vis.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
            `M ${vis.xScale("Batman")} ${vis.height - 30} Q ${(vis.xScale("Batman") + vis.xScale("Joker")) / 2} ${(vis.height - 100)}, ${vis.xScale("Joker")} ${vis.height - 30}`,
            `M ${vis.xScale("Joker")} ${vis.height - 30} Q ${(vis.xScale("Joker") + vis.xScale("Catwoman")) / 2} ${(vis.height - 100)}, ${vis.xScale("Catwoman")} ${vis.height - 30}`,
            `M ${vis.xScale("Catwoman")} ${vis.height - 30} Q ${(vis.xScale("Catwoman") + vis.xScale("Batman")) / 2} ${(vis.height - 100)}, ${vis.xScale("Batman")} ${vis.height - 30}`
        ];

        vis.arcPaths.forEach(path => {
            vis.svg.append("path")
                .attr("d", path)
                .style("fill", "none")
                .attr("stroke", "black");
        });

    }

    updateVis() {
        // Remove existing arcs
        console.log("hi")
        let vis = this;
        vis.svg.selectAll("path").remove();

        // Draw arcs between nodes (only Batman and Catwoman)
        vis.arcPaths = `M ${vis.xScale("Batman")} ${vis.height - 30} Q ${(vis.xScale("Batman") + vis.xScale("Catwoman")) / 2} ${(vis.height - 100)}, ${vis.xScale("Catwoman")} ${vis.height - 30}`;

        vis.svg.append("path")
            .attr("d", vis.arcPaths)
            .style("fill", "none")
            .attr("stroke", "black");
    }
}