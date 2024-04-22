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
            containerWidth: 500,
            containerHeight: 440,
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

        console.log(vis.data)
        vis.characterSaidCounter = {}
        vis.importantCharacter = ["Alfred", "Barbara", "Batman", "Bruce", "Bullock", "Catwoman", "Dick", "Gordon", "Harley",
                                  "Hill", "Ivy", "Joker", "Robin", "Penguin", "Scarecrow", "Summer", "Thorne", "Two-Face"]
        vis.importantCharacter.forEach(d => {
            vis.characterSaidCounter[d] = 0
        })
        vis.data.forEach(d => {
            if (vis.sceneArray[d.Episode][d.Scene].includes(vis.character)) {
                vis.sceneArray[d.Episode][d.Scene].forEach(character => {
                    if (character != vis.character && vis.importantCharacter.includes(character)) {
                        vis.characterSaidCounter[character] = vis.characterSaidCounter[character] + 1
                    }
                })
            }
        })

        // Create items array
        var items = Object.keys(vis.characterSaidCounter).map(function(key) {
        return [key, vis.characterSaidCounter[key]];
        });

        // Sort the array based on the second element
        items.sort(function(first, second) {
        return second[1] - first[1];
        });

        // Create a new array with only the first 5 items
        vis.characterSaidCounter = items.slice(0, 5)
        console.log(vis.characterSaidCounter)
        
        // Y axis
        vis.yScale = d3.scaleBand()
            .range([0, vis.width])
            .domain(vis.characterSaidCounter.map(d => d[0]))
            .padding(0.2);

        vis.xScale = d3.scaleLinear()
            .domain([d3.max(vis.characterSaidCounter, d => d[1]), 0]) // Reverse the domain to start from max to min
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
        .text("Number of times talked");

        vis.svg.append('text')
            .attr('x', -65)
            .attr('y', -20)
            .attr('font-size', '16px')
            .attr('dy', '.71em')
            .text("Frequency");

        vis.svg.append('text')
            .attr('x', vis.width / 2)
            .attr('y', -40)
            .attr('font-size', "16px")
            .style('text-anchor', 'middle')
            .attr('dy', '.71em')
            .text(`Who ${vis.character} talks to the most`);

        // Convert characterCount to histogram bins
        vis.histogramData = vis.characterSaidCounter.map(d => ({
            episode: d[0],
            frequency: d[1]
        }));

        // Draw histogram bars
        vis.svg.selectAll(".bar")
            .data(vis.histogramData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("y", d => vis.yScale(d.episode))
            .attr("x", 1)
            .attr("height", vis.yScale.bandwidth())
            .attr("width", d => vis.xScale(d.frequency))
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
                            <h3 class="tooltip-title">${vis.character}</h3>
                            <h4>Lines of Dialogue: ${d.frequency}</h4>
                        </div>`
                    );
                });
    }

    updateVis() {
        let vis = this;

        d3.selectAll("svg text")
        .filter(function() {
            return /^Who/.test(d3.select(this).text());  // Check if text begins with "Histogram"
        })
        .text(`Who ${vis.character} talks to the most`);

        vis.characterSaidCounter = {}
        vis.importantCharacter.forEach(d => {
            vis.characterSaidCounter[d] = 0
        })
        vis.data.forEach(d => {
            if (vis.sceneArray[d.Episode][d.Scene].includes(vis.character)) {
                vis.sceneArray[d.Episode][d.Scene].forEach(character => {
                    if (character != vis.character && vis.importantCharacter.includes(character)) {
                        vis.characterSaidCounter[character] = vis.characterSaidCounter[character] + 1
                    }
                })
            }
        })

        // Create items array
        var items = Object.keys(vis.characterSaidCounter).map(function(key) {
        return [key, vis.characterSaidCounter[key]];
        });

        // Sort the array based on the second element
        items.sort(function(first, second) {
            return second[1] - first[1];
        });

        // Create a new array with only the first 5 items
        vis.characterSaidCounter = items.slice(0, 5)

        console.log(vis.characterSaidCounter)

        // Update the domain of y scale with new data
        vis.yScale.domain(vis.characterSaidCounter.map(d => d[0]));

        // Update the y-axis
        vis.svg.select(".y-axis")
            .transition()
            .duration(500)
            .call(vis.yAxis);

        // Update the domain of x scale with new data
        vis.xScale.domain([]);

        // Update the x-axis
        vis.svg.select(".x-axis")
            .call(vis.xAxis);

        // Update the domain of x scale with new data
        vis.xScale.domain([d3.max(vis.characterSaidCounter, d => d[1]), 0]);

        // Update the x-axis
        vis.svg.select(".x-axis")
            .call(vis.xAxis);

        // Convert characterCount to histogram bins
        vis.histogramData = vis.characterSaidCounter.map(d => ({
            episode: d[0],
            frequency: d[1]
        }));

        // Update existing bars
        vis.bars = vis.svg.selectAll(".bar")
            .data(vis.histogramData);

        // Enter new bars
        vis.bars.enter().append("rect")
            .attr("class", "bar")
            .merge(vis.bars)
            .transition()
            .duration(500)
            .attr("y", d => vis.yScale(d.episode))
            .attr("x", 1)
            .attr("height", vis.yScale.bandwidth())
            .attr("width", d => vis.xScale(d.frequency))
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
                            <h3 class="tooltip-title">${vis.character}</h3>
                            <h4>Lines of Dialogue: ${d.frequency}</h4>
                        </div>`
                    );
                });;

        // Remove bars that are not needed
        vis.bars.exit().remove();
}}