import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form';

import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';

import Offcanvas from 'react-bootstrap/Offcanvas'
import Placeholder from 'react-bootstrap/Placeholder'

import { getSingleDatumByID, getSingleDatumByField } from '../../modules/database'

import Plot from 'react-plotly.js'
import plotOffcanvasLayout from '../../constants/plot-offcanvas-layout'
import { plotLayoutDarkmode, plotLayoutLightmode } from '../../constants/plot-layout'

import useFlagData from '../../hooks/useFlagData';
import useGetFilteredData from '../../hooks/useGetFilteredData';

export default function DatumOffCanvas(props) {

  const [data, setData] = useState(null);
  const [flag, setFlag] = useState(null);
  const [flagReasons, setFlagReasons] = useState([]);
  const [loading, setLoading] = useState(true);

  const parameters = useSelector(state => state.parameters)

  const { register, setValue, getValues } = useForm();

  const flagData = useFlagData()
  const { getFilteredData } = useGetFilteredData();

  useEffect(() => {
    if (props.show) {
      setLoading(true);
      setFlag(null);
      setFlagReasons([]);
      setValue('comment', '', {shouldTouch: true})
      setValue('parameter', parameters[0]?.id, {shouldTouch: true})

      let query = getSingleDatumByID(props.datumid);
      let queryFlag = getSingleDatumByField( props.datumid, 'datumId', 'flags', false);
      let queryFlagReasons = getFilteredData('flags').data();

      if (queryFlag){
        const param = parameters.find( itm => itm.id == queryFlag.parameter )
        setFlag({...queryFlag, parameter: param});
      }

      if (queryFlagReasons)
        setFlagReasons([...new Set(queryFlagReasons.map(itm => itm.comment))])

      if (query) {
        let paramList = {}
        parameters.map( itm => itm.name ).forEach( itm => {
          paramList[itm] = null;
        })
        setLoading(false);
        setData({...paramList, ...query});
      }
    }
  }, [props.datumid, props.show])

  const handleAddFlagClick = () => {

    // useDispatch

    flagData.addFlags(props.datumid, getValues().parameter, getValues().comment)

    let queryFlag = getSingleDatumByField( props.datumid, 'datumId', 'flags', false);

    if (queryFlag){
      const param = parameters.find( itm => itm.id == queryFlag.parameter )
      setFlag({...queryFlag, parameter: param});
    }
  }

  const handleRemoveFlagClick = async () => {
    flagData.removeFlag(flag.datumId);
    setFlag(null)
  }

  const handleHideDialog = () => {
    props.onHide(false);
    setFlag(null);
  }

  return (
    <Offcanvas show={props.show} onHide={handleHideDialog} {...props} >
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
            {flag && <>
              <Alert key={'warning'} variant={'warning'} onClose={handleRemoveFlagClick} dismissible>
                <i className='bi bi-flag-fill' /> {flag.parameter.alias || flag.parameter.name}
                {flag.comment != "" && <Form.Text className='d-block'>{flag.comment}</Form.Text> }
              </Alert>
            </>}
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
            {!flag && <>
              <h6>Flag Data</h6>
              <Form.Control as="input" placeholder="Reason for flagging" size='sm' {...register("comment")} list="floatingTextinput" />
              <datalist id="floatingTextinput">
                {flagReasons.map((itm, idx) => (
                  <option key={idx} value={itm} />
                ))}
              </datalist>
              <InputGroup className="mt-3">
                <Form.Select size="sm"  {...register("parameter")}>
                  { parameters.map( (itm, idx) => <option key={idx} value={itm.id}>{itm.alias || itm.name}</option> )}
                </Form.Select>
                <Button size='sm' variant='secondary' onClick={handleAddFlagClick}><i className='bi bi-flag' /> Flag</Button>
              </InputGroup>
            </>}
          </>
        }
      </Offcanvas.Body>
    </Offcanvas>
  );
}

function DisplayTableRow({ param, value, idx = 0, paramInfo, darkmode }) {

  const plotLayout = useMemo(() =>
    merge(cloneDeep(plotOffcanvasLayout), darkmode ? plotLayoutDarkmode : plotLayoutLightmode),
  [darkmode]);

  const colorline = darkmode ? '#0dcaf0' : '#1d3557';

  const label = paramInfo.alias ? paramInfo.alias : param

  if (!value){
    return (
      <tr id={paramInfo.id}>
        <td><em>{label}</em></td>
        <td className='text-end' title="No data available"><i className='bi bi-exclamation-triangle text-muted' /></td>
      </tr>
    )    
  }
  if (paramInfo.type === 'array') {

    const isNested = value.some(el => Array.isArray(el));
    const isNumbers = !value.flat().some(el => typeof(el) === 'number' || el === null || el === undefined)

    if(isNumbers)
      return (      <tr id={paramInfo.id}>
        <td colSpan={2}>
          <em>{label}</em>
          <pre className='text-pre-wrap my-2'>{JSON.stringify(value, null, 2)}</pre>
        </td>
      </tr>)

    const data = (isNested ? value : [value]).map(y => ({
      y,
      type: 'scatter',
      mode: 'lines',
      line: { width: 1.5 }
    }));

    return (
      <tr id={paramInfo.id}>
        <td colSpan={2}>
          <em className='d-block'>{label}</em>
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
      </tr>
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