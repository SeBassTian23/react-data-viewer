import { useDispatch, useStore } from 'react-redux';
import { parameters, importJSON, getFilteredData, setFilename, saveDatabase } from '../modules/database';
import { parametersAdded, parametersReset, parametersAddBackup } from '../features/parameter.slice';
import { datasubsetReset, datasubsetMultipleAdded } from '../features/datasubset.slice';
import { dashboardAddMultiplePanels, dashboardReset } from '../features/dashboard.slice';
import { mapApplySettings, mapReset } from '../features/map.slice';
import { plotReset, plotUpdate } from '../features/plot.slice';
import { thresholdAddBackup, thresholdsReset } from '../features/threshold.slice';
import { analysisAddBackup, analysisReset, initialState } from '../features/analysis.slice';
import { bookmarkAddBackup } from '../features/bookmark.slice';

export default function useAnalysisImport() {
  const analysisStore = useStore();
  const dispatch = useDispatch();

  const processAnalysis = async (analysis, fileName) => {
    if (!analysis.db) {
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

    // Add base parameters
    dispatch(parametersAdded(parameters()));

    // Restore store state if available
    if (analysis.store) {
      if (analysis.store.dashboard !== undefined) {
        dispatch(dashboardAddMultiplePanels(analysis.store.dashboard));
      }
      if (analysis.store.datasubsets !== undefined) {
        dispatch(datasubsetMultipleAdded(analysis.store.datasubsets));
      }
      if (analysis.store.map !== undefined) {
        dispatch(mapApplySettings(analysis.store.map));
      }
      if (analysis.store.parameters !== undefined) {
        dispatch(parametersAddBackup(analysis.store.parameters));
      }
      if (analysis.store.plot !== undefined) {
        dispatch(plotUpdate(analysis.store.plot));
      }
      if (analysis.store.thresholds !== undefined) {
        dispatch(thresholdAddBackup(analysis.store.thresholds));
      }
      if (analysis.store.analysis !== undefined) {
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

    let currentAnalysis = analysisStore.getState().analysis
    setFilename(currentAnalysis.saveAs + '.db')
    saveDatabase()

    return currentAnalysis;
  };

  return { processAnalysis };
}