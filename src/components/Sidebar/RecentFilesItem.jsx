import ListGroup from 'react-bootstrap/ListGroup';

import useAnalysisImport from '../../hooks/useAnalysisImport'
import opfs from '../../modules/opfs';
import humanFileSize from '../../helpers/humanFileSize'
import { useEffect, useState } from 'react';

export default function RecentFilesItem(props) {

  const { processAnalysis } = useAnalysisImport();

  const [name, setName] = useState(props.name.split('.').slice(0,-1).join('.'))
  const [notes, setNotes] = useState(props.notes || props.title || '')
  const [filesize, setFilesize] = useState(props.size)

  const handleClickRecent = async (file) => {

    if(props.onHide)
      props.onHide()

    if(opfs.isSupported()){
      let basename = file.name.split('.').slice(0, -1).join('.');
      if(await opfs.fileExists(basename + '.json') && await opfs.fileExists(basename + '.db')){
        let store = await opfs.fileRead(basename + '.json')
        store = JSON.parse(store)
        let db = await opfs.fileRead(basename + '.db')
        processAnalysis({db, store}, basename)
      }
      else{
        alert('Issue Found')
      }
    }
  };

  useEffect(() => {
    let cancelled = false

    async function load() {
      const basename = props.name
        .split(".")
        .slice(0, -1)
        .join(".")

      const jsonPath = basename + ".json"
      const dbPath = basename + ".db"

      const [hasJson, hasDb] = await Promise.all([
        opfs.fileExists(jsonPath),
        opfs.fileExists(dbPath)
      ])

      if (!hasJson || !hasDb || cancelled) return

      const storeText = await opfs.fileRead(jsonPath)
      if (cancelled) return

      const store = JSON.parse(storeText)

      setName(store?.analysis?.name ?? props.name)
      setNotes(store?.analysis?.notes ?? props.notes)

      const info = await opfs.fileInfo(jsonPath)
      if (cancelled) return

      const totalSize =
        Number(info.size) + Number(props.size || 0)

      setFilesize(totalSize)
    }

    load()

    return () => {
      cancelled = true
    }
  }, [props])


  return (
    <ListGroup.Item as="button" className='list-group-item-action cursor-podinter px-2 py-1 m-0' title={notes}
      onClick={() => handleClickRecent(props)}
    >
      <strong className='d-block text-truncate'><i className="bi bi-clock-history" /> {name}</strong>
      <small className='d-block'>{notes.length < 200? notes : notes.slice(0,199) +'…' }</small>
      <small>{new Date(props.lastModified).toLocaleString()} &bull; {humanFileSize(filesize)}</small>
    </ListGroup.Item>
  )
}
