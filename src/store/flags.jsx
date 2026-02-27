import { createSelector } from "@reduxjs/toolkit";

const flags = state => state.flags;

export const activeFlags = createSelector(
  [flags],
  flags => flags.isActive? flags.datumIds : []
);
