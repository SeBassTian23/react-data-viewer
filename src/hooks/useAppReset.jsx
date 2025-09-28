import { useDispatch } from "react-redux";

import { bookmarksReset } from '../features/bookmark.slice';
import { dashboardReset } from '../features/dashboard.slice';
import { datasubsetReset } from '../features/datasubset.slice';
import { mapReset } from '../features/map.slice';
import { parametersReset } from '../features/parameter.slice';
import { plotReset } from '../features/plot.slice';
import { thresholdsReset } from '../features/threshold.slice';
import { analysisReset } from '../features/analysis.slice';

import { resetCollection } from '../modules/database'

export function useAppReset() {
  const dispatch = useDispatch();

  return () => {
    dispatch(bookmarksReset());
    dispatch(dashboardReset());
    dispatch(datasubsetReset());
    dispatch(mapReset());
    dispatch(parametersReset());
    dispatch(plotReset());
    dispatch(thresholdsReset());
    dispatch(analysisReset());
    resetCollection('data');
    resetCollection('bookmarks');
  };
}