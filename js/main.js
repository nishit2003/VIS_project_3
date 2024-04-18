let characterGraph;

async function main() {
    await CsvDataParser.parseTVData();

    // next we can generate the leaflet map
    characterBarGraph = new CharacterBarGraph({ parentElement: '#graph'}, DataStore.filteredData, "Joker");
    console.log(DataStore.filteredData)

    document.getElementById("character-selection").addEventListener("change", function(){
        value = document.getElementById("character-selection").value
        console.log(value)
        characterBarGraph.character = value
        characterBarGraph.updateVis()
    
    })
}

main()