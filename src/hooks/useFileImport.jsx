import { useState } from 'react';
import { useDispatch } from 'react-redux';

import loadCSV from '../utils/data/load-csv';
import loadJSON from '../utils/data/load-json';
import wideToLong from '../utils/data/wide-to-long';
import { addDataJSON, parameters } from '../modules/database';

import { parametersAdded } from '../features/parameter.slice';
import { datasubsetReset } from '../features/datasubset.slice';
import { analysisAddFile, analysisAppendFile, analysisUpdate } from '../features/analysis.slice';

export const useFileImport = () => {
  const [isBusy, setIsBusy] = useState(false);
  const [fileInvalid, setFileInvalid] = useState(false);
  const dispatch = useDispatch();

  const processFile = async (values, onComplete) => {
    if (values.file === "" || values.file.length === 0) {
      setFileInvalid(true);
      return;
    }

    try {
      if (values.file.length === 1) {
        setIsBusy(true);
        const file = values.file['0'];
        const fileInfo = { 
          name: file.name, 
          size: file.size, 
          lastModified: file.lastModified 
        };

        let data;
        if (file.type === 'text/csv' || file.type === 'text/plain') {
          data = await loadCSV(file, values.delimiter || "");
          if (values.format === 'long') {
            data.data = wideToLong(data.data);
          }
        } else if (file.type === 'application/json') {
          data = await loadJSON(file);
        } else {
          throw new Error('Unsupported file type');
        }

        const res = await addDataJSON(data.data || data, values.append);
        
        if (res.success) {
          dispatch(datasubsetReset());
          dispatch(parametersAdded(parameters()));
          
          if (values.append) {
            dispatch(analysisAppendFile(fileInfo));
          } else {
            dispatch(analysisAddFile(fileInfo));
            const initialname = file.name.split(".").slice(0, -1).join(".");
            dispatch(analysisUpdate({ name: initialname, saveAs: initialname }));
          }
          
          onComplete({ success: true, message: file.name });
        } else {
          onComplete({ success: false, message: res.message });
        }
      }
    } catch (e) {
      console.error('Import failed:', e);
      onComplete({ success: false, message: 'Import failed' });
    } finally {
      setIsBusy(false);
    }
  };

  const resetState = () => {
    setIsBusy(false);
    setFileInvalid(false);
  };

  return {
    processFile,
    isBusy,
    fileInvalid,
    setFileInvalid,
    resetState
  };
};