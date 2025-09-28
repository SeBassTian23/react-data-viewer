import { useState } from 'react'

import Col from 'react-bootstrap/Col';

import PlotToolbar from '../components/Main/PlotToolbar'
import PlotMain from '../components/Main/PlotMain'

export default function Plot(props) {

  const [isSelected, setIsSelected] = useState(false);
  const [selectedMarkers, setSelectedMarkers] = useState([]);

  return (
    <>
      <div className="vh-100 d-flex flex-column">
        <div className="row">
          <Col className='pt-2'>
            <PlotToolbar isSelected={isSelected} onSelection={setIsSelected} selectedMarkers={selectedMarkers} {...props} />
          </Col>
        </div>
        <div className="row flex-grow-1">
          <PlotMain isSelected={isSelected} onSelection={setIsSelected} setSelectedMarkers={setSelectedMarkers} {...props} />
        </div>
      </div>
    </>
  )
}
