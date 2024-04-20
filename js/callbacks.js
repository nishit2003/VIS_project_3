/* This script houses a bunch of UI element callbacks. Things such as the button clicked, dropdown selection, or text entered, event handlers. */
function setupUICallbacks() {
    document.getElementById('characters').addEventListener('change', function() {
        const selectedCharacter = this.value;
        const characterDescription = document.getElementById('character-description');

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

    document.getElementById("btnCreateWordCloud").addEventListener("click", function() {
        //console.log("btnCreateWordCloud clicked!");   // for testing/development's sake

        // first of all, clear the word cloud contents before populating it again
        DataStore.wordCloudArray = [];

        const selectedEpisode = document.getElementById("episodes").value;
        const selectedCharacter = document.getElementById("characters").value;

        DataStore.filteredData.forEach(d => {
            const lineSaid = d["Said"];     // saves the line said for current entry in data file

            // word cloud should only be created for the currently selected episode & character
            if (
                lineSaid &&
                (typeof(lineSaid) === "string") &&
                (selectedEpisode == d["Episode"]) &&
                (selectedCharacter == d["Person"])
            ) {
                // Split the string into an array of words using whitespace as the separator
                const words = lineSaid.split(" ");
                
                // Add the words to the word cloud words array
                DataStore.wordCloudArray.push(...words);
            }
        });
    
        if (DataStore.wordCloudArray.length == 0) {
            // This is a creative way to notify to the user that a word cloud can't be created (no dialogue)
            //  Rather than simply doing nothing, we add a singular "N/A" string and display a word cloud of just that entry.
            //  The result is a word cloud with only 1 entry, easily notifying the user that a real word cloud can't be created.
            DataStore.wordCloudArray.push("N/A");
        }
        wordCloud.createWordCloud();    // calls method which creates a word cloud from the selected episode & character
    });

    // TODO: Add more callbacks as necessary:
    //  Simply follow the structure above (copy & paste for template) of targeting the UI element,
    //      doing whatever processing is necessary, and calling the updateVisualizations() method afterwards
}