import { createSelector } from "@reduxjs/toolkit";

const thresholds = state => state.thresholds;

export const selectedThresholds = createSelector(
  [thresholds],
  thresholds => thresholds.filter(itm => itm.isSelected)
);
