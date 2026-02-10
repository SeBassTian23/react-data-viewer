import { useDispatch, useStore } from 'react-redux';
import { isEmpty } from 'lodash'
import { parameters, importJSON, getFilteredData, setFilename, saveDatabase } from '../modules/database';
import { parametersAdded, parametersReset, parametersAddBackup } from '../features/parameter.slice';
import { datasubsetReset, datasubsetMultipleAdded } from '../features/datasubset.slice';
import { dashboardAddMultiplePanels, dashboardReset } from '../features/dashboard.slice';
import { mapApplySettings, mapReset } from '../features/map.slice';
import { plotReset, plotUpdate } from '../features/plot.slice';
import { thresholdAddBackup, thresholdsReset } from '../features/threshold.slice';
import { analysisAddBackup, analysisReset, initialState } from '../features/analysis.slice';
import { bookmarkAddBackup } from '../features/bookmark.slice';

import migrateStore from '../utils/data/migrateStore';

export default function useAnalysisImport() {
  const analysisStore = useStore();
  const dispatch = useDispatch();

  const processAnalysis = async (analysis, fileName) => {

    // Check if a database exists. This has to be a string    
    if (!Object.hasOwn(analysis, 'db') && typeof(analysis.db) !== 'string') {
      throw new Error('No valid database found.');
    }
    
    // Import database
    importJSON(analysis.db);

    // Reset all slices
    dispatch(dashboardReset());
    dispatch(datasubsetReset());
    dispatch(mapReset());
    dispatch(parametersReset());
    dispatch(plotReset());
    dispatch(thresholdsReset());
    dispatch(analysisReset());

    // Restore store state if available
    if (Object.hasOwn(analysis, 'store') && !isEmpty(analysis.store) ) {

      // Call Migrate function to sanitze and ensure data consistency
      analysis.store = migrateStore(analysis.store);

      if (Object.hasOwn(analysis.store, 'dashboard')) 
        dispatch(dashboardAddMultiplePanels(analysis.store.dashboard));
      if (Object.hasOwn(analysis.store, 'datasubsets'))
        dispatch(datasubsetMultipleAdded(analysis.store.datasubsets));
      if (Object.hasOwn(analysis.store, 'map'))
        dispatch(mapApplySettings(analysis.store.map));
      if (Object.hasOwn(analysis.store, 'parameters'))
        dispatch(parametersAddBackup(analysis.store.parameters));
      if (Object.hasOwn(analysis.store, 'plot'))
        dispatch(plotUpdate(analysis.store.plot));
      if (Object.hasOwn(analysis.store, 'thresholds'))
        dispatch(thresholdAddBackup(analysis.store.thresholds));
      if (Object.hasOwn(analysis.store, 'analysis')) {
        dispatch(analysisAddBackup(analysis.store.analysis));
      } else {
        // Create Analysis info for older files
        dispatch(analysisAddBackup({
          ...initialState,
          name: fileName.split('.').slice(0, -1).join('.')
        }));
      }

      // Process and restore bookmarks
      const bookmarks = getFilteredData('bookmarks', {})
        .data()
        .map(bookmark => ({
          id: bookmark.id,
          name: bookmark.name,
          created_at: bookmark.created_at,
          dashboard: bookmark.store.dashboard.length,
          datasubsets: bookmark.store.datasubsets.length,
          thresholds: bookmark.store.thresholds.length,
          creator: bookmark?.creator
        }));
      dispatch(bookmarkAddBackup(bookmarks));
    }
    else {
      // Add base parameters
      dispatch(parametersAdded(parameters()));
    }

    let currentAnalysis = analysisStore.getState().analysis
    setFilename(currentAnalysis.saveAs + '.db')
    saveDatabase()

    return currentAnalysis;
  };

  return { processAnalysis };
}