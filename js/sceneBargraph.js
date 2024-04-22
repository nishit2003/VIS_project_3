class SceneBargraph {
    // Class Constants & Attributes
    // TODO: Add if necessary

    // Constructor
    /**
     * Class constructor with basic configuration.
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data, _sceneArray, _character) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 900,
            containerHeight: 850,
            margin: _config.margin || { top: 50, right: 60, bottom: 50, left: 100 },
            tooltipPadding: _config.tooltipPadding || 15,
        };

        this.data = _data;
        this.sceneArray = _sceneArray
        this.character = _character;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        console.log(this.sceneArray)
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
        
        // Y axis
        vis.yScale = d3.scaleBand()
            .range([0, vis.width])
            .domain(vis.characterCount.map(d => d.episode))
            .padding(0.2);

        // Add X axis
        vis.xScale = d3.scaleLinear()
            .domain([d3.max(vis.characterCount, d => d.Value), 0]) // Adjust domain based on the maximum frequency
            .range([0, vis.height]);

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
            .attr("y", d => vis.yScale(d.episode))
            .attr("x", 0)
            .attr("height", vis.yScale.bandwidth())
            .attr("width", d => vis.height - vis.xScale(d.frequency))
            .style("fill", "#69b3a2");
    }

    updateVis() {
        let vis = this;

        d3.selectAll("svg text")
        .filter(function() {
            return /Histogram$/.test(d3.select(this).text());  // Check if text begin with a "C"
        })
        .text(`${vis.character} Histogram`);

        vis.characterSaidCounts = d3.rollup(vis.data.filter(d => d.Person == vis.character), v => v.length, d => d.Episode);

        // Convert the rollup map to an array of objects
        vis.characterCount = Array.from(vis.characterSaidCounts, ([episode, Value]) => ({ episode, Value }));

        // Update the domain of y scale with new data
        vis.yScale.domain([0, d3.max(vis.characterCount, d => d.Value)]);

        // Yes I am updating the x axis twice, this is bad code but this fixes a issue with some labels not lining up.
        // Update the domain of x scale with new data
        vis.xScale.domain([]);

        // Update the x-axis
        vis.svg.select(".x-axis")
            .call(vis.xAxis);

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
            .style("fill", "#69b3a2");

        // Remove bars that are not needed
        vis.bars.exit().remove();
    }
}