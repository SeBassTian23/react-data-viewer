import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'

import Table from 'react-bootstrap/Table'

import Offcanvas from 'react-bootstrap/Offcanvas'
import Placeholder from 'react-bootstrap/Placeholder'

import { getSingleDatumByID } from '../../modules/database'

import Plot from 'react-plotly.js'
import plotOffcanvasLayout from '../../constants/plot-offcanvas-layout'
import { plotLayoutDarkmode, plotLayoutLightmode } from '../../constants/plot-layout'

export default function DatumOffCanvas(props) {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const parameters = useSelector(state => state.parameters)

  useEffect(() => {
    if (props.show) {
      setLoading(true);

      let query = getSingleDatumByID(props.datumid);

      if (query) {
        let paramList = {}
        parameters.map( itm => itm.name ).forEach( itm => {
          paramList[itm] = null;
        })
        query = {...paramList, ...query}
        setLoading(false)
        setData(query)
      }
    }
  }, [props.datumid, props.show])

  return (
    <Offcanvas show={props.show} onHide={() => { props.onHide(false) }} {...props} >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{props.title || 'Data Entry'}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {loading && <>
          <Placeholder as="h4" animation="glow">
            <Placeholder xs={8} />
          </Placeholder>
          <Placeholder animation="glow">
            <Placeholder xs={6} /> <Placeholder xs={5} />
            <Placeholder xs={7} /> <Placeholder xs={4} />
            <Placeholder xs={11} />
            <Placeholder xs={4} /> <Placeholder xs={7} />
            <Placeholder xs={5} />
          </Placeholder>
        </>
        }
        {!loading &&
          <>
            <Table striped size="sm">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th className='text-center'>Value</th>
                </tr>
              </thead>
              <tbody className='text-break'>
                {Object.entries(data)
                  .filter(row => parameters.find(e => e.name === row[0])?.isSelected)
                  .map((row, idx) => <tr key={idx}>
                    <DisplayTableRow param={row[0]} paramInfo={parameters.find(e => e.name === row[0])} value={row[1]} idx={idx} darkmode={props.darkmode} />
                  </tr>)
                }
              </tbody>
            </Table>
          </>
        }
      </Offcanvas.Body>
    </Offcanvas>
  );
}

function DisplayTableRow(props) {

  const param = props.param
  const value = props.value
  const idx = props.idx || 0
  const paramInfo = props.paramInfo

  const [plotLayout, setPlotLayout] = useState(cloneDeep(plotOffcanvasLayout));
  const [colorline, setColorline] = useState('#1d3557');


  useEffect(() => {

    setPlotLayout(props.darkmode === 'true' ? merge(cloneDeep(plotOffcanvasLayout), plotLayoutDarkmode) : merge(cloneDeep(plotOffcanvasLayout), plotLayoutLightmode));
    setColorline(props.darkmode === 'true' ? '#0dcaf0' : '#1d3557')

  }, [props.darkmode]);

  if (!value){
    return (
      <>
        <td><em>{paramInfo.alias ? paramInfo.alias : param}</em></td>
        <td className='text-end' title="No data available"><i className='bi bi-exclamation-triangle text-muted' /></td>
      </>
    )    
  }

  if (paramInfo.type === 'array') {
    
    let hasArray = false;
    value.forEach(el => {
      if (Array.isArray(el)) {
        hasArray = true;
        return
      }
    });

    let data = [];
    if (hasArray) {
      value.forEach(el => data.push({
        y: el,
        type: 'scatter',
        mode: 'lines',
        "line": {
          "color": { colorline },
          "width": 1.5
        }
      })
      )
    }
    else{
      data.push({
        y: value,
        type: 'scatter',
        mode: 'lines',
        "line": {
          "color": { colorline },
          "width": 1.5
        }
      })
    }

    return (
      <td colSpan={2}>
        <em className='d-block'>{paramInfo.alias ? paramInfo.alias : param}</em>
        <Plot
          useResizeHandler={true}
          divId={'OffcanvasPlot' + idx}
          style={{ width: "100%", height: "100%", display: "block" }}
          className="p-0 overflow-hidden h-100"
          data={data}
          layout={plotLayout}
          config={{
            displayModeBar: false
          }}
        />
      </td>
    )
  }
  if (paramInfo.specialtype === 'color') {
    return (
      <>
        <td><em>{paramInfo.alias ? paramInfo.alias : param}</em></td>
        <td className='text-end'><i className='bi-palette-fill' style={{ 'color': String(value) }} /> {String(value)}</td>
      </>
    )
  }
  if (paramInfo.type === 'object') {
    return (
      <>
        <td colSpan={2}>
          <em>{paramInfo.alias ? paramInfo.alias : param}</em>
          <pre className='text-pre-wrap my-2'>{JSON.stringify(value, null, 2)}</pre>
        </td>
      </>
    )
  }
  return (
    <>
      <td><em>{paramInfo.alias ? paramInfo.alias : param}</em></td>
      <td className='text-end'>
        { String(value).match(/https?:\/\//)? <a href={String(value)} target='blank'>{String(value)}</a> : String(value) }
      </td>
    </>
  )
}