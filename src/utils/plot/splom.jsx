


const splom = ({ input = [], diagonal = false, parameters = [] } = {}) => {

    let data = []
    let layout = {
        xaxis: {
            title: {
                text: null
            }
        },
        yaxis: {
            title: {
                text: null
            }
        }
    }

    if (diagonal === true || diagonal === "true")
        diagonal = true

    if (diagonal === false || diagonal === "false")
        diagonal = false

    for (let i in input) {
        data.push({
            "dimensions": input[i].dimensions.map((item, idx) => {
                return {
                    label: parameters.find(e => e.name === input[i].dimensionsaxis[idx])?.alias || input[i].dimensionsaxis[idx],
                    values: item
                }
            }),
            "idx": input[i]['$loki'],
            "type": "splom",
            "name": input[i].name,
            "legendgroup": input[i].id,
            "visible": true,
            "diagonal": {
                "visible": diagonal
            },
            "marker": {
                "color": input[i].color || '#000000'
            }
        })
    }

    return { data, layout }
}

export default splom
