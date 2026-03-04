import { ColorGradientColorArray } from '../../components/Main/ColorGradient'
import jStat from 'jstat'

const surface = ({ input = [], gradient = 'Viridis', contours = 'Hide', camera = null, parameters = []  } = {}) => {

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

  for (let i in input) {  
    // layout.scene.xaxis.title.text = parameters.find(e => e.name === input[i].xaxis)?.alias || input[i].xaxis
    // layout.scene.yaxis.title.text = parameters.find(e => e.name === input[i].yaxis)?.alias || input[i].yaxis
    layout.scene.xaxis.title.text = null;
    layout.scene.yaxis.title.text = null;
    layout.scene.zaxis.title.text = parameters.find(e => e.name === input[i].zaxis)?.alias || input[i].zaxis

    // layout.scene.xaxis.visible = true
    // layout.scene.yaxis.visible = true
    // layout.scene.zaxis.visible = true
    // layout.scene.xaxis.visible = input[i].xaxis === 'None'? false : true
    // layout.scene.yaxis.visible = input[i].yaxis === 'None'? false : true

  }
    
  let data = {
    z: input.flatMap(item => item.z),
    type: 'surface',
    // surfacecolor: ColorGradientColorArray(gradient).map((item, idx, arr) => [(idx / (arr.length - 1)), item]) || gradient,
    // ids: input.flatMap(item => item['$loki']),
    colorscale: ColorGradientColorArray(gradient).map((item, idx, arr) => [(idx / (arr.length - 1)), item]) || gradient,
    colorbar: {
      thickness: 20,
      // title: {
      //   text: colorbartitle,
      //   side: 'right'
      // }
    },
    contours: {
      x: {
        show: false,
        highlight: contours === 'Show'? true : false,
        usecolormap: false,
        highlightcolor:"#42f462",
        project:{ 
          x: false,
          y: false,
          z: false
        }
      },
      y: {
        show: false,
        highlight: contours === 'Show'? true : false,
        usecolormap: false,
        highlightcolor:"#42f462",
        project:{ 
          x: false,
          y: false,
          z: false
        }
      },
      z: {
        show: false, //contours === 'Show'? true : false,
        highlight: contours === 'Show'? true : false,
        usecolormap: false,
        highlightcolor:"#42f462",
        project:{ 
          x: false,
          y: false,
          z: false
        }
      }
    },
    showscale: scaleisVisible,
  }

  // Create Array
  data = [data]

  return { data, layout }
}

export default surface
