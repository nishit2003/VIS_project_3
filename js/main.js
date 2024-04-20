/* This script will act as the main "runner" of the entire application. */
// some script-level (global) variables
let wordCloud, characterBarGraph, arcDiagram;;

// Because we've moved the CSV data parsing into a separate module, we need to ensure the rest of the program waits for CSV parsing to complete.
//  If you look at the in-class examples, most of the visualization creation is done INSIDE of the "d3.csv()" tag, so the synchronization is encapsulated.
//  Since we've split it out, we need to ensure the main runner waits for the parsing to complete. That is why I've launched the application in this way.
async function main() {
    await CsvDataParser.parseTVData();      // asynchronously parse TV data, waiting until completion before continuing
    console.log("Parsed Data:\n", DataStore.filteredData);  // prints the parsed data for development purposes

    // after data has been successfully parsed, lets create some visualizations
    wordCloud = new WordCloud();
    characterBarGraph = new CharacterBarGraph({ parentElement: '#graph'}, DataStore.filteredData, "Alfred");
    arcDiagram = new ArcDiagram({ parentElement: '#arc'}, DataStore.filteredData, CsvDataParser.sceneArray, 5)
    // TODO: Create any other visualizations here as well (charts, graphs, etc.)

    // calls method to populate the episode number combo box
    populateEpisodeComboBox()

    // lastly, we setup the UI event handlers (callbacks)
    setupUICallbacks();
}

function populateEpisodeComboBox() {
    // For episodes Get the combo box (select) element by its id
    const cmbEpisode = document.getElementById("episodes");
    
    const LAST_EPISODE_NUM = 60;    // there are 60 episodes in the dataset. Could be parsed dynamically if needed
    for (let i = 1; i <= LAST_EPISODE_NUM; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        cmbEpisode.appendChild(option);
    }
}

/* Script Execution Starts Here: */
main();