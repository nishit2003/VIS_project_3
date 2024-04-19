class CsvDataParser {
    // Static property to store wordsArray
    static wordsArray = [];

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
            // console.log("Data:", data);
            // console.log("A Data Entry:", data[0]);
            const deepCopyRawData = JSON.parse(JSON.stringify(data));   // creates a deep copy so that modifications to this object don't affect the data object
            DataStore.rawData = deepCopyRawData;    // saves the raw data to the DataStore() class

            /* TODO: Doesn't seem to work:
            // Filter out data entries with a year greater than 5000
            data = data.filter(d => {
                const year = new Date(d.date_time).getFullYear(); // Extract the year from the date_time attribute
                return year <= 5000; // Keep only entries with a year less than or equal to 5000
            });
            */

            // Clear the wordsArray before populating it again
            // CsvDataParser.wordsArray = [];

            // iterate through all data entries, parsing & converting values as necessary
            data.forEach(d => {
                Object.keys(d).forEach(key => {
                    const NUMERIC_VALUE = +d[key];
                    if (isNaN(NUMERIC_VALUE)) {
                        // return;     // if the attribute in question can't be converted into a numeric representation (i.e. a string name)
                        const ep = document.getElementById("episodes");
                        const said = d["Said"]; // Get the value of the "Said" attribute

                        ep.addEventListener("change", function() {
                            // Log the value of the selected option when the user makes a selection
                            console.log(ep.value);
                            if (said && typeof said === "string" && ep.value==d["Episode"]) {
                                // Split the string into an array of words using whitespace as the separator
                                    const words = said.split(" ");
                                
                                // Add the words to the 'wordsArray'
                                    CsvDataParser.wordsArray.push(...words);
                            }
                        });

                       
                    }

                    d[key] = +d[key];   // convert the value of each attribute to numeric
                })
            })

            DataStore.filteredData = data;    // saves the filtered data to DataStore() class

            DataStore.wordsArray = data;

            console.log(this.wordsArray)
        })
        .catch(error => console.error(error));

        // Since this parsing of data is asyncrhonous, we need to wait until it finishes before continuing
        //  Ideally, we'd have some sort of listener or event-driven solution here.
        //  But for quick-and-dirty results, I've simply added a sleep in to wait 1 second before continuing.
        await new Promise(r => setTimeout(r, 1000));    // pauses for 1 second
    }
}

