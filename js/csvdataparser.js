class CsvDataParser {
    // Class Constants & Attributes
    // TODO: Add if necessary

    // Constructor
    constructor() {
        // TODO: Implement as necessary or remove?
    }

    // Class Methods
    // method which parses specifically the data from the 'dialogue.csv' file. TODO: Maybe make more modular & pass file names/attributes to parse in?
    static async parseTVData() {
        const TV_CSV_FILE = "data/dialogue.csv";
        d3.csv(TV_CSV_FILE).then(data => {
            // console.log("Data:", data);
            // console.log("A Data Entry:", data[0]);
            const deepCopyRawData = JSON.parse(JSON.stringify(data));   // creates a deep copy so that modifications to this object don't affect the data object
            DataStore.rawData = deepCopyRawData;    // saves the raw data to the DataStore() class

            // iterate through all data entries, parsing & converting values as necessary
            data.forEach(d => {
                Object.keys(d).forEach(key => {
                    // perform any conversions needed when parsing data (string -> int, string -> float, etc.)
                    if (key == "Season") { d[key] = +d[key]; }  // convert the value of the 'Season' attribute to a numeric
                    else if (key == "Episode") { d[key] = +d[key]; }  // convert the value of the 'Episode' attribute to a numeric
                    else { d[key] = d[key]; }   // saves all others as-is
                })
            })

            DataStore.filteredData = data;    // saves the filtered data to DataStore() class
        })
        .catch(error => console.error(error));

        // Since this parsing of data is asyncrhonous, we need to wait until it finishes before continuing
        //  Ideally, we'd have some sort of listener or event-driven solution here.
        //  But for quick-and-dirty results, I've simply added a sleep in to wait 1 second before continuing.
        await new Promise(r => setTimeout(r, 1000));    // pauses for 1 second
    }
}