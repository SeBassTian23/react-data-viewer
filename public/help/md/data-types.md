# Data Types

When importing data, the application automatically assigns types to columns based on their content. Below are the supported data types and their detection rules.

| Type      |                Icon                | Description                                                                         | Example                                                                 |
| :-------- | :--------------------------------: | :---------------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| string    |      <i class="bi-type"></i>       | Text values, enclosed in quotes                                                     | `"Hello World"`                                                         |
| number    |       <i class="bi-123"></i>       | Numeric values, including integers and decimals                                     | `42`, `3.14159`                                                         |
| boolean   |      <i class="bi-check"></i>      | Logical values                                                                      | `true`, `false`                                                         |
| array     |     <i class="bi-list-ol"></i>     | Ordered list of values in JSON format                                               | `[1,2,3,4]`                                                             |
| object    |     <i class="bi-braces"></i>      | Key-value pairs in JSON format                                                      | `{"a": 1.3}`                                                            |
| latitude  |      <i class="bi-globe"></i>      | Column named "latitude" or "lat" (case-insensitive)<br>Values between -90 and 90    | `42.72287720`                                                           |
| longitude |      <i class="bi-globe2"></i>     | Column named "longitude" or "lng" (case-insensitive)<br>Values between -180 and 180 | `-84.47427415`                                                          |
| date-time | <i class="bi-calendar2-check"></i> | ISO 8601 format<br>Common date formats                                              | `2023-01-10`<br>`2023-01-01T10:30:00636Z`                               |
| color     |     <i class="bi-palette"></i>     | Hex (with/without alpha)<br>RGB/RGBA<br>HSL/HSLA                                    | `#e1e2e3`<br>`#e1e2e3c1`<br>`rgb(225,226,227)`<br>`hsl(210,3.4%,88.6%)` |
| unknown   | <i class="bi-question-square"></i> | Values that don't match other types                                                 |                                                                         |

## Data Type Detection Rules

### Mixed Data Types

If a column contains values of different types, it will be marked as unknown. To resolve this:

1. Check your data source for inconsistencies
1. Ensure all values in the column follow the same format
1. Clean or transform the data before importing

### Empty Values

- Empty cells are allowed in any column type
- JSON files can use null to explicitly indicate empty values
- Empty values do not affect the column's type detection
- Assign a datatype to a column (this might cause unsuspected results)

### Type Detection Priority

When a value could match multiple types, the application uses the following priority:

1. Geographic types (if column name matches)
1. Date-time (if matches supported formats)
1. Number
1. Boolean
1. Complex types (array, object)
1. String (fallback)
