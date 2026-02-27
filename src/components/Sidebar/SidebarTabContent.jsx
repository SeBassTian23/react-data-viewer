import DataSubset from './DataSubset'
import DataTypes from './DataTypes'
import Filters from './Filters'
import Parameters from './Parameters'
import ParameterFilters from './ParameterFilters'
import Bookmarks from './Bookmarks'
import Thresholds from './Thresholds'
import RecentFiles from './RecentFiles'
import Flags from './Flags'
import Aliases from './Aliases';

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