import { useRef, useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux';

import { parameters, importJSON, getFilteredData, dbInit } from '../../modules/database'

import ModalDialogBusy from './ModalDialogBusy'

import { parametersAdded, parametersReset } from '../../features/parameter.slice';
import { datasubsetReset } from '../../features/datasubset.slice';
import { dashboardAddMultiplePanels, dashboardReset } from '../../features/dashboard.slice'
import { datasubsetMultipleAdded } from '../../features/datasubset.slice'
import { mapApplySettings, mapReset } from '../../features/map.slice'
import { parametersAddBackup } from '../../features/parameter.slice'
import { plotReset, plotUpdate } from '../../features/plot.slice'
import { thresholdAddBackup, thresholdsReset } from '../../features/threshold.slice'
import { analysisAddBackup, analysisReset, initialState } from '../../features/analysis.slice'

import loadAnalysisFromFile from '../../utils/data/load-analysis'
import { bookmarkAddBackup } from '../../features/bookmark.slice';

import useToast from '../../hooks/useToast';

export default function ModalDialogAnalysisImport(props) {

  const analysisStore = useStore();
  const [isBusy, setIsBusy] = useState(false);
  const [startImport, setStartImport] = useState(false);

  const fileInput = useRef(null);
  const dispatch = useDispatch();

  const toast = useToast();

  const processFile = async () => {
    try {
      if (fileInput.current.files.length > 0) {
        if (fileInput.current.files['0'].type === 'application/zip') {
          let fileName = fileInput.current.files['0'].name
          return loadAnalysisFromFile(fileInput.current.files['0']).then(analysis => {

            if (analysis.db) {
              importJSON(analysis.db)

              dbInit();

              dispatch(dashboardReset());
              dispatch(datasubsetReset());
              dispatch(mapReset());
              dispatch(parametersReset());
              dispatch(plotReset());
              dispatch(thresholdsReset());
              dispatch(analysisReset());

              dispatch(parametersAdded(parameters()))
              if (analysis.store) {
                if (analysis.store.dashboard !== undefined)
                  dispatch(dashboardAddMultiplePanels(analysis.store.dashboard))
                if (analysis.store.datasubsets !== undefined)
                  dispatch(datasubsetMultipleAdded(analysis.store.datasubsets))
                if (analysis.store.map !== undefined)
                  dispatch(mapApplySettings(analysis.store.map))
                if (analysis.store.parameters !== undefined)
                  dispatch(parametersAddBackup(analysis.store.parameters))
                if (analysis.store.plot !== undefined)
                  dispatch(plotUpdate(analysis.store.plot))
                if (analysis.store.thresholds !== undefined)
                  dispatch(thresholdAddBackup(analysis.store.thresholds))
                if (analysis.store.analysis !== undefined)
                  dispatch(analysisAddBackup(analysis.store.analysis))
                
                // Create Analysis info for older files
                if (analysis.store.analysis === undefined)
                  dispatch(analysisAddBackup({...initialState, 
                    ...{"name": fileName.split(".").slice(0,-1).join(".")}
                  }));

                let bookmarks = getFilteredData('bookmarks', {}).data().map(bookmark => {
                  return {
                    id: bookmark.id,
                    name: bookmark.name,
                    created_at: bookmark.created_at,
                    dashboard: bookmark.store.dashboard.length,
                    datasubsets: bookmark.store.datasubsets.length,
                    thresholds: bookmark.store.thresholds.length,
                    creator: bookmark?.creator
                  }
                });
                dispatch(bookmarkAddBackup(bookmarks))
              }
            }
            else {
              throw "No valid database found."
            }
          })
            .catch(e => {
              toast.error(`Import failed, "${e}"`, "Analysis", "bi-journal-x")
            })
            .finally(() => {
              setIsBusy(false);
              props.setLoadAnalysis(false);

              let state = analysisStore.getState().analysis
              let recent = localStorage.getItem('APP_USER_RECENT_FILES');

              if(!recent && localStorage.getItem('APP_USER_NAME'))
                recent = JSON.stringify([])

              if( recent ){
                recent = JSON.parse(recent)
                
                const recentEntry = {
                  title: state?.name || "Analysis (Unknown)",
                  notes: state?.notes || "",
                  lastModifiedDate: String(new Date(fileInput.current.files['0'].lastModifiedDate)),
                  name: String(fileInput.current.files['0'].name),
                  size: Number(fileInput.current.files['0'].size),
                  type: String(fileInput.current.files['0'].type),
                }
                
                addOrMoveToEnd(recent, recentEntry, ['title', 'notes', 'lastModifiedDate', 'name', 'size', 'type']);

                localStorage.setItem('APP_USER_RECENT_FILES', JSON.stringify(recent, null));
              }
            });
        }
        else
          throw "Wrong filetype"
      }
      else
        throw "No file selected"
    }
    catch (e) {
      setIsBusy(false);
      toast.error(`Import failed, "${e}"`, "Analysis", "bi-journal-x")
      props.setLoadAnalysis(false);
      return;
    }
  }

  useEffect(() => {

    if (!fileInput.current)
      return;

    if (fileInput.current) {
      fileInput.current.click();

      const onCancel = () => {
        props.setLoadAnalysis(false);
      };

      fileInput.current.addEventListener('cancel', onCancel, { once: true });
    }
  }, [props.show])

  useEffect(() => {
    if (!fileInput.current)
      return

    if (fileInput.current.files.length === 0) {
      setStartImport(false);
    }
    else {
      setIsBusy(true);
    }
  }, [startImport]);

  return (
    <>
      <ModalDialogBusy show={isBusy} content={"Loading Analysis File…"} onEntered={() => {
        processFile().then(() => {
          fileInput.current.value = null
          setStartImport(false);
        });
      }} onCancel={() => props.setShow(true)} />
      {props.show && <input className='d-none' type="file" id="file" accept="application/zip"
        onChange={(e) => {
          setStartImport(true);
        }}
        ref={fileInput}
      />
      }
    </>
  );
}

function addOrMoveToEnd(arr, obj, keysToMatch = []) {
  // Find index of existing object where ALL keys match
  const index = arr.findIndex(item => 
    keysToMatch.every(key => item[key] === obj[key])
  );
  
  if (index !== -1) {
    // Remove existing object and add to end
    arr.splice(index, 1);
  }
  
  arr.push(obj);
  return arr;
}