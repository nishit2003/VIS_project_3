class WordSearchBarGraph {
    // Class Constants & Attributes
    // TODO: Add if necessary

    // Constructor
    /**
     * Class constructor with basic configuration.
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data, _currAttribute) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 900,
            containerHeight: 600,
            margin: _config.margin || { top: 50, right: 60, bottom: 50, left: 100 },
            tooltipPadding: _config.tooltipPadding || 15,
        };

        this.data = _data;
        this.currAttribute = _currAttribute
        this.initVis();
    }

    initVis() {
        let vis = this;
        
        this.clearVis();    // remove old visualization

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // Create SVG
        vis.svg = d3.select(vis.config.parentElement)
            .append('svg')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight)
            .append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        // Define scales
        const LAST_EPISODE_NUM = 60     // there are 60 episodes in the dataset. Could be parsed dynamically if needed
        vis.xScale = d3.scaleLinear()
            .range([0, vis.width])
            .domain([1, LAST_EPISODE_NUM]);

        // Y axis scale
        vis.yScale = d3.scaleLinear().range([vis.height, 0]);

        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale)
        vis.yAxis = d3.axisLeft(vis.yScale)
        
        vis.attributeCounts = d3.rollup(vis.data, v => v.length, d => d.Episode);

        // Convert the rollup map to an array of objects
        vis.attrCount = Array.from(vis.attributeCounts, ([episode, Value]) => ({ episode, Value }));

        // X axis
        vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .domain(vis.attrCount.map(d => d.episode))
            .padding(0.2);

        // Add Y axis
        vis.yScale = d3.scaleLinear()
            .domain([0, d3.max(vis.attrCount, d => d.Value)]) // Adjust domain based on the maximum frequency
            .range([vis.height, 0]);

        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale)

        vis.yAxis = d3.axisLeft(vis.yScale)

        // Update the domain of y scale with new data
        vis.yScale.domain([0, d3.max(vis.attrCount, d => d.Value)]);

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
            .text(`Histogram of '${vis.currAttribute.toLocaleUpperCase()}'`);

        // Convert attrCount to histogram bins
        vis.histogramData = vis.attrCount.map(d => ({
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
            .style("fill", "#69b3a2");
    }

    updateVis() {
        let vis = this;

        d3.selectAll("svg text")
            .filter(function() {
                return /Histogram$/.test(d3.select(this).text());  // Check if text begin with a "C"
            })
            .text(`${vis.currAttribute} Histogram`);

        vis.attributeCounts = d3.rollup(vis.data.filter(d => d.Person == vis.currAttribute), v => v.length, d => d.Episode);

        // Convert the rollup map to an array of objects
        vis.attrCount = Array.from(vis.attributeCounts, ([episode, Value]) => ({ episode, Value }));

        // Update the domain of y scale with new data
        vis.yScale.domain([0, d3.max(vis.attrCount, d => d.Value)]);

        // Update the domain of x scale with new data
        vis.xScale.domain(vis.attrCount.map(d => d.episode));

        // Update the x-axis
        vis.svg.select(".x-axis")
            .call(vis.xAxis);

        // Update the y-axis
        vis.svg.select(".y-axis")
            .call(vis.yAxis);

        // Convert characterCount to histogram bins
        vis.histogramData = vis.attrCount.map(d => ({
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

    // method which clears the old visualization
    clearVis() {
        let vis = this;

        // Remove existing SVG element
        d3.select(vis.config.parentElement)
            .select("svg")
            .remove();
    }
}