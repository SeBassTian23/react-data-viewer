import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { useForm, useWatch } from 'react-hook-form';

import { getFilteredData, getSeries } from '../../modules/database'

import widgets from '../../constants/widgets';

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';

import PanelWarning from './helpers/PanelWarning'
import numberFormat from '../../helpers/number-format';

import plotOffcanvasLayout from '../../constants/plot-offcanvas-layout'
import { plotLayoutDarkmode, plotLayoutLightmode } from '../../constants/plot-layout'

import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import round from 'lodash/round'

import Plot from 'react-plotly.js'

import { useAddBookmark } from '../../hooks/useAddBookmark';

import { useWorker } from '../../hooks/useWorker';

import { datasubsetMultipleAdded } from '../../features/datasubset.slice'
import { dashboardEditPanel } from '../../features/dashboard.slice'

import { selectedThresholds } from '../../store/thresholds';

export default function KMeansClusterPanel(props) {

  const stateDatasubsets = useSelector(state => state.datasubsets)
  const stateParameters = useSelector(state => state.parameters)

  const subsets = stateDatasubsets.filter((itm) => itm.isVisible)
  const thresholds = useSelector(selectedThresholds)

  const [values, setValues] = useState({})
  const [state, setState] = useState(false)

  const { control, register, getValues } = useForm();
  const selectedOptions = useWatch({ control, name: 'parameters' });

  const widget = widgets.find(itm => itm.type == 'kmeanscluster');

  const selectTypeName = 'Numerical'

  const hasMinSelections = (selectedOptions?.length ?? 0) >= 2;

  useEffect(() => setState(props.content ? true : false), [props.content])

  const handleClickCalculate = () => {
    setValues(getValues());
    setState(true)
  }

  return (
    <>
      {!state && <Card.Body className='p-1 overflow-y'>
        <Row className='m-0 p-0'>
          <Col className='p-1'>
            <Form.Label className='form-label-header'>{selectTypeName}</Form.Label>
            <Form.Select size='sm' aria-label={selectTypeName} {...register("parameters")} defaultValue={[]} htmlSize={4} multiple={true} >
              {stateParameters.map((option, idx) => {
                if (option.type === widget.selectType && option.isSelected)
                  return <option key={idx} value={option.name}>{option.alias ? option.alias : option.name}</option>
                return null
              })
              }
            </Form.Select>
            <Form.Text muted>Parameter for {widget.name}</Form.Text>
          </Col>
        </Row>
        <Row className='m-0 p-0'>
          <Col className='p-1'>
            <Form.Label className='form-label-header'>k (Min)</Form.Label>
            <Form.Control size='sm' min={2} type="number" aria-label="K" {...register("kMin")} defaultValue={2}></Form.Control>
          </Col>
          <Col className='p-1'>
            <Form.Label className='form-label-header'>k (Max)</Form.Label>
            <Form.Control size='sm' min={3} type="number" aria-label="K" {...register("kMax")} defaultValue={6}></Form.Control>
          </Col>
          <Col className='p-1'>
            <Form.Label className='form-label-header'>Tests / k</Form.Label>
            <Form.Control size='sm' min={5} max={100} type="number" aria-label="K" {...register("runsPerK")} defaultValue={30}></Form.Control>
          </Col>
          <Col className='d-flex align-items-bottom mt-auto flex-column p-1'>
            <Button variant="outline-primary" size="sm"
              disabled={!hasMinSelections}
              onClick={handleClickCalculate}><i className='bi-caret-right' /></Button>
          </Col>
        </Row>
        <Row className='m-0 p-0'>
          <Col className='p-1'>
            <Form.Label className='form-label-header'>Initialization</Form.Label>
            <Form.Select size='sm' aria-label="Initialization" {...register("initialization")} defaultValue={'kmeans++'}>
              <option value="kmeans++">kmeans++</option>
              <option value="random">random</option>
              <option value="mostDistant">mostDistant</option>
            </Form.Select>
          </Col>
          <Col className='p-1'>
            <Form.Label className='form-label-header'>Iterations (Max)</Form.Label>
            <Form.Control size='sm' min={2} max={200} type="number" aria-label="Iterations (max)" {...register("maxIterations")} defaultValue={100}></Form.Control>
          </Col>
          <Col className='p-1'>
            <Form.Label className='form-label-header'>Silhouette (Min)</Form.Label>
            <Form.Control size='sm' min={0} max={1} step={0.05} type="number" aria-label="Silhouette (Min)" {...register("minSilhouette")} defaultValue={0.25}></Form.Control>
          </Col>
        </Row>
        {widget?.comment && <p className='form-text'>{widget.comment}</p>}
      </Card.Body>
      }
      {state && <CalculateKMeansCluster {...props} {...props.content} setState={setState} {...values} subsets={subsets} thresholds={thresholds} />}
    </>
  )
}

function CalculateKMeansCluster(props) {
  let parameters = props.parameters || []
  const subsets = props.subsets || []
  let thresholds = props.thresholds

  const maxIterations = props.maxIterations
  const runsPerK = props.runsPerK
  const initialization = props.initialization
  const kMin = props.kMin
  const kMax = props.kMax
  const minSilhouette = props.minSilhouette

  const stateParameters = useSelector(state => state.parameters)

  const [processing, setProcessing] = useState(true)
  const [taskId, setTaskId] = useState(null)
  const [results, setResults] = useState(null)
  const [allTests, setAllTests] = useState([])
  const [filters, setFilters] = useState(null)
  const [hasFailed, setHasFailed] = useState(null)
  const [progress, setProgress] = useState(null)

  const [plotLayout, setPlotLayout] = useState(cloneDeep(plotOffcanvasLayout));
  const [colorline, setColorline] = useState('#1d3557');

  const dispatch = useDispatch();
  const addBookmark = useAddBookmark();
  const { execute, terminate } = useWorker();

  useEffect(() => {

    setPlotLayout(current => {
      current.height = 180
      plotLayout.xaxis.title = { text: 'K' }
      return props.darkmode === true ? merge(cloneDeep(current), plotLayoutDarkmode) : merge(cloneDeep(current), plotLayoutLightmode)
    });

    setColorline(props.darkmode === true ? '#0dcaf0' : '#1d3557')

  }, [props.darkmode]);

  useEffect(() => {

    const runCalculation = async () => {

      // Reset hasFailed state
      setHasFailed(null);
      setTaskId(null);

      try {
        let subsetsToUse = [...subsets]

        if (subsetsToUse.length === 0) {
          subsetsToUse.push({
            id: 'all_data',
            name: 'All Data',
            color: '#0d6efd',
            filter: [],
            isVisible: true
          })
        }

        let data = Object.fromEntries(parameters.map(key => [key, []]))
        let idxDB = []

        if (subsetsToUse.length > 0) {
          for (let series in subsetsToUse) {
            let query = getFilteredData('data', { filters: subsetsToUse[series].filter, thresholds, dropna: parameters })
            for (const parameter of parameters) {
              data[parameter].push(...getSeries(query.data({ removeMeta: true }), parameter)[parameter])
            }
            idxDB.push(...getSeries(query.data({ removeMeta: false }), '$loki')['$loki'])
          }
        }

        let dataTransformed = []

        for (const parameter of parameters) {
          if (dataTransformed.length === 0)
            dataTransformed = data[parameter].map(itm => [itm])
          else {
            for (let i in data[parameter]) {
              dataTransformed[i].push(data[parameter][i])
            }
          }
        }

        // Start task with progress tracking
        const { taskId, result } = execute(
          'kmeans',
          {
            data: dataTransformed,
            kMin,
            kMax,
            runsPerK,
            minSilhouette,
            maxIterations,
            initialization,
          },
          {
            onProgress: ( e ) => {
              console.log('Progress:', e)
              // setProgress(e) // Update UI
            },
            timeout: 600000 // 10 minutes if needed
          }
        )

        // Get the result from the promise
        const { best, allResults } = await result

        let ansInfo = best.centroids || []

        let selectionLayers = []
        for (let i in ansInfo)
          selectionLayers.push({
            name: 'Cluster #' + (Number(i) + 1),
            count: ansInfo[i].size,
            isVisible: true,
            filter: [{
              'name': '$loki',
              'values': idxDB.filter((_, index) => best.clusters[index] === Number(i))
            }]
          })

        setResults({ ...best, info: ansInfo })
        setFilters(selectionLayers)
        setAllTests(allResults)

        // Save to Dashboard
        dispatch(dashboardEditPanel({
          id: props.id, content: {
            best,
            info: ansInfo,
            selectionLayers,
            allResults,
            parameters: parameters,
            thresholds: cloneDeep(thresholds)
          }
        }))

      } catch (error) {
        setHasFailed('Error in k-means calculation: ' + error.message)
      } finally {
        setProcessing(false)
      }
    }

    // Response if Panel has content
    if (props.content) {
      parameters = props.content.parameters
      thresholds = props.content.thresholds || []
      setResults({ ...props.content.best, info: props.content.info })
      setFilters(props.content.selectionLayers)
      setAllTests(props.content.allResults)
      setProcessing(false);
      setHasFailed(null);
      return;
    }

    // Push calculation to next event loop - allows React to paint "Processing..." first
    const timer = setTimeout(() => {
      runCalculation();
    }, 0)

    return () => clearTimeout(timer)

  }, []) // Empty dependency array - runs once on mount

  const addSections = (k) => {
    addBookmark();
    if (!k)
      dispatch(datasubsetMultipleAdded(filters))
    else
      dispatch(datasubsetMultipleAdded(filters))
  }

  const handleClickDiscard = () => {
    // Save to Dashboard
    dispatch(dashboardEditPanel({
      id: props.id, content: null
    }))
    setProcessing(true);
    props.setState(false);
  }

  const handleClickAbort = () => {
    terminate(taskId)
  }

  let plotConfig = {
    displayModeBar: false,
    willReadFrequently: true,
    staticPlot: true
  }

  return (
    <>
      {processing && <Card.Body className='d-flex flex-column align-items-center p-1 overflow-y-hidden justify-content-center'>
        <Spinner animation="border" size="sm" />
        <span className='text-center'>Processing…<br/>{progress}</span>
        <Button variant="outline-primary" size="sm" className='mt-2' onClick={handleClickAbort}>Cancel</Button>
      </Card.Body>}
      {!processing && <>
        {hasFailed ? <Card.Body className='p-0 overflow-y'>
          <PanelWarning warning={hasFailed}>
            <Button variant="outline-primary" size="sm" className='mt-2' onClick={handleClickDiscard}>Back</Button>
          </PanelWarning>
        </Card.Body>
          :
          <Card.Body className='p-0 overflow-y'>
            <Table size='sm' striped hover>
              <thead className='text-center small'>
                <tr>
                  <th>K</th>
                  <th>Error</th>
                  <th>ΔError</th>
                  <th>Silhouette</th>
                </tr>
              </thead>
              <tbody className='small text-center' style={{ 'verticalAlign': 'middle' }}>
                {allTests.map((itm, idx) => {
                  return (<tr key={idx} className={itm.k == results.k ? 'table-success' : ''} onClick={() => addSections(itm.k)} role="button">
                    <td>{itm.k}</td>
                    <td>{parseInt(itm.error)}</td>
                    <td>{idx > 0 ? parseInt(itm.error - allTests[idx - 1].error) : ''}</td>
                    <td>{itm.silhouette.toFixed(3)}</td>
                  </tr>)
                })
                }
              </tbody>
            </Table>

            <Plot
              useResizeHandler={true}
              className={`p-0 overflow-hidden col-6 col`}
              data={[{
                x: allTests.map((itm) => itm.k),
                y: allTests.map((itm) => itm.error),
                mode: 'lines+markers',
                type: 'scatter',
                line: { color: colorline },
                marker: { color: colorline }
              }]}
              layout={merge(cloneDeep(plotLayout), { yaxis: { title: { text: 'WCSS (Error)' } } })}
              frames={[]}
              config={plotConfig}
            />

            <Plot
              useResizeHandler={true}
              className={`p-0 overflow-hidden col-6 col`}
              data={[{
                x: allTests.map((itm) => itm.k),
                y: allTests.map((itm) => itm.silhouette),
                mode: 'lines+markers',
                type: 'scatter',
                line: { color: colorline },
                marker: { color: colorline }
              }]}
              layout={merge(cloneDeep(plotLayout), { yaxis: { title: { text: 'silhouette score' } } })}
              frames={[]}
              config={plotConfig}
            />

            <span className='form-text p-1'>Parameters</span>
            <ul className="list-unstyled small px-2">
              {parameters.map(param => stateParameters.find(itm => itm.name == param)?.alias || param).map((itm, idx) => {
                return (<li key={idx}>{itm}</li>)
              })}
            </ul>

            <span className='form-text p-1'>Thresholds</span>
            <ul className="list-unstyled small px-2">
              {thresholds.map(param => {
                return {
                  name: stateParameters.find(itm => itm.name == param.name)?.alias || param.name,
                  min: param.min,
                  max: param.max
                }
              }).map((itm, idx) => {
                return (<li key={idx}>{itm.name} | Min: {itm.min} | Max: {itm.max}</li>)
              })}
              {thresholds.length === 0 && <small className='text-muted'>No Thresholds were applied</small>}
            </ul>

            <span className='form-text p-1'>Clusters k={results.k}</span>
            <ol className='small px-4'>
              {results?.info && results.info.map((cluster, idx) => {
                return (<li key={idx}>Size: {cluster.size} <small>(error: {numberFormat(cluster.error, 3)})</small></li>)
              })}
            </ol>

            <span className='form-text p-1'>Interpretation</span>
            <p className='small px-2'>
              A silhouette score of {round(results.silhouette, 3)} suggests a {' '}
              {results.silhouette > 0.5 && <em>strong structure</em>}
              {results.silhouette < 0.25 && <em>likely no real clusters</em>}
              {(results.silhouette <= 0.5 && results.silhouette >= 0.25) && <em>weak/moderate structure</em>}
            </p>
            <div className='d-flex justify-content-between p-2'>
              <Button variant="outline-secondary" size="sm" onClick={handleClickDiscard}><i className="bi bi-x-circle" /> Discard</Button>
              <Button variant="outline-secondary" size="sm" onClick={addSections}><i className="bi bi-subtract" /> Add Clusters (k={results.k})</Button>
            </div>
          </Card.Body>}
      </>}
    </>
  )
}