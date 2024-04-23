class DataStore {
    // Class Constants & Attributes
    static rawData = undefined;         // This should remain unmodified. Simply a storage slot for the raw, unchanged data.
    static filteredData = undefined;    // This is the data which we'll modify inside the application. It'll be accessed throughout.
    static currMapBckgrnd = undefined;  // This is a list of size 2, where first element is the URL, and the second elemnt is the ATTR list.
    static brushingLeaflepMap = false;  // Flag to determine if Leaflet map should ignore clicks (so brushing is possible)
    static wordCloudArray = [];         // This array stores all words in the currently displayed word cloud (determined by episode & character selection)
    static iterableDataset = {};        // This dictionary stores the current iterable dataset (data filtered/organized by selected attribute)
    static iterableIndex = 0;           // This counter keeps track of the current index so that the user can iterate through various datasets.
    static wordSearchData = undefined;  // This is the resulting dataset after a word search.
    // TODO: Add as necessary

    // Constructor
    constructor() {
        // TODO: Implement if necessary
    }

    // Class Methods
    // method which resets all attributes in the DataStore() class. Good for clearing filters, data, etc.
    static reset() {
        DataStore.rawData = undefined;
        DataStore.filteredData = undefined;
        DataStore.currMapBckgrnd = undefined;
        DataStore.brushingLeaflepMap = false;
        DataStore.wordCloudArray = [];
        DataStore.iterableDataset = {};
        DataStore.iterableIndex = 0;
        DataStore.wordSearchData = undefined;
    }
}