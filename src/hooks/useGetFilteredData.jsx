import { useSelector } from "react-redux";
import getUnique from '../utils/lokijs/getUnique'
import getSeries from '../utils/lokijs/getSeries'
import gdf  from '../utils/lokijs/getFilteredData'

export default function useGetFilteredData() {

  const flags = useSelector(state => state.flags)

  const getFilteredData = (collection, { filters = [], thresholds = [], sortby = '', dropna = [], ignore = [] } = {})  => {
    
    // Check if the flags are active
    if(collection && flags.isActive && flags.checksum && (!Array.isArray(ignore) ||  ignore.length == 0))
      ignore = flags.datumIds
    
    return gdf( collection, {filters, thresholds, sortby, dropna, ignore})
  }

  return {
    getFilteredData,
    getUnique,
    getSeries
  }
}