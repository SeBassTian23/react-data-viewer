# Data Import

Import your data into the application for analysis using various file formats and configuration options. Access the import dialog through:

- Keyboard shortcut:
  - Windows: <kbd><i class="bi bi-windows"></i> + I</kbd>
  - macOS: <kbd>⌘ I</kbd>
- Sidebar menu → Import Data…

## Supported File Formats (Text-based)

- `CSV` (.csv): Comma-separated values
- `TXT` (.txt): Tab-separated values
- `JSON` (.json): JavaScript Object Notation

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

```CSV
Date,Temperature,Location
2023-01-01,23.5,"New York"
2023-01-02,24.1,"Boston"
```

### JSON Format

```Javascript
{
  "data": [
    {
      "Date": "2023-01-01",
      "Temperature": 23.5,
      "Location": "New York"
    },
    {
      "Date": "2023-01-02",
      "Temperature": 24.1,
      "Location": "Boston"
    }
  ]
}
```