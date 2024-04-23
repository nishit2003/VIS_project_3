class WordCloud {
  // Class Constants & Attributes

  // TODO: Add as necessary

  // Constructor
  constructor() {
      // TODO: Implement if necessary
  }

  // Class Methods
  // method which creates the word cloud
  createWordCloud() {
    //console.log("Attempting to create word cloud.");  // testing
    //console.log("Words in word cloud:", DataStore.wordCloudArray);  // testing

    this.clearVis();    // remove old visualization

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#wordcloud").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Constructs a new cloud layout instance. It runs an algorithm to find the position of words that suits your requirements
    var layout = d3.layout.cloud()
      .size([width, height])
      .words(DataStore.wordCloudArray.map(function(d) { return {text: d}; }))
      .padding(10)
      .fontSize(60)
      .on("end", draw);
    layout.start();

    // This function takes the output of 'layout' above and draws the words
    function draw(words) {
      svg
        .append("g")
          .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
          .selectAll("text")
            .data(words)
          .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }
  }

  // method which clears the old visualization
  clearVis() {
    // Remove existing SVG element
    d3.select("#wordcloud")
        .select("svg")
        .remove();
  }
}