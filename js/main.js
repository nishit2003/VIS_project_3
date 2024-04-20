let characterBarGraph, arcDiagram;

async function main() {
    await CsvDataParser.parseTVData();

    // next we can generate the leaflet map
    characterBarGraph = new CharacterBarGraph({ parentElement: '#graph'}, DataStore.filteredData, "Joker");
    arcDiagram = new ArcDiagram({ parentElement: '#arc'}, DataStore.filteredData, CsvDataParser.sceneArray, 5)

    document.getElementById("character-selection").addEventListener("change", function(){
        value = document.getElementById("character-selection").value
        characterBarGraph.character = value
        characterBarGraph.updateVis()
        arcDiagram.episode = 3
        arcDiagram.updateVis()

    
    })
}

main()