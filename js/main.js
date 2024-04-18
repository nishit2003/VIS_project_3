async function main() {
    await CsvDataParser.parseTVData();

    console.log(DataStore.filteredData)
}

main()