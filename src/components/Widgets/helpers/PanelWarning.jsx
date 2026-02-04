
/**
 * Panel Warning Component
 * @param {*} props 
 * @returns component
 */
export default function PanelWarning( props ){
  return (<div className='d-flex justify-content-center align-items-center m-0 p-3 h-100'>
    <span className='text-danger small'>
      {props.warning || ""}
    </span>
  </div>)
}