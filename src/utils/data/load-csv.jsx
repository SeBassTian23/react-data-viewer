import Papa from 'papaparse'

const loadCSV = (file, delimiter = "") => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      worker: true,
      dynamicTyping: true,
      quotes: false, //or array of booleans
      quoteChar: '"',
      escapeChar: '"',
      delimiter: delimiter,
      header: true,
      // newline: "\r\n",
      newline: "",
      skipEmptyLines: true, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
      columns: null, //or array of strings
      delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP],
      complete: function (results, file) {
        return resolve(results)
      }
    })
  });
}

export default loadCSV

// {
// 	delimiter: "",	// auto-detect
// 	newline: "",	// auto-detect
// 	quoteChar: '"',
// 	escapeChar: '"',
// 	header: false,
// 	transformHeader: undefined,
// 	dynamicTyping: false,
// 	preview: 0,
// 	encoding: "",
// 	worker: false,
// 	comments: false,
// 	step: undefined,
// 	complete: undefined,
// 	error: undefined,
// 	download: false,
// 	downloadRequestHeaders: undefined,
// 	downloadRequestBody: undefined,
// 	skipEmptyLines: false,
// 	chunk: undefined,
// 	chunkSize: undefined,
// 	fastMode: undefined,
// 	beforeFirstChunk: undefined,
// 	withCredentials: undefined,
// 	transform: undefined,
// 	delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
// }