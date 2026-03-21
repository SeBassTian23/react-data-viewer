import React, { useEffect, useId, useState } from 'react'

import Dropdown from 'react-bootstrap/Dropdown'

import colorSchemes, {colorSchemeNames} from '../../constants/color-schemes'
import linearColorScale from '../../utils/plot/colorscale-css'

export default function ColorScheme(props) {

  const gradient = linearColorScale(props.colors, true)
  const style = { 'width': '100%', 'height': '22px', 'background': gradient, ...props.style, borderRadius: 'var(--bs-border-radius-sm)' }

  return (
    <div className={props.className || null} style={style}></div>
  )
}

export function ColorSchemeDropDown(props) {

  let inputName = useId()
  if (props.inputName)
    inputName = props.inputName

  const [selected, setSelected] = useState(props.refColorScheme?.current || 'default')

  useEffect( () => {
    if(props.refColorScheme?.current)
      props.refColorScheme.current = selected
  },[selected])

  return (
    <Dropdown>
      <Dropdown.Toggle className='form-select form-select-sm form-select-dropdown' disabled={props.disabled}>
        <ColorScheme colors={colorSchemes[selected]} />
      </Dropdown.Toggle>

      <Dropdown.Menu className='color-scheme-menu-dd'>
        {Object.entries(colorSchemes).map((scheme, idx) => {
          let schemeName = scheme[0]
          let schemeColors = scheme[1]
          let schemeNameFormatted = colorSchemeNames[scheme[0]]
          return (
            <Dropdown.Item as='label' className={`d-flex justify-content-between align-items-center${schemeName === selected? ' active' : '' }`} key={idx}>
              <input
                type='radio'
                name={inputName}
                value={schemeName}
                className={`d-none`}
                checked={schemeName === selected}
                onChange={(e) => {
                  setSelected(e.target.value)
                }
                }
              />
              {schemeNameFormatted} <ColorScheme colors={schemeColors} style={{width: '55%'}} />
            </Dropdown.Item>
          )
        })
        }
      </Dropdown.Menu>
    </Dropdown>
  )
}