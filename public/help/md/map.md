# Map

The Map view allows you to visualize and analyze data with geographic coordinates.

## Base Maps

The following base maps are available through the Map Layer selector <i class="bi-stack"></i> in the upper right corner:

| <i class="bi-stack"></i> Map Layer | Content                                                                                                                                |
| :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| OpenStreetMap (default)            | Standard street map with detailed road networks, landmarks, and points of interest. Best for urban navigation and general purpose use. |
| OpenTopoMap                        | Topographic map featuring terrain contours, hiking trails, and elevation data. Ideal for outdoor activities and terrain analysis.      |
| CartoDB                            | Clean, general-purpose map with balanced detail. Good for data visualization where the base map shouldn't dominate.                    |
| CartoDB Positron - light theme     | Minimalist light-colored map with subtle features. Perfect for overlaying dark-colored data visualizations.                            |
| CartoDB Positron - dark theme      | Minimalist dark-colored map. Excellent for highlighting bright data visualizations and reducing eye strain in low-light conditions.    |
| ArcGIS:NatGeo                      | National Geographic style map combining terrain features with political boundaries. Great for educational and presentation contexts.   |
| maps-for-free                      | Relief map emphasizing natural terrain features and land cover. Suitable for environmental and geological analysis.                    |
| Esri:Topo                          | Detailed topographic map with terrain features, contour lines, and place names. Ideal for elevation and landscape analysis.            |

Toggle between color and grayscale tiles using the <i class="bi-shadows"></i> Filter button in the toolbar.

## Navigation

Navigate the map using standard map controls or mouse/touch gestures:

- `Pan`: Click and drag or use arrow keys
- `Zoom`: Mouse wheel, double-click, or use + / - buttons
- `Reset View`: Click the <i class="bi-arrows-angle-expand"></i> "Reset Map View" button to adjust the view to show all data points

## Data Visualization

Geographic data points are displayed as markers on the map. Each marker represents a location defined by latitude and longitude coordinates.

A click on a marker will bring up a drawer with all the parameters connected to the marker.

### Color Coding

Markers can be colored in two ways:

- By Data Series: The marker color is assigned by the data subsets
- By Parameter: The Color is defined by the numeric parameter and selected color gradient
  - A histogram shows the distribution of values
  - The color scale automatically adjusts to the data range
  - Selecting parts of the histogram removes markers outside of the selected range

You can select coloration by Data Series using the <i class="bi-geo-alt-fill"></i> Marker Button or the histogram dialog by selecting the <i class="bi-bar-chart-fill"></i> Chart Button to bring up the dialog to select the parameter based coloration.

### Spatial Analysis

#### Drawing Tools

Use the drawing toolbar to create shapes for spatial filtering:

- `Circle`: Click center point and drag to define radius
- `Rectangle`: Click and drag to define corners
- `Polygon`: Click to add points, double-click to complete
- <i class="bi-pencil-square"></i> Edit a selected shape
- <i class="bi-trash"></i> Delete one or all shapes

#### Filter Options

After drawing the shapes, select the <i class="bi-bounding-box"></i> button to pick how to filter your data:

- **Inside (All)**: Include points within any drawn shape
- **Inside (Separate)**: Create separate subsets for each shape
- **Outside**: Include only points outside all shapes

### Dashboard Integration

Add the current map view to your dashboard using the <i class="bi-window-plus"></i> "Add to Dashboard" button. The dashboard panel will include:

- Current map view and zoom level
- Active base map selection
- Color coding settings *(by subset or parameter)*

The map panel will update automatically when data filters or subsets change.

> [!note] Once added to the dashboard, the map cannot be edited directly in the panel. Return to the Map view by clicking on the map in the panel.
