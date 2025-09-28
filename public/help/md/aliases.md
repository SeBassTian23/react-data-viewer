# Parameter Aliases

Sometimes column names or "parameters" don't have the most convient names e.g. `data_1_a` and it would make the analysis easier if the names are more human readable (e.g. `Today [1a]`). Using an alias, every parameter can be renamed without changing the original name.

Select **Data** from the sidabar menu and choose **Parameter Aliases**. Hover with the cursor over the parameter to modify and click on the editing button. Enter the **New Name** and use the **Check** button to save the new name. The alias can be deleted here as well.

The **New Name** will now be available across the app and the analysis done will be updated accordingly.

Duplicates are possible but it is not recommended, as you probably have an issue distingushing them. During the whole analysis the original parameter names are kept in the background and can be reverted to at any point.

## Parameter Aliases

Parameter Aliases allow you to create human-readable labels for parameters without modifying the original data. This is particularly useful when working with:

- System-generated names (e.g., `data_1_a` → `Today [1a]`)
- Technical column headers
- Abbreviated parameter names
- Legacy naming conventions

### Creating an Alias

- Open the sidebar menu and select `Data` → `Parameter Aliases`
- Hover over the parameter you want to rename
- Click the edit button <i class="bi-input-cursor-text"></i>
- Enter your preferred name in the New Name field
- Click the Check button <i class="bi-check2"></i> to save

### Modifying Aliases

- To change an alias: Follow the same steps as creating one
- To remove an alias: Click the delete button <i class="bi-trash-fill"></i> next to the alias name

## Usage and Effects

Application-wide Integration

- Aliases appear throughout the application interface
- All visualizations update automatically to use Parameter Aliases
- Reports and exports can use Parameter Aliases
- Original parameter names are preserved in the background data

### Best Practices

- Choose clear, descriptive names
- Maintain consistent naming conventions
- Avoid duplicate Parameter Aliases to prevent confusion
- Document alias meanings when sharing analysis

### Limitations

- Original parameter names are retained in the source data
- Aliases are saved with the analysis file
- Duplicates are technically allowed but not recommended

### Example Use Cases

| Original Name   | Suggested Alias     | Purpose             |
| :-------------- | :------------------ | :------------------ |
| `temp_f_01`     | `Temperature [°F]`  | Add unit            |
| `p_sys_dia`     | `Systolic Pressure` | Expand abbreviation |
| `dat_2023_q4Q4` | `Sales Revenue`     | Clarify content     |
| `sensor_147_v`  | `Voltage Sensor A`  | Add context         |
