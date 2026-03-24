import { useEffect, useRef, useState, useCallback } from 'react'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { RevoGrid, Template } from '@revolist/react-datagrid'

import { useSelector } from 'react-redux'
import useHelp from '../hooks/useHelp'

import { utils, writeFile } from 'xlsx'
import useGetFilteredData from '../hooks/useGetFilteredData'

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
  const stateFlags = useSelector((state) => state.flags)

  const help = useHelp()
  const { getFilteredData } = useGetFilteredData();

  const [source, setSource] = useState([])
  const [columns, setColumns] = useState([])

  const gridRef = useRef(null)

  const subsetID = useCallback((model) => {
    const modValue = stateDatasubsets.find(itm => itm.id === model.value);
    if (!modValue) return <>{model.value}</>;
    return <strong style={{ color: modValue.color || 'red' }}>{modValue.name}</strong>;
  }, [stateDatasubsets])

  const filename = stateAnalysis?.saveAs || 'data';

  // Guessing the column width
  const colWidth = (name) => {
    const len = name.length * 10 + 36
    return len < 70? 70 : len;
  }

  useEffect(() => {
    const cols = stateParameters.map((col) => {
      let columnType = 'text'
      if (col.type === 'number') columnType = 'numeric'
      if (col.specialtype === 'color') columnType = 'color'
      if (col.specialtype === 'date-time') columnType = 'date'

      let colDef = {
        prop: col.name,
        name: col.alias || col.name,
        size: colWidth(col.alias || col.name),
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

    let data = [];

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

  }, [stateParameters, stateDatasubsets, stateThresholds, stateFlags.checksum])

  /** Export Handlers */

  function lookupTableSubsetNames (){
    return Object.fromEntries(stateDatasubsets.map( (itm) => [itm.id, itm.name]));
  }

  function resolveSubsetNames(data) {
    const ltsn = lookupTableSubsetNames();
    return data.map(itm => ({
      ...itm,
      subset: itm.subset ? ltsn[itm.subset] : itm.subset
    }));
  }

  function downloadCSV() {
    const ws = utils.json_to_sheet( resolveSubsetNames(source) )
    const csv = utils.sheet_to_csv(ws)
    triggerDownload(csv, `${filename}.csv`, 'text/csv')
  }

  function downloadTXT() {
    const ws = utils.json_to_sheet( resolveSubsetNames(source) )
    const txt = utils.sheet_to_txt ? utils.sheet_to_txt(ws) : utils.sheet_to_csv(ws, { FS: '\t' })
    triggerDownload(txt, `${filename}.txt`, 'text/plain')
  }

  function downloadJSON() {
    const jsonStr = JSON.stringify( resolveSubsetNames(source), null, 2)
    triggerDownload(jsonStr, `${filename}.json`, 'application/json')
  }

  function downloadNDJSON() {
    const ws = resolveSubsetNames(source);
    const ndjson = ws
      .map(row => JSON.stringify(row))
      .join('\n');
    triggerDownload(ndjson, `${filename}.ndjson`, 'application/x-ndjson')
  }

  function downloadXLSX() {
    const ws = utils.json_to_sheet( resolveSubsetNames(source) )
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');
    writeFile(wb, `${filename}.xlsx`);
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
    URL.revokeObjectURL(url);
  }

  const handleClickHelp = useCallback(() => {
    help.open('Help | Spreadsheet', 'help/md/spreadsheet.md')
  }, [help])

  return (
    <>
      <Row>
        <Col className='py-2'>
          <ButtonToolbar
            aria-label='Spreadsheet Menu'
            className='d-flex align-items-center'
          >
            <ButtonGroup
              size='sm'
              className='me-2'
              aria-label='Download Data in different formats'
            >
              <Button
                variant={props.darkmode ? 'outline-light' : 'outline-dark'}
                onClick={downloadCSV}
                aria-label='Download as CSV formatted file'
              >
                <i className='bi bi-filetype-csv' /> CSV
              </Button>
              <Button
                variant={props.darkmode ? 'outline-light' : 'outline-dark'}
                onClick={downloadTXT}
                aria-label='Download as text file'
              >
                <i className='bi bi-filetype-txt' /> Text
              </Button>
              <Button
                variant={props.darkmode ? 'outline-light' : 'outline-dark'}
                onClick={downloadXLSX}
                aria-label='Download as Excel compatible file'
              >
                <i className='bi bi-filetype-xlsx' /> Excel
              </Button>
            </ButtonGroup>
            <ButtonGroup
              size='sm'
              className='me-2'
              aria-label='Download Data in different formats'
            >
              <Button
                  variant={props.darkmode ? 'outline-light' : 'outline-dark'}
                  onClick={downloadJSON}
                  size='sm'
                  aria-label='Download as JSON formatted file'
                >
                  <i className='bi bi-filetype-json' /> JSON
              </Button>
              <Button
                  variant={props.darkmode ? 'outline-light' : 'outline-dark'}
                  onClick={downloadNDJSON}
                  size='sm'
                  aria-label='Download as NDJSON formatted file'
                >
                  <i className='bi bi-file-earmark' /> ND-JSON
              </Button>
            </ButtonGroup>
            <Button
              variant={props.darkmode ? 'outline-light' : 'outline-dark'}
              onClick={handleClickHelp}
              className='ms-2'
              size='sm'
              aria-label='Show Help'
            >
              <i className='bi bi-question-circle' />
            </Button>
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
            <div className="position-absolute top-50 start-50 translate-middle text-center">
              <i className="bi bi-table text-muted fs-1"></i>
              <p className="small">No data available.</p>
            </div>
          )}
        </Col>
      </Row>
    </>
  )
}
