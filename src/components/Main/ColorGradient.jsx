import React, { useId, useState, useMemo } from 'react'

import Dropdown from 'react-bootstrap/Dropdown'

import { colorGradients } from '../../constants/color-gradients'
import linearColorScale from '../../utils/plot/colorscale-css'

import { startCase } from 'lodash'

export default function ColorGradient(props) {

  const gradient = linearColorScale(props.colors, props.steps || false)
  const style = useMemo(() => ({ 'width': '100%', 'height': '22px', 'background': gradient, ...props.style, borderRadius: 'var(--bs-border-radius-sm)' }), []);

  return (
    <div className={props.className || null} style={style}></div>
  )
}

export function ColorGradientSelector(props) {

  return (
    <>
      {Object.entries(colorGradients).map((category, idx) => {
        return (
          <optgroup label={category[0]} key={idx}>
            {Object.keys(category[1]).map((gradient, idx) => <option key={idx} value={gradient}>{gradient}</option>)}
          </optgroup>
        )
      })
      }
    </>
  )
}

export function ColorGradientColorArray(name) {
  let category = Object.keys(colorGradients).find(items => colorGradients[items][name])
  if (category)
    return colorGradients[category][name]
  return []
}

export function ColorGradientDropDown(props) {

  let inputName = useId()
  if (props.inputName)
    inputName = props.inputName

  const [state, setState] = useState(props.selectedScale || 'Viridis')

  let style = useMemo(() => (props.style || { 'width': '75%' }), []);

  return (
    <Dropdown>
      <Dropdown.Toggle className='form-select form-select-sm form-select-dropdown'>
        <ColorGradient colors={ColorGradientColorArray(state)} />
      </Dropdown.Toggle>

      <Dropdown.Menu className='color-gradient-menu-dd'>
        {Object.entries(colorGradients).map((category, idx) => {
          return (
            <React.Fragment key={idx}>
              <Dropdown.Header key={idx} className='text-petite-caps'>{startCase(category)}</Dropdown.Header>
              {Object.keys(category[1]).map(
                (gradient, idx) => {
                  return (
                    <Dropdown.Item as='label' className='d-flex justify-content-between align-items-center' key={idx}>
                      <input
                        type='radio'
                        name={inputName}
                        value={gradient}
                        className='d-none'
                        checked={gradient === state}
                        onChangeCapture={(e) => {
                          setState(e.target.value)
                        }
                        }
                        {...props.register(inputName)}
                      />
                      {gradient} <ColorGradient colors={ColorGradientColorArray(gradient)} style={style} />
                    </Dropdown.Item>
                  )
                }
              )}
            </React.Fragment>
          )
        })
        }
      </Dropdown.Menu>
    </Dropdown>
  )
}