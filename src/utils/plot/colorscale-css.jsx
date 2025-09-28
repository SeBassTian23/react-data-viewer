export default function linearColorScale(colors, isStep) {

  let steps = []

  for (let i = 0, len = colors.length; i < len; i++) {
    if (!isStep) {
      let percent = (i * (len / (len - 1))) / len * 100;
      if (i === 0)
        percent = 0
      if (i === len - 1)
        percent = 100
      steps.push(`${colors[i]} ${percent}%`)
    }
    if (isStep) {
      var percent = i / len * 100;
      steps.push(`${colors[i]} ${percent}%`)
      percent = (i + 1) / len * 100;
      steps.push(`${colors[i]} ${percent}%`)
    }

  }

  return `linear-gradient(90deg, ${steps.join(',')} )`
}
