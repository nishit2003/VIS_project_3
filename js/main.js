let characterBarGraph, arcDiagram;

async function main() {
    await CsvDataParser.parseTVData();

    // next we can generate the leaflet map
    characterBarGraph = new CharacterBarGraph({ parentElement: '#graph'}, DataStore.filteredData, "Alfred");
    arcDiagram = new ArcDiagram({ parentElement: '#arc'}, DataStore.filteredData, CsvDataParser.sceneArray, 5)

    document.getElementById("character-selection").addEventListener("change", function(){
        value = document.getElementById("character-selection").value
        characterBarGraph.character = value
        characterBarGraph.updateVis()
    })

    document.getElementById("episodes").addEventListener("change", function() {
        value = document.getElementById("episodes").value
        arcDiagram.episode = value
        arcDiagram.updateVis()
    })

    // For episodes Get the select element by its id
    const select = document.getElementById("episodes");

    for (let i = 1; i <= 60; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
    }
}

main()