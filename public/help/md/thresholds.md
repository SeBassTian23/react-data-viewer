# Thresholds

Thresholds can be defined for the `number` data-type to select a specific range for a parameter (column). When defined, each threshold can be activated or deactivated.

## Ranges

A range can be defind as a `minimum`, `maximum` or `both`. Only numbers can be selected for a range. If categorical "ranges" are needed, use the filter function for a sub-set of data instead.

## How Ranges are Applied

When a range is applied for a parameter, the whole data-set is filtered by that range. This means, even if the parameter is not used in a graph for example, the data points displayed are only the ones where the corresponding parameter meets the set range.
