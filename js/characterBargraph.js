class CharacterBarGraph {
    // Class Constants & Attributes
    // TODO: Add if necessary

    // Constructor
    /**
     * Class constructor with basic configuration.
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data, _character) {
        this.config = {
        parentElement: _config.parentElement,
        containerWidth: 900,
        containerHeight: 600,
        margin: _config.margin || { top: 50, right: 60, bottom: 50, left: 100 },
        tooltipPadding: _config.tooltipPadding || 15,
        };

        this.data = _data;
        this.character = _character
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // Create SVG
        vis.svg = d3.select(vis.config.parentElement)
        .append('svg')
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight)
        .append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        vis.characterSaidCounts = d3.rollup(vis.data.filter(d => d.Person == vis.character), v => v.length, d => d.Episode);

        // Convert the rollup map to an array of objects
        vis.characterCount = Array.from(vis.characterSaidCounts, ([episode, Value]) => ({ episode, Value }));
        
        // X axis
        vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .domain(vis.characterCount.map(d => d.episode))
            .padding(0.2);

        // Add Y axis
        vis.yScale = d3.scaleLinear()
            .domain([0, d3.max(vis.characterCount, d => d.Value)]) // Adjust domain based on the maximum frequency
            .range([vis.height, 0]);

        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale)

        vis.yAxis = d3.axisLeft(vis.yScale)

        vis.svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${vis.height})`) // Corrected translation
            .call(vis.xAxis)
            .selectAll("text")
            .style("text-anchor", "end");;

        // Append Y axis
        vis.svg.append("g")
            .attr("class", "y-axis")
            .call(vis.yAxis);

        // Append both axis titles
        vis.svg.append('text')
        .attr('y', vis.height + 37)
        .attr('x', vis.width / 2) // Set x position to half of the SVG width
        .attr('dy', '.71em')
        .style('text-anchor', 'middle')
        .attr('font-size', '16px')
        .text("Episode #");

        vis.svg.append('text')
            .attr('x', -65)
            .attr('y', -20)
            .attr('font-size', '16px')
            .attr('dy', '.71em')
            .text("Frequency");

        vis.svg.append('text')
            .attr('x', vis.width / 2.5)
            .attr('y', -40)
            .attr('font-size', "16px")
            .attr('dy', '.71em')
            .text(`${vis.character} Histogram`);

        // Convert characterCount to histogram bins
        vis.histogramData = vis.characterCount.map(d => ({
            episode: d.episode,
            frequency: d.Value
        }));

        // Draw histogram bars
        vis.svg.selectAll(".bar")
            .data(vis.histogramData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => vis.xScale(d.episode))
            .attr("y", d => vis.yScale(d.frequency))
            .attr("width", vis.xScale.bandwidth())
            .attr("height", d => vis.height - vis.yScale(d.frequency))
            .style("fill", "#69b3a2")
            .on('mouseover', function(event, d) {
                // create a tool tip
                d3.select("#tooltip")
                    .style("display", "block")
                    .style("left", event.pageX + vis.config.tooltipPadding + "px")
                    .style("top", event.pageY + vis.config.tooltipPadding + "px")
                    .style('opacity', 1)
                    .style('z-index', 1000000)
                    .html(
                        `<div class="tooltip-label">
                            <h3 class="tooltip-title">Episode: ${d.episode}</h3>
                            <h4>Lines of Dialogue: ${d.frequency}</h4>
                        </div>`
                    );
                })
            .on("mouseleave", () => {
                d3.select("#tooltip").style("display", "none");
            });
    }

updateVis() {
    let vis = this;

    // Update histogram title
    d3.selectAll("svg text")
        .filter(function() {
            return /Histogram$/.test(d3.select(this).text());
        })
        .text(`${vis.character} Histogram`);

    // Compute new character counts
    vis.characterSaidCounts = d3.rollup(vis.data.filter(d => d.Person === vis.character), v => v.length, d => d.Episode);
    vis.characterCount = Array.from(vis.characterSaidCounts, ([episode, Value]) => ({ episode, Value }));

    // Update the domain of y scale with new data
    vis.yScale.domain([0, d3.max(vis.characterCount, d => d.Value)]);

    // Update the y-axis
    vis.svg.select(".y-axis")
        .call(vis.yAxis);

    // Update the domain of x scale with new data
    vis.xScale.domain(vis.characterCount.map(d => d.episode));

    // Update the x-axis
    vis.svg.select(".x-axis")
        .call(vis.xAxis);

    // Convert characterCount to histogram bins
    vis.histogramData = vis.characterCount.map(d => ({
        episode: d.episode,
        frequency: d.Value
    }));

    // Update existing bars
    vis.bars = vis.svg.selectAll(".bar")
        .data(vis.histogramData);

    // Enter new bars
    vis.bars.enter().append("rect")
        .attr("class", "bar")
        .merge(vis.bars)
        .attr("x", d => vis.xScale(d.episode))
        .attr("width", vis.xScale.bandwidth())
        .attr("y", d => vis.yScale(d.frequency))
        .attr("height", d => vis.height - vis.yScale(d.frequency))
        .style("fill", "#69b3a2")
        .on('mouseover', function(event, d) {
            // create a tool tip
            d3.select("#tooltip")
                .style("display", "block")
                .style("left", event.pageX + vis.config.tooltipPadding + "px")
                .style("top", event.pageY + vis.config.tooltipPadding + "px")
                .style('opacity', 1)
                .style('z-index', 1000000)
                .html(
                    `<div class="tooltip-label">
                        <h3 class="tooltip-title">Episode: ${d.episode}</h3>
                        <h4>Lines of Dialogue: ${d.frequency}</h4>
                    </div>`
                );
            })
        .on("mouseleave", () => {
            d3.select("#tooltip").style("display", "none");
        });

    // Remove bars that are not needed
    vis.bars.exit().remove();
}

}