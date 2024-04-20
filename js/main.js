let characterBarGraph, arcDiagram;

async function main() {
    await CsvDataParser.parseTVData();
    
    characterBarGraph = new CharacterBarGraph({ parentElement: '#graph'}, DataStore.filteredData, "Alfred");
    arcDiagram = new ArcDiagram({ parentElement: '#arc'}, DataStore.filteredData, CsvDataParser.sceneArray, 5)

    // For episodes Get the select element by its id
    const select = document.getElementById("episodes");

    for (let i = 1; i <= 60; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
    }

    document.getElementById("episodes").addEventListener("change", function() {
        value = document.getElementById("episodes").value
        arcDiagram.episode = value
        arcDiagram.updateVis()
    })


    // lil info about the char selected
    // Get the select element
    const characterSelect = document.getElementById('character');
    const characterDescription = document.getElementById('character-description');

    characterSelect.addEventListener('change', function() {
        const selectedCharacter = characterSelect.value;
        value = document.getElementById("character-selection").value
        characterBarGraph.character = value
        characterBarGraph.updateVis()

        switch(selectedCharacter) {
            case 'Batman':
                characterDescription.textContent = "Batman, also known as the Dark Knight, is a vigilante superhero who protects Gotham City from crime and corruption. With his vast wealth, advanced technology, and martial arts skills, Batman strikes fear into the hearts of criminals.";
                break;
            case 'Bruce Wayne':
                characterDescription.textContent = "Bruce Wayne is the billionaire philanthropist owner of Wayne Enterprises and the secret identity of Batman. Haunted by the murder of his parents, Bruce dedicates his life to fighting crime and seeking justice for the citizens of Gotham City.";
                break;
            case 'Catwoman':
                characterDescription.textContent = "Catwoman, also known as Selina Kyle, is a skilled thief and occasional ally of Batman. With her agility, stealth, and mastery of martial arts, Catwoman navigates the morally gray areas of Gotham City, often crossing paths with both heroes and villains.";
                break;
            case 'Commissioner Gordon':
                characterDescription.textContent = "Commissioner James Gordon is the head of the Gotham City Police Department and one of Batman's most trusted allies. With unwavering integrity and a dedication to justice, Gordon works tirelessly to maintain law and order in Gotham City, often relying on Batman's help to combat the city's rampant crime and corruption.";
                break;
            case 'Gordon':
                characterDescription.textContent = "Gordon is a recurring character in the Batman universe, often referring to Commissioner James Gordon. As an emblem of integrity and justice, Gordon serves as a beacon of hope in Gotham City, striving to uphold the law and protect its citizens from the city's many dangers.";
                break;
            case 'Maven':
                characterDescription.textContent = "Maven is a lesser-known character in the Batman mythos, often associated with the criminal underworld of Gotham City. With a mysterious and enigmatic persona, Maven operates in the shadows, manipulating events from behind the scenes to further their own agenda.";
                break;
            case 'Mr. Stern':
                characterDescription.textContent = "Mr. Stern is a minor character in the Batman universe, known for his involvement in Gotham City's financial sector. As a wealthy businessman with ties to various criminal enterprises, Mr. Stern often finds himself embroiled in the city's intrigue and corruption.";
                break;
            case 'Red Claw':
                characterDescription.textContent = "Red Claw is a formidable villain and terrorist leader who poses a significant threat to Gotham City. With her ruthless tactics and fanatical ideology, Red Claw seeks to destabilize the city and challenge Batman's authority at every turn.";
                break;
            default:
                characterDescription.textContent = ""; 
        }

        characterDescription.style.display = 'block';
    });

}

main()

