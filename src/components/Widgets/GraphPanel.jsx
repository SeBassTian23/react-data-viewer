import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import Plotly from 'plotly.js/dist/plotly'
import Card from 'react-bootstrap/Card'
import { useSelector, useDispatch } from 'react-redux'

import buildPlot from '../../modules/build-plot'
import { plotUpdate } from '../../features/plot.slice'

// Small helper: debounced effect
function useDebouncedEffect(effect, deps, delay = 250) {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay)
    return () => clearTimeout(handler)
  }, [...deps, delay])
}

export default function GraphPanel(props) {
  const stateDashboard = useSelector(state => state.dashbard)
  const stateThresholds = useSelector(state => state.thresholds)
  const stateDatasubsets = useSelector(state => state.datasubsets)
  const stateParameters = useSelector(state => state.parameters)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [plotImage, setPlotImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const chartId = `chart-${props.id}`

  const staticPlot = useCallback(
    async (datasets, thresholds, settings, darkmode, size) => {
      const plot = buildPlot({
        datasets,
        thresholds,
        settings: { ...settings, legend: false, title: false },
        parameters: stateParameters,
        darkmode,
      })

      plot.layout.margin = {
        autoexpand: true,
        b: 60,
        l: 60,
        pad: 0,
        r: 20,
        t: 20,
      }

      const gd = await Plotly.newPlot(chartId, plot.data, plot.layout, { staticPlot: true })
      try {
        let n = 1;
        if(size === 12)
          n = 1.5
        if(size === 4)
          n = .75
        const img = await Plotly.toImage(gd, {
          width: 800 * n,
          height: 457 * n,
          scale: window.devicePixelRatio || 1,
          format: 'png',
        })
        return img
      } finally {
        Plotly.purge(chartId)
      }
    },
    [stateParameters, chartId]
  )

  // Debounced effect so rapid updates don’t regenerate too often
  useDebouncedEffect(() => {
    const { id, ...content } = props
    let cancelled = false

    const generateImage = async () => {
      setLoading(true)
      try {
        if (!cancelled) {
          const img = await staticPlot(stateDatasubsets, stateThresholds, content, props.darkmode, props?.size?.xl)
          setPlotImage(img)
        }
      } catch (err) {
        console.error('[GraphPanel] Failed to generate plot image:', err)
        if (!cancelled) {
          setPlotImage(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    generateImage()

    return () => {
      cancelled = true
    }
  }, [staticPlot, stateDashboard, stateDatasubsets, stateThresholds, props.darkmode, props.id, props.size.xl], 250)

  const linkToView = useCallback(
    (props) => {
      const { id, ...content } = props
      dispatch(plotUpdate({ ...content }))
      navigate('/plot')
    },
    [dispatch, navigate]
  )

  return (
    <>
      {loading && (
        <Card.Body
          onClick={() => linkToView(props)}
          className="d-flex justify-content-center align-items-center p-1"
        >
          Loading…
        </Card.Body>
      )}

      {plotImage && !loading && (
        <img
          src={plotImage}
          className="card-img-bottom cursor-pointer"
          alt="Plot"
          onClick={() => linkToView(props)}
        />
      )}

      {/* Hidden container for Plotly */}
      <div id={chartId} className='d-none' />
    </>
  )
}
