import DataSubset from './DataSubsets/DataSubset'
import DataTypes from './DataTypes/DataTypes'
import Filters from './Filters/Filters'
import Parameters from './Parameters/Parameters'
import ParameterFilters from './Parameters/ParameterFilters'
import Bookmarks from './Bookmarks/Bookmarks'
import Thresholds from './Thresholds/Thresholds'
import RecentFiles from './RecentFiles/RecentFiles'
import Flags from './Flags/Flags'
import Aliases from './Aliases/Aliases';

export default function RenderTabContent({tab, setModalImport, ...props}) {
  
  const TAB_COMPONENTS = {
    DATASUBSETS: <DataSubset setModalImport={setModalImport} />,
    DATATYPES: <DataTypes />,
    FILTERS: <Filters />,
    PARAMETERS: <Parameters />,
    BOOKMARKS: <Bookmarks />,
    THRESHOLDS: <Thresholds />,
    ALIASES: <Aliases />,
    PARAMETERFILTERS: <ParameterFilters />,
    RECENT: <RecentFiles />,
    FLAGS: <Flags {...props} />
  }

  return ( TAB_COMPONENTS[tab] ?? <DataSubset setModalImport={setModalImport} /> )
}