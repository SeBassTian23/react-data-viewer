
/**
 * Panel Warning Component
 * @param {*} props 
 * @returns component
 */
export default function PanelWarning( {children, ...props }){
  return (<div className='d-flex flex-column justify-content-center align-items-center m-0 p-3 h-100'>
    <span className='text-danger small'>
      {props.warning || ""}
    </span>
    {children}
  </div>)
}