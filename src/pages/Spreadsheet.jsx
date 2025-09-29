import { useEffect, useRef, useCallback } from 'react'

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import jspreadsheet from 'jspreadsheet-ce'
import 'jspreadsheet-ce/dist/jspreadsheet.css'

import { getFilteredData } from '../modules/database'

import { useSelector } from 'react-redux'

import useHelp from "../hooks/useHelp";

export default function Spreadsheet(props) {
  const jssRef = useRef(null);

  const stateDatasubsets = useSelector(state => state.datasubsets)
  const stateParameters = useSelector(state => state.parameters)
  const stateThresholds = useSelector(state => state.thresholds)
  const stateAnalysis = useSelector(state => state.analysis)

  const help = useHelp()

  useEffect(() => {

    let columns = stateParameters.map((col) => {

      let coltype = 'text'
      if (col.type === 'number')
        coltype = 'numeric'
      if (col.specialtype === 'color')
        coltype = 'color'
      if (col.specialtype === 'date-time')
        coltype = 'calendar'
      if (!col.isSelected)
        coltype = 'hidden'
      return {
        type: coltype,
        name: col.name,
        title: col.alias || col.name
      }
    });
    
    let data = []

    if (stateDatasubsets.length === 0) {
      data = getFilteredData('data', { thresholds: stateThresholds }).data({ removeMeta: true })
    }

    if (stateDatasubsets.length > 0) {
      columns.unshift(
        {
          type: 'html',
          name: 'subset',
          title: 'Data Sub-Set'
        })
      for (let series in stateDatasubsets) {
        if (!stateDatasubsets[series].isVisible)
          continue;
        // TODO: Add Thresholds
        let query = getFilteredData('data', { filters: stateDatasubsets[series].filter, thresholds: stateThresholds })
        data = [...data, ...query.data({ removeMeta: true }).map((row) => { return { ...row, ...{ 'subset': `<span style="color:${stateDatasubsets[series].color}">${stateDatasubsets[series].name}</span>` } } })]
      }
    }

    let options = {
      data,
      columns,
      tableOverflow: true,
      lazyLoading: true,
      loadingSpin: true,
      filters: false,
      // freezeColumns: 1,
      minDimensions: [10, 30],
      defaultColWidth: '150px',
      defaultColAlign: 'center',
      tableWidth: '100%',
      tableHeight: '100%',
      allowExport: true,
      editable: false,
      selectionCopy: true,
      search: true,
      csvFileName: stateAnalysis?.saveAs,
      contextMenu: function () {
        return false;
      },
      onchange: changed,
    };

    if (options.data.length > 0) {
      let row = options.data.length;
      let col = options.data[0].length;
      options.minDimensions = [col, row];
    }

    console.time('Render Spreadsheet')
    if (jssRef.current) {
      if(jssRef.current.jspreadsheet)
        jssRef.current.jspreadsheet.destroy();
      jspreadsheet(jssRef.current, options)
    }
    console.timeEnd('Render Spreadsheet')

    if(document.querySelector('.jexcel_search')){
      document.querySelector('.jexcel_search').type = 'search'
      document.querySelector('.jexcel_search').classList.add("form-control", "form-control-sm");
    }

    // TODO: use .showColumn or .hideColumn if only the visibility changes

    // console.log(jssRef.current.jexcel.getConfig())

  }, [stateParameters, stateDatasubsets, stateThresholds]);

  const handleClickHelp = useCallback( ()=>{
    help.open("Help | Spreadsheet", "help/md/spreadsheet.md")
  },[] )

  function changed(instance, cell, x, y, value) {
    // console.log(instance, cell, x, y, value)
    // https://bossanova.uk/jspreadsheet/v4/docs/programmatically-changes
    // let headers = jssRef.current.jexcel.getHeaders();

    // console.log(jssRef.current.jexcel.getConfig())

  }

  // Download Data as CSV
  function downloadCSV() {
    jssRef.current.jexcel.download(true);
  }

  // Download Data as Tab
  function downloadTXT() {
    // Get data
    let data = ''
    data += jssRef.current.jexcel.copy(false, '\t', true, true, true);

    let filename = jssRef.current.jexcel.options.csvFileName + '.txt'

    // Download element
    var blob = new Blob(["\uFEFF" + data], { type: 'text/txt;charset=utf-8;' });

    // IE Compatibility
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      // Download element
      var pom = document.createElement('a');
      var url = URL.createObjectURL(blob);
      pom.href = url;
      pom.setAttribute('download', filename);
      document.body.appendChild(pom);
      pom.click();
      pom.parentNode.removeChild(pom);
    }
  }

  function downloadJSON() {
    // Get data
    let headers = jssRef.current.jexcel.getHeaders();
    let json = jssRef.current.jexcel.getJson();

    json.map((el) => {
      Object.keys(el).forEach(function (key) {
        return headers.includes(key) || delete el[key];
      });
      return el;
    });

    let data = ''
    data += JSON.stringify(json, null, 2);
    let filename = jssRef.current.jexcel.options.csvFileName + '.json'

    // Download element
    var blob = new Blob(["\uFEFF" + data], { type: 'text/JSON;charset=utf-8;' });

    // IE Compatibility
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      // Download element
      var pom = document.createElement('a');
      var url = URL.createObjectURL(blob);
      pom.href = url;
      pom.setAttribute('download', filename);
      document.body.appendChild(pom);
      pom.click();
      pom.parentNode.removeChild(pom);
    }
  }

  return (
    <>
      <Row>
        <Col className='pt-2'>
          <ButtonToolbar aria-label="Spreadsheet Menu" className='d-flex align-items-center'>
            <label className='me-2 fw-bold'>Save as</label>
            <ButtonGroup size='sm' className="me-2" aria-label="Download Data">
              <Button variant={props.darkmode? "outline-light" : "outline-dark"} onClick={downloadCSV}><i className='bi-filetype-csv' /> CSV</Button>
              <Button variant={props.darkmode? "outline-light" : "outline-dark"} onClick={downloadTXT}><i className='bi-filetype-txt' /> Text</Button>
            </ButtonGroup>
            <ButtonGroup size='sm' aria-label="Third group">
              <Button variant={props.darkmode? "outline-light" : "outline-dark"} onClick={downloadJSON}><i className='bi-filetype-json' /> JSON</Button>
            </ButtonGroup>
            <ButtonGroup className='ms-2' size='sm' aria-label="Help Group">
              <Button variant={props.darkmode? "outline-light" : "outline-dark"} onClick={handleClickHelp}><i className='bi-question-circle' /></Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </Row>
      <Row>
        <Col sm='12' className='spreadsheet-container'>
          <div ref={jssRef} />
        </Col>
      </Row>
    </>
  )
}
