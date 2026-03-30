# Data Import

Import your data into the application for analysis using various file formats and configuration options. Access the import dialog through:

- Keyboard shortcut:
  - Windows: <kbd><i class="bi bi-windows"></i> + I</kbd>
  - macOS: <kbd>⌘ I</kbd>
- Sidebar menu → Import Data…

## Supported File Formats

| Format               | MIME Type                        | Description                                                                                  |
| -------------------- | -------------------------------- | -------------------------------------------------------------------------------------------- |
| `.csv`               | `text/csv`                       | Comma-separated values; standard tabular data format widely supported by tools and databases |
| `.txt`               | `text/plain`                     | Plain text, often tab-separated; simple but lacks standardized structure for data            |
| `.json`              | `application/json`               | Structured key-value pairs; good for nested/hierarchical data and APIs                       |
| `.jsonl`<br>`.ndjson` | `application/jsonlines`          | Newline-delimited JSON objects; efficient for streaming large datasets line-by-line          |
| `.parquet`           | `application/vnd.apache.parquet` | Column-oriented binary format; optimized for analytical queries and storage efficiency       |

## File Requirements

- Single file import only
- Data must be structured in columns
- First row should contain column headers
- Maximum file size: 100MB

### Delimiter Detection

Select the appropriate separator for your data:

- Auto (recommended): Automatically detects the delimiter
- Comma (,): Standard CSV format
- Semicolon (;): Alternative CSV format
- Tab (↹): Tab-separated format

>[!note] This is ignored with JSON NDJSON and parquet formated data

Append Data: Add new data to existing dataset

- Useful for combining multiple files
- Columns should match existing data structure
- New columns will be added with empty values for existing rows

### Data Structure

Select the appropriate format of your data structure:

#### Wide Format

- Each row represents a unique observation/case/record
- Each column represents a different variable/parameter/attribute

```
ID | Height | Weight | Age
1  | 170    | 65     | 25
2  | 165    | 70     | 30
```

#### Long Format

- Each row represents a single measurement/datapoint
- Multiple rows can belong to the same dataset/subject
- Columns identify the dataset and the value

```
Dataset | Parameter | Value
Height  | Person1   | 170
Height  | Person2   | 165
Weight  | Person1   | 65
Weight  | Person2   | 70
```

A usecase for selecting the `long format` would be a data structure in which you have the first column describing spectra

## Best Practices

### Before Import

- Ensure data is properly formatted
- Check for consistent column names
- Verify delimiter consistency
- Remove any summary rows or notes

### File Preparation

- Use consistent date formats
- Avoid special characters in headers
- Remove formatting and formulas
- Save text files with UTF-8 encoding

### After Import

- Verify column data types
- Check for missing values
- Review data ranges
- Set up aliases for clearer column names

## Example File Formats

### CSV Format

A CSV file (Comma-Separated Values) is a plain text file with a `.csv` extension that stores tabular data in rows and columns, where each value is separated by a comma and can be opened by spreadsheet applications.

```CSV
Date,Temperature,Sunrise/Sunset,Location
2026-02-12,0.1,"[\"6:53\", \"17:27\"]",New York
2026-02-12,-15,"[\"6:44\", \"17:12\"]",Boston
```

### JSON Format

A JSON file is a plain text file with a `.json` extension that stores data in JSON format, allowing structured information to be saved and easily shared between applications and systems.

```Javascript
[
  {
    "Date": "2026-02-12",
    "Temperature": 0.1,
    "Sunrise/Sunset": ["6:53", "17:27"],
    "Location": "New York"
  },
  {
    "Date": "2026-02-12",
    "Temperature": -1.5,
    "Sunrise/Sunset": ["6:44", "17:12"],
    "Location": "Boston"
  }
]
```

### ND-JSON Format

An ND-JSON file (Newline Delimited JSON) is a text file format where each line contains a complete, independent JSON object separated by newlines, enabling efficient streaming and processing of large datasets.

```Javascript
{ "Date": "2026-02-12", "Temperature": 0.1, "Sunrise/Sunset": ["6:53", "17:27"], "Location": "New York" }
{ "Date": "2026-02-12", "Temperature": -1.5, "Sunrise/Sunset": ["6:44", "17:12"], "Location": "Boston" }
```

### Parquet Format

A Parquet file is a columnar data storage format that efficiently compresses and stores large datasets in a binary file, optimized for fast querying and analysis in big data processing frameworks.

More: [Parquet Documentation](https://parquet.apache.org/)