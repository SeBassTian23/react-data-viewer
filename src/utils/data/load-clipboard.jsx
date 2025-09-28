import Papa from 'papaparse'

export default function loadClipboard() {
  return navigator.clipboard.readText().then(clipboardData => {
    return Papa.parse(clipboardData, {
      delimiter: '\t', // Excel uses tabs
      header: true, // if first row contains headers
      skipEmptyLines: true,
      dynamicTyping: true // automatically convert numbers/booleans
    });
  });
}
