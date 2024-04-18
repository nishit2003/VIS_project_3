class CsvDataParser {
    // Class Constants & Attributes
    // TODO: Add if necessary

    // Constructor
    constructor() {
        // TODO: Implement as necessary or remove?
    }

    // Class Methods
    // method which parses specifically the data from the 'ufo_sightings.csv' file. TODO: Maybe make more modular & pass file names/attributes to parse in?
    static async parseTVData() {
        const UFO_CSV_FILE = "data/dialogue.csv";
        d3.csv(UFO_CSV_FILE).then(data => {
            console.log("Data:", data);
            console.log("A Data Entry:", data[0]);
            const deepCopyRawData = JSON.parse(JSON.stringify(data));   // creates a deep copy so that modifications to this object don't affect the data object
            DataStore.rawData = deepCopyRawData;    // saves the raw data to the DataStore() class

            /* TODO: Doesn't seem to work:
            // Filter out data entries with a year greater than 5000
            data = data.filter(d => {
                const year = new Date(d.date_time).getFullYear(); // Extract the year from the date_time attribute
                return year <= 5000; // Keep only entries with a year less than or equal to 5000
            });
            */

            // iterate through all data entries, parsing & converting values as necessary
            let sceneArray = []
            data.forEach(d => {
                const episode = d.Episode.trim();
                const scene = d.Scene.trim();
                const character = d.Person.trim();
                if (character != "") {
                    if (!sceneArray[episode]) {
                        sceneArray[episode] = {};
                    }

                    if (!sceneArray[episode][scene]) {
                        sceneArray[episode][scene] = new Set(); // Using Set to automatically remove duplicates
                    }

                    sceneArray[episode][scene].add(character);
                }

                Object.keys(d).forEach(key => {
                    const NUMERIC_VALUE = +d[key];
                    if (isNaN(NUMERIC_VALUE)) {
                        return;     // if the attribute in question can't be converted into a numeric representation (i.e. a string name)
                    }
                    // TODO: Add other parsing criteria here (trimming strings, etc.):
                    //else if () { [PLACEHOLDER] }

                    d[key] = +d[key];   // convert the value of each attribute to numeric
                })
            })

            // Convert Set to Array for each scene
            for (const episode in sceneArray) {
                for (const scene in sceneArray[episode]) {
                    sceneArray[episode][scene] = Array.from(sceneArray[episode][scene]);
                }
            }

            console.log("Scene Array:", sceneArray);

            DataStore.filteredData = data;    // saves the filtered data to DataStore() class
        })
        .catch(error => console.error(error));

        // Since this parsing of data is asyncrhonous, we need to wait until it finishes before continuing
        //  Ideally, we'd have some sort of listener or event-driven solution here.
        //  But for quick-and-dirty results, I've simply added a sleep in to wait 1 second before continuing.
        await new Promise(r => setTimeout(r, 1000));    // pauses for 1 second
    }
}