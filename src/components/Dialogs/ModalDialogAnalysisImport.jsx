import { useRef, useState, useEffect } from 'react'

import ModalDialogBusy from './ModalDialogBusy'

import loadAnalysisFromFile from '../../utils/data/load-analysis'

import useAnalysisImport from '../../hooks/useAnalysisImport';
import useToast from '../../hooks/useToast';

export default function ModalDialogAnalysisImport(props) {

  const { processAnalysis } = useAnalysisImport();

  const [isBusy, setIsBusy] = useState(false);
  const [startImport, setStartImport] = useState(false);

  const fileInput = useRef(null);

  const toast = useToast();

  const processFile = async () => {
    try {
      if (fileInput.current.files.length > 0) {
        if (fileInput.current.files['0'].type === 'application/zip') {
          let fileName = fileInput.current.files['0'].name
          return loadAnalysisFromFile(fileInput.current.files['0']).then(analysis => processAnalysis(analysis, fileName))
            .catch(e => {
              toast.error(`Import failed, "${e}"`, "Analysis", "bi-journal-x")
            })
            .finally(() => {
              setIsBusy(false);
              props.setLoadAnalysis(false);
              toast.info(`Analysis file "${fileName}" loaded`, "Analysis", "bi-journal-x")
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
          // fileInput.current.value = null
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
