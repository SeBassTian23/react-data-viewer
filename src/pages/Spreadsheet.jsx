import { useEffect, useMemo, useRef, useState, useCallback } from 'react'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { RevoGrid, Template } from '@revolist/react-datagrid'

import { getFilteredData } from '../modules/database'
import { useSelector } from 'react-redux'
import useHelp from '../hooks/useHelp'

import { utils, writeFile } from 'xlsx'

function normalizeCellValue(value) {
  if (value === null || value === undefined) return ''; // show empty cell
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return value; // primitives (string, number, etc.)
}

export default function Spreadsheet(props) {
  const stateDatasubsets = useSelector((state) => state.datasubsets)
  const stateParameters = useSelector((state) => state.parameters)
  const stateThresholds = useSelector((state) => state.thresholds)
  const stateAnalysis = useSelector((state) => state.analysis)

  const help = useHelp()

  const [source, setSource] = useState([])
  const [columns, setColumns] = useState([])

  const gridRef = useRef(null)

  /** =============================
   *  BUILD COLUMNS & DATA
   * ============================= */
  useEffect(() => {
    const cols = stateParameters.map((col) => {
      let columnType = 'text'
      if (col.type === 'number') columnType = 'numeric'
      if (col.specialtype === 'color') columnType = 'color'
      if (col.specialtype === 'date-time') columnType = 'date'

      let colDef = {
        prop: col.name,
        name: col.alias || col.name,
        // size: 150,
        columnType,
        sortable: true,
        // order: 'asc',
        isVisible: col.isSelected
      }

      if (columnType === 'color')
        colDef = {
          ...colDef,
          cellProperties: ({prop, model, data, column}) => {
            return {
              // Custom styles
              style: {
                color: model[prop]
              },
            }
          }
        }

      // TODO: define more types in the future

      return colDef;
    }).filter( col => col.isVisible )

    let data = []

    // Function 
    const subsetID = (model) => {
      try{
        const modValue = stateDatasubsets.find( (itm) => itm.id === model.value);
        return (<strong style={{color: modValue.color || 'red'}}>{modValue.name}</strong>)
      }
      catch(e){
        console.log(e)
      }
      return (<>{model.value}</>)
    }

    if (stateDatasubsets.length === 0) {
      data = getFilteredData('data', { thresholds: stateThresholds }).data({
        removeMeta: true,
      })
    } else {
      cols.unshift({
        prop: 'subset',
        name: 'Data Sub-Set',
        size: 150,
        columnType: 'text',
        pin: 'colPinStart',
        cellTemplate: Template(subsetID)
      })

      for (let series of stateDatasubsets) {
        if (!series.isVisible) continue

        const query = getFilteredData('data', {
          filters: series.filter,
          thresholds: stateThresholds,
        })

        const subsetData = query
          .data({ removeMeta: true })
          .map((row) => ({
            ...row,
            subset: series.id,
          }))

        data = [...data, ...subsetData]
      }
    }

    // Normalize Data to make sure cell values are not causing
    // an rendering issue with RevoGrid
    const normalizedData = data.map((row) => {
      const normalized = {};
      for (const [key, val] of Object.entries(row)) {
        normalized[key] = normalizeCellValue(val);
      }
      return normalized;
    });

    setColumns(cols)
    setSource(normalizedData)

  }, [stateParameters, stateDatasubsets, stateThresholds])

  /** Export Handlers */

  function lookupTableSubsetNames (){
    return Object.fromEntries(stateDatasubsets.map( (itm) => [itm.id, itm.name]));
  }

  function downloadCSV() {
    const ltsn = lookupTableSubsetNames()
    const ws = utils.json_to_sheet(source.map( itm => ({
      ...itm,
      subset: itm.subset ? ltsn[itm.subset] : itm.subset
    })))
    const csv = utils.sheet_to_csv(ws)
    triggerDownload(csv, `${stateAnalysis?.saveAs || 'data'}.csv`, 'text/csv')
  }

  function downloadTXT() {
    const ltsn = lookupTableSubsetNames()
    const ws = utils.json_to_sheet(source.map( itm => ({
      ...itm,
      subset: itm.subset ? ltsn[itm.subset] : itm.subset
    })))
    const txt = utils.sheet_to_txt ? utils.sheet_to_txt(ws) : utils.sheet_to_csv(ws, { FS: '\t' })
    triggerDownload(txt, `${stateAnalysis?.saveAs || 'data'}.txt`, 'text/plain')
  }

  function downloadJSON() {
    const ltsn = lookupTableSubsetNames()
    const jsonStr = JSON.stringify(source.map( itm => ({
      ...itm,
      subset: itm.subset ? ltsn[itm.subset] : itm.subset
    })), null, 2)
    triggerDownload(jsonStr, `${stateAnalysis?.saveAs || 'data'}.json`, 'application/json')
  }

  function downloadXLSX() {
    const ltsn = lookupTableSubsetNames()
    const ws = utils.json_to_sheet(source.map( itm => ({
      ...itm,
      subset: itm.subset ? ltsn[itm.subset] : itm.subset
    })))
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');
    const filename = `${stateAnalysis?.saveAs || 'data'}.xlsx`;
    writeFile(wb, filename);
  }

  function triggerDownload(dataStr, filename, mime) {
    const blob = new Blob(['\uFEFF' + dataStr], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.setAttribute('download', filename)
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  /** =============================
   *  HELP BUTTON HANDLER
   * ============================= */
  const handleClickHelp = useCallback(() => {
    help.open('Help | Spreadsheet', 'help/md/spreadsheet.md')
  }, [])

  /** =============================
   *  RENDER
   * ============================= */

  return (
    <>
      <Row>
        <Col className='py-2'>
          <ButtonToolbar
            aria-label='Spreadsheet Menu'
            className='d-flex align-items-center'
          >
            <label className='me-2 fw-bold'>Save as</label>
            <ButtonGroup
              size='sm'
              className='me-2'
              aria-label='Download Data'
            >
              <Button
                variant={props.darkmode ? 'outline-light' : 'outline-dark'}
                onClick={downloadCSV}
              >
                <i className='bi-filetype-csv' /> CSV
              </Button>
              <Button
                variant={props.darkmode ? 'outline-light' : 'outline-dark'}
                onClick={downloadTXT}
              >
                <i className='bi-filetype-txt' /> Text
              </Button>
              <Button
                variant={props.darkmode ? 'outline-light' : 'outline-dark'}
                onClick={downloadXLSX}
              >
                <i className='bi-filetype-xlsx' /> Excel
              </Button>
            </ButtonGroup>
            <ButtonGroup size='sm' aria-label='Third group'>
              <Button
                variant={props.darkmode ? 'outline-light' : 'outline-dark'}
                onClick={downloadJSON}
              >
                <i className='bi-filetype-json' /> JSON
              </Button>
            </ButtonGroup>
            <ButtonGroup className='ms-2' size='sm' aria-label='Help Group'>
              <Button
                variant={props.darkmode ? 'outline-light' : 'outline-dark'}
                onClick={handleClickHelp}
              >
                <i className='bi-question-circle' />
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </Row>
      <Row>
        <Col sm='12' className='spreadsheet-container position-relative'>
          <RevoGrid
            ref={gridRef}
            className='color-grid cell-border'
            theme={props.darkmode ? 'darkCompact' : 'compact'}
            columns={columns}
            source={source}
            resize
            range
            filter={false}
            readonly
            autoSizeColumn
            sorting={true}
            exporting={true}
          />
          {!source.length && (
            <div className="position-absolute  top-50 start-50 translate-middle text-center">
              <i className="bi bi-table text-muted fs-1"></i>
              <p className="small">No data available.</p>
            </div>
          )}
        </Col>
      </Row>
    </>
  )
}
