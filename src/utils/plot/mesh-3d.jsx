import { ColorGradientColorArray } from '../../components/Main/ColorGradient'
import jStat from 'jstat'

const mesh3d = ({ input = [], gradient = 'Viridis', contours = 'Hide', camera = null, parameters = []  } = {}) => {

  let layout = {
    scene: {
      xaxis: {
        title: {
          text: 'x-Axis'
        }
      },
      yaxis: {
        title: {
          text: 'y-Axis'
        }
      },
      zaxis: {
        title: {
          text: 'z-Axis'
        }
      },
      dragmode: "turntable",
      camera: {
        "up": {
            "x": 0,
            "y": -0.3,
            "z": 1
        },
        "center": {
            "x": 0.02403915366009736,
            "y": 0.05229099136403341,
            "z": -0.14839975251373883
        },
        "eye": {
            "x": 0.5400601603427597,
            "y": 1.8085400211512366,
            "z": 0.5540320868623193
        },
        "projection": {
            "type": "perspective"
        }
      }
    }
  }

  if(camera)
    layout.scene.camera = camera

  let scaleisVisible = true

  let colorbartitle = ''
  
  for (let i in input) {
    layout.scene.xaxis.title.text = parameters.find(e => e.name === input[i].xaxis)?.alias || input[i].xaxis
    layout.scene.yaxis.title.text = parameters.find(e => e.name === input[i].yaxis)?.alias || input[i].yaxis
    layout.scene.zaxis.title.text = parameters.find(e => e.name === input[i].zaxis)?.alias || input[i].zaxis
    colorbartitle = parameters.find(e => e.name === input[i].colorscaleaxis)?.alias || input[i].colorscaleaxis
    break;
  }

  let data = {
    opacity:0.8,
    type: 'mesh3d',
    x: input.flatMap(item => item.x),
    y: input.flatMap(item => item.y),
    z: input.flatMap(item => item.z),
    idx: input.flatMap(item => item['$loki']),
    intensity: input.flatMap(item => item.colorscale),
    colorscale: ColorGradientColorArray(gradient).map((item, idx, arr) => [(idx / (arr.length - 1)), item]) || gradient,
    colorbar: {
      thickness: 20,
      title: {
        text: colorbartitle,
        side: 'right'
      }
    },
    showscale: scaleisVisible,
    contour: {
      show: contours === 'Show'? true : false,
      // color: "#FF0000",
      width: 2 // default
    }
  };

  if( jStat.min(data.intensity) === undefined){
    delete data.intensity
    data.color = '#0d6efd'
  }

  // Create Array
  data = [data]

  return { data, layout }
}

export default mesh3d
