import React from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form';


import { datasubsetAdded, datasubsetMultipleAdded } from '../../features/datasubset.slice'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

import pointIsInPolygon from '../../utils/map/pointIsInPolygon'

export default function ModalDialogMapAreaSelect(props) {

  const { register, getValues } = useForm();
  const dispatch = useDispatch()

  const selections = [
    { name: 'Inside Selected Areas (combined)', value: 'i' },
    { name: 'Inside Selected Areas (separate)', value: 's' },
    { name: 'Outside Selected Areas', value: 'o' }
  ]

  return (
    <Modal
      show={props.show}
      onHide={() => props.onHide()}
      backdrop="static"
      keyboard={true}
    >
      <Modal.Body>
        <h5>Filter By Map Area</h5>
        <Form.Group className='my-2'>
          <Form.Label className='form-label-header'>Selection Method</Form.Label>
          <Form.Select size='sm' aria-label="Selection Method" {...register("selectionMethod")} defaultValue='i' >
            {selections.map((option, idx) => {
              return <option key={idx} value={option.value}>{option.name}</option>
            })
            }
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className='flex-nowrap p-0'>
        <Button variant="link" className='fs-6 text-decoration-none col-6 m-0 rounded-0 border-end' onClick={() => props.onHide()}>
          Close
        </Button>
        <Button variant="link" className='fw-bold fs-6 text-decoration-none col-6 m-0 rounded-0' onClick={(e) => {
          let values = getValues();
          if (values.selectionMethod === undefined)
            values.selectionMethod = 'i'

          const layers = props.editRef.current._layers;
          let selectedIDs = [];
          let selectionLayers = [];

          for (let i in layers) {
            for (let j in props.areaselectedstate) {

              // Circle
              if (layers[i]._latlng !== undefined) {
                let contain = props.mapRef.current.distance(props.areaselectedstate[j], layers[i].getLatLng()) < layers[i].getRadius()
                if (contain)
                  selectedIDs.push(props.areaselectedstate[j]['$loki'])
              }

              // Polygon / Rectangle
              else {
                let contain = pointIsInPolygon(props.areaselectedstate[j], layers[i]._latlngs[0])
                if (contain)
                  selectedIDs.push(props.areaselectedstate[j]['$loki'])
              }

            }

            if (values.selectionMethod === 's') {

              selectedIDs = Array.from(new Set(selectedIDs))

              selectionLayers.push({
                name: 'Map Selection #' + (selectionLayers.length + 1),
                count: selectedIDs.length,
                isVisible: true,
                filter: [{
                  'name': '$loki',
                  'values': selectedIDs
                }]
              })

              selectedIDs = []
            }

          }

          selectedIDs = Array.from(new Set(selectedIDs))

          // Areas as combined selections
          if (['i', 'o'].indexOf(values.selectionMethod) > -1) {
            const selection = {
              name: 'Map Selection',
              count: selectedIDs.length,
              isVisible: true,
              filter: [{
                'name': '$loki',
                'values': (values.selectionMethod === 'i') ? selectedIDs : props.areaselectedstate.filter((item) => !selectedIDs.includes(item['$loki'])).map((item) => item['$loki'])
              }]
            }

            // Add Filter to Series
            if (selection.count > 0)
              dispatch(datasubsetAdded(selection))
          }

          if (values.selectionMethod === 's') {
            selectionLayers = selectionLayers.filter((item) => item.count > 0)
            dispatch(datasubsetMultipleAdded(selectionLayers))
          }
        }
          // }>Apply</Button>
        } disabled={(props.editRef.current && Object.entries(props.editRef.current._layers).length > 0) ? false : true}>Apply</Button>
      </Modal.Footer>
    </Modal>
  )
}
