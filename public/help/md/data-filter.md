# Filter

Data can be filterd by categorical parameters and date-time in your data to create subsets that can be compared in the analysis. The Filters can be selected clicking on **<i class="bi-filter"></i> Filter** in the sidebar menu or using the keyboard shortcut <kbd><i class="bi bi-windows"></i> + K</kbd> <kbd>⌘ K</kbd>. Parameter, if not already available as a Filter, can be selected as such.

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

## Assign Parameters as Filters

By default, catergorical parameters (`string`, `color`) as well as `date-time` are selected as a filters. But, also numerical values can be categories and used as filters. To use these, select **Data** -> **Filters** from the Sidebar Menu and select the numberical Parameter you want to add as a filter to create subsets.

Should the invisible <i class="bi bi-eye-slash-fill"> icon appear next to the Parameter name, the parameter is not active and needs to be activated navigating to **Data** -> **Parameters**.

Parameters that are `unknown`, an `object` or an `array` cannot be selected as filters and are not listed. 