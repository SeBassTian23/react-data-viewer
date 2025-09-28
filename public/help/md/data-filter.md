# Filter

Data can be filterd by categorical parameters and date-time in your data to create subsets that can be compared in the analysis. The Filters can be selected clicking on **<i class="bi-filter"></i> Filter** in the sidebar menu or using the keyboard shortcut <kbd><i class="bi bi-windows"></i> + K</kbd> <kbd>⌘ K</kbd>.

## Selections

+ Each category can be selected by a clicking on the category name and one or multiple values can be selected for the category.
+ Multiple categories can be selected to filter the data.

In case **<i class="bi-union"></i> Single** is selected, data entries that match any of the selections is selected, generating one data subset.

In case **<i class="bi-subtract"></i> Separate** is selected, data entries are selected generating all combinations based on the selections, resulting in multiple data subsets.

**<i class="bi-x-circle"></i> Reset** is resetting the selection, it is not resetting the already selected data subsets. 

## Categories

If a column contains categorical data (`string`, `color`) a filter is available. The counter indicates the number of unique categories that can be selected. One or multiple categories can be selected.

## Date/Time

If a column contains date-time data a filter is available indicated by <i class="bi bi-calendar-range"></i> instead of the category count. 

Three options are availble, allowing the selection of `date-time`, `date` and `time`. The range that can be selected is based on the minimum and maximum value of the column data. In case a range should be selected, the endpoint can be selected by activating the switch for range.

+ `date-time` - Select year, month, day, hour, and minute.
+ `date` - Select year, month, and day.
+ `time` - Select hour and minute. 
