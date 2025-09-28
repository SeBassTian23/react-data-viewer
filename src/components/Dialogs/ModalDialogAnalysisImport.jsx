import { useRef, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';

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

export default function ModalDialogAnalysisImport(props) {

  const [isBusy, setIsBusy] = useState(false);
  const [startImport, setStartImport] = useState(false);

  const fileInput = useRef(null);
  const dispatch = useDispatch();

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
              props.setMessage({
                ...props.message,
                body: <>Import failed, <strong>{e}</strong></>,
                header: "Analysis",
                icon: 'bi-journal-x',
                status: 'danger'
              });
              props.setShow(true);
            })
            .finally(() => {
              setIsBusy(false);
              props.setLoadAnalysis(false);
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
      props.setMessage({
        ...props.message,
        body: <>Import failed, <strong>{e}</strong></>,
        header: "Analysis",
        icon: 'bi-journal-x',
        status: 'danger'
      });
      props.setShow(true);
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