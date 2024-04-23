/* This script houses a bunch of UI element callbacks. Things such as the button clicked, dropdown selection, or text entered, event handlers. */
function setupUICallbacks() {
    document.getElementById('character-selection').addEventListener('change', function() {
        const selectedCharacter = this.value;
        const characterDescription = document.getElementById('character-description');

        switch(selectedCharacter) {
            case 'Alfred':
                characterDescription.textContent = "Alfred Pennyworth is the loyal butler and father figure to Bruce Wayne, also known as Batman. With his unwavering support, wisdom, and extensive knowledge, Alfred assists Batman both in and out of the Batcave, ensuring the Dark Knight's success in his mission to protect Gotham City.";
                break;
            case 'Barbara':
                characterDescription.textContent = "Barbara Gordon, also known as Batgirl and Oracle, is the daughter of Commissioner James Gordon and a skilled crime-fighter in her own right. As Batgirl, Barbara fights alongside Batman and Robin to defend Gotham City, while as Oracle, she provides invaluable assistance to the superhero community through her technological expertise and strategic planning.";
                break;
            case 'Batman':
                characterDescription.textContent = "Batman, also known as the Dark Knight, is a vigilante superhero who protects Gotham City from crime and corruption. With his vast wealth, advanced technology, and martial arts skills, Batman strikes fear into the hearts of criminals.";
                break;
            case 'Bruce':
                characterDescription.textContent = "Bruce Wayne is the billionaire philanthropist owner of Wayne Enterprises and the secret identity of Batman. Haunted by the murder of his parents, Bruce dedicates his life to fighting crime and seeking justice for the citizens of Gotham City.";
                break;
            case 'Bullock':
                characterDescription.textContent = "Harvey Bullock is a gruff and seasoned detective in the Gotham City Police Department. Though initially skeptical of Batman's methods, Bullock eventually becomes one of his most trusted allies, working alongside the Dark Knight to combat the city's criminal underworld.";
                break;
            case 'Catwoman':
                characterDescription.textContent = "Catwoman, also known as Selina Kyle, is a skilled thief and occasional ally of Batman. With her agility, stealth, and mastery of martial arts, Catwoman navigates the morally gray areas of Gotham City, often crossing paths with both heroes and villains.";
                break;
            case 'Dick':
                characterDescription.textContent = "Dick Grayson, also known as Robin and later Nightwing, is the loyal sidekick and partner of Batman. With his acrobatic skills, detective prowess, and unwavering dedication to justice, Dick assists Batman in his mission to protect Gotham City from villains and threats.";
                break;
            case 'Gordon':
                characterDescription.textContent = "Commissioner James Gordon is the head of the Gotham City Police Department and one of Batman's most trusted allies. With unwavering integrity and a dedication to justice, Gordon works tirelessly to maintain law and order in Gotham City, often relying on Batman's help to combat the city's rampant crime and corruption.";
                break;
            case 'Harley':
                characterDescription.textContent = "Harley Quinn, formerly known as Dr. Harleen Quinzel, is a psychiatrist turned criminal and love interest of the Joker. With her acrobatic skills, unpredictable nature, and affection for her 'puddin,' Harley Quinn wreaks havoc in Gotham City while maintaining a complex relationship with Batman's greatest nemesis.";
                break;
            case 'Hill':
                characterDescription.textContent = "Ellen Yindel is a police officer and later commissioner in the Gotham City Police Department. With a strong sense of duty and a commitment to justice, Yindel works to uphold law and order in Gotham City, often clashing with Batman over his vigilante activities.";
                break;
            case 'Ivy':
                characterDescription.textContent = "Poison Ivy, also known as Dr. Pamela Isley, is an eco-terrorist and botanical genius with the ability to control plants. With her fierce devotion to nature and disdain for humanity's destructive tendencies, Poison Ivy poses a significant threat to Gotham City's inhabitants, often clashing with Batman and other heroes.";
                break;
            case 'Joker':
                characterDescription.textContent = "The Joker is a psychotic and unpredictable criminal mastermind who serves as Batman's archenemy. With his trademark grin and chaotic personality, the Joker delights in creating chaos and tormenting the citizens of Gotham City, constantly challenging Batman's moral code and sanity.";
                break;
            case 'Robin':
                characterDescription.textContent = "Robin, also known as Dick Grayson, is the loyal sidekick and partner of Batman. With his acrobatic skills, detective prowess, and unwavering dedication to justice, Robin assists Batman in his mission to protect Gotham City from villains and threats.";
                break;
            case 'Penguin':
                characterDescription.textContent = "The Penguin, also known as Oswald Cobblepot, is a cunning and ruthless crime lord who wields considerable influence in Gotham City's underworld. With his keen intellect and penchant for umbrellas, the Penguin schemes to control Gotham's criminal enterprises while clashing with Batman and other heroes.";
                break;
            case 'Scarecrow':
                characterDescription.textContent = "Scarecrow, also known as Dr. Jonathan Crane, is a brilliant psychologist and sadistic criminal who uses fear as a weapon. With his fear-inducing toxins and psychological manipulation, Scarecrow strikes terror into the hearts of Gotham City's inhabitants, often serving as a formidable adversary to Batman and other heroes.";
                break;
            case 'Summer':
                characterDescription.textContent = "Summer Gleeson is a journalist and news anchor in Gotham City, known for her reporting on the city's crime and corruption. With her dedication to uncovering the truth and holding those in power accountable, Summer plays a crucial role in informing the public about the ongoing struggles in Gotham City.";
                break;
            case 'Thorne':
                characterDescription.textContent = "Rupert Thorne is a powerful crime lord and businessman who controls much of Gotham City's underworld. With his vast resources and connections, Thorne poses a significant threat to Batman and the city's inhabitants, often engaging in ruthless schemes to expand his influence and eliminate his rivals.";
                break;
            case 'Two-face':
                characterDescription.textContent = "Two-Face, also known as Harvey Dent, is a former district attorney of Gotham City who becomes a criminal mastermind after half of his face is disfigured. Driven by a twisted sense of justice, Two-Face makes decisions based on the flip of a coin, representing the duality of good and evil.";
                break;
            default:
                characterDescription.textContent = ""; 
        }
        
        characterDescription.style.display = 'block';

        value = document.getElementById("character-selection").value
        characterBarGraph.character = value
        characterBarGraph.updateVis()
        sceneBarGraph.character = value
        sceneBarGraph.updateVis()
    });

    document.getElementById("btnCreateWordCloud").addEventListener("click", function() {
        //console.log("btnCreateWordCloud clicked!");   // for testing/development's sake

        // first of all, clear the word cloud's contents before populating it again
        DataStore.wordCloudArray = [];

        const selectedEpisode = document.getElementById("episodes").value;
        const selectedCharacter = document.getElementById("character-selection").value;

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

    document.getElementById("episodes").addEventListener("change", function() {
        value = document.getElementById("episodes").value
        arcDiagram.episode = value
        arcDiagram.updateVis()
    })

    document.getElementById('data-column-headers').addEventListener('change', function() {
        // disable iterable dataset controls until new one is generated, since selected attribute changed
        document.getElementById("btnCreateIterableDataset").disabled = false;
        document.getElementById("btnBackwards").disabled = true;
        document.getElementById("btnForwards").disabled = true;
    });

    document.getElementById("btnCreateIterableDataset").addEventListener("click", function() {
        //console.log("btnCreateIterableDataset clicked!");   // for testing/development's sake

        // first of all, clear the iterable dataset's contents before populating it again
        DataStore.iterableDataset = {};

        const selectedColumnHeader = document.getElementById("data-column-headers").value;
        if (selectedColumnHeader == "hide") { return; }     // if no column is selected, simply return (don't create an iterable dataset)

        DataStore.filteredData.forEach(d => {
            // the 'iterableDataset' dictionary should contain a list of keys which are the values based on the selected column header
            if (DataStore.iterableDataset[d[selectedColumnHeader]]) {
                // if a key for the current data entry already exists, we add to list of data stored at that key
                DataStore.iterableDataset[d[selectedColumnHeader]].push(d);
            }
            else {
                // otherwise, we create a new entry (list) with that key and add the entry to that newly-created list
                DataStore.iterableDataset[d[selectedColumnHeader]] = [d];
            }
        });

        // resets the bar graph for user & the iterable dataset index
        if (iterableBarGraph) { iterableBarGraph.clearVis(); }  // if an iterable dataset bar graph already exists, clear it
        DataStore.iterableIndex = 0;

        // re-enable iterable dataset controls and disable the create iterable dataset button until user changes selected attribute
        document.getElementById("btnCreateIterableDataset").disabled = true;
        document.getElementById("btnBackwards").disabled = false;
        document.getElementById("btnForwards").disabled = false;
    });

    document.getElementById("btnBackwards").addEventListener("click", function() {
        //console.log("btnBackwards clicked!");   // for testing/development's sake

        if (Object.keys(DataStore.iterableDataset).length === 0) {
            return;     // first of all, if there is currently no iterable dictionary, we return without doing anything
        }
        DataStore.iterableIndex--;  // decrements DataStore.iterableIndex
        const selectedColumnHeader = document.getElementById("data-column-headers").value;

        // the list of keys needs to be sorted differently depending on whether or not they're ints or strings (Episodes vs other headers)
        let iterableDatasetKeys;
        if (selectedColumnHeader == "Episode") {
            const BASE_10 = 10;
            iterableDatasetKeys = Object.keys(DataStore.iterableDataset);
            iterableDatasetKeys.sort((a, b) => parseInt(a, BASE_10) - parseInt(b, BASE_10));    // saves list of keys sorted numerically    
        }
        else {
            iterableDatasetKeys = Object.keys(DataStore.iterableDataset).sort();  // saves list of keys sorted alphabetically
        }
        
        // if 'DataStore.iterableIndex' is < 0, we wrap around and grab the last item in the list
        if (DataStore.iterableIndex < 0) { DataStore.iterableIndex = iterableDatasetKeys.length - 1}

        // grabs the first item in the iterable dataset & prints the value associated with the selected column header
        let currDatasetKey = iterableDatasetKeys[DataStore.iterableIndex];  // grabs current dataset key
        let currDataset = DataStore.iterableDataset[currDatasetKey];        // grabs the dataset itself
        let currDatasetValue = currDataset[0][selectedColumnHeader];        // grabs value of first entry for attributed currently selected

        // create a bar graph to display resulting dataset
        iterableBarGraph = new IterableBarGraph({parentElement: '#iterableDatasetBarGraph'}, currDataset, currDatasetValue);
    });

    document.getElementById("btnForwards").addEventListener("click", function() {
        //console.log("btnForwards clicked!");   // for testing/development's sake

        if (Object.keys(DataStore.iterableDataset).length === 0) {
            return;     // first of all, if there is currently no iterable dictionary, we return without doing anything
        }
        DataStore.iterableIndex++;  // increments DataStore.iterableIndex
        const selectedColumnHeader = document.getElementById("data-column-headers").value;

        // the list of keys needs to be sorted differently depending on whether or not they're ints or strings (Episodes vs other headers)
        let iterableDatasetKeys;
        if (selectedColumnHeader == "Episode") {
            const BASE_10 = 10;
            iterableDatasetKeys = Object.keys(DataStore.iterableDataset);
            iterableDatasetKeys.sort((a, b) => parseInt(a, BASE_10) - parseInt(b, BASE_10));    // saves list of keys sorted numerically    
        }
        else {
            iterableDatasetKeys = Object.keys(DataStore.iterableDataset).sort();  // saves list of keys sorted alphabetically
        }
                
        // if 'DataStore.iterableIndex' is > 'iterableDatasetKeys.length', we wrap around and grab the first item in the list
        if (DataStore.iterableIndex >= iterableDatasetKeys.length) { DataStore.iterableIndex = 0}

        // grabs the first item in the iterable dataset & prints the value associated with the selected column header
        let currDatasetKey = iterableDatasetKeys[DataStore.iterableIndex];  // grabs current dataset key
        let currDataset = DataStore.iterableDataset[currDatasetKey];        // grabs the dataset itself
        let currDatasetValue = currDataset[0][selectedColumnHeader];        // grabs value of first entry for attributed currently selected

        // create a bar graph to display resulting dataset
        iterableBarGraph = new IterableBarGraph({parentElement: '#iterableDatasetBarGraph'}, currDataset, currDatasetValue);
    });

    document.getElementById("btnWordSearch").addEventListener("click", function() {
        //console.log("btnWordSearch clicked!");   // for testing/development's sake

        // grab the keyword from the search textbox & convert the keyword to lowercase for case-insensitive matching
        const searchKeyword = document.getElementById("txtWordSearch").value.toLowerCase();
        if (searchKeyword == undefined || searchKeyword == "") { return; }  // if no word is entered, return immediately

        // filters from raw data, all entries in which the supplied word/phrase is found
        DataStore.wordSearchData = DataStore.rawData.filter(d => {
            let inTitle = String(d.Title).toLocaleLowerCase().includes(searchKeyword);
            let inScene = String(d.Scene).toLocaleLowerCase().includes(searchKeyword);
            let inPerson = String(d.Person).toLocaleLowerCase().includes(searchKeyword);
            let inSaid = String(d.Said).toLocaleLowerCase().includes(searchKeyword);
            return (inTitle) || (inScene) || (inPerson) || (inSaid);
        })

        if (DataStore.wordSearchData.length == 0) { return; }   // if resulting dataset is empty, return immediately

        // create a bar graph to display resulting dataset
        iterableBarGraph = new WordSearchBarGraph({ parentElement: '#wordSearchBarGraph'}, DataStore.wordSearchData, searchKeyword);
    });

    // TODO: Add more callbacks as necessary:
    //  Simply follow the structure above (copy & paste for template) of targeting the UI element,
    //      doing whatever processing is necessary, and calling the updateVisualizations() method afterwards
}