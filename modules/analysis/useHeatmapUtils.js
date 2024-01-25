export default function useHeatmapUtils() {

  /* HBONDS HEATMAP PLOT */ 

  // parse data resulting from the REST API in a format that can be used by plotly
  const getParsedHBonds = (hbs) => {
    let b = []
    let h = []
    
    hbs.forEach((hb) => {
      b.push(hb.bp)
      h.push(Object.values(hb.hbonds))
    })
    return {b, h}
  }

  // recalculate heatmap color scale
  const getColorScale = (values, colors) => {

    const colorscale = []
    const total = values.length

    let p1 = 0
    values.forEach((value, index) => {
      let p2 = parseFloat(((index  + 1) / total).toFixed(2))
      colorscale.push([p1, colors[value]])
      colorscale.push([p2, colors[value]])
      p1 = p2
    })

    return colorscale

  }

  // get heatmap colorbar text (brs are used to put numbers in the middle of the tick)
  const getColorBarText = (values) => {
    switch(values.length) {
      case 1:
        return [values[0]]
      case 2:
        return [`${values[0]}<br><br><br><br><br><br><br><br><br><br><br><br><br>`, `<br><br><br><br><br><br><br><br><br><br><br><br><br>${values[1]}`]
      case 3:
        if(values[1] === 1) return [`${values[0]}<br><br><br><br><br><br><br><br><br>`,`${values[1]}<br><br><br><br><br><br><br><br><br>`,`<br><br><br><br><br><br><br><br>${values[2]}`]
        if(values[1] === 2) return [`${values[0]}<br><br><br><br><br><br><br><br><br>`,`<br><br><br><br><br><br><br><br><br>${values[1]}`,`<br><br><br><br><br><br><br><br>${values[2]}`]
        else return [`${values[0]}<br><br><br><br><br><br><br><br><br>`,`${values[1]}`,`<br><br><br><br><br><br><br><br>${values[2]}`]
      case 4:
        return [`${values[0]}<br><br><br><br><br><br><br>`,`${values[1]}<br><br>`,`<br><br>${values[2]}`, `<br><br><br><br><br><br><br>${values[3]}`]
    }
  }

  /* HEATMAP GENERIC FUNCTIONS */

  // get unique values from heatmap data
  const getHMUniqueValues = (values) => {
    return values.reduce((result, subarray) => {
      subarray.forEach(value => {
        if (!result.includes(value)) {
          result.push(value);
        }
      });
      return result.sort();
    }, []);
  }

  const downSamplingAxis = (numframes, factor) => {
    return Array.from({length: numframes}, (_, i) => i * factor)
  }

  const getPlotlyForImage = (plotData, plotLayout) => {
    const dataCopy = JSON.parse(JSON.stringify(plotData));
    const layoutCopy = JSON.parse(JSON.stringify(plotLayout));

    layoutCopy.height = 40;
    // Remove the axes labels and color scale
    layoutCopy.xaxis.title = '';
    layoutCopy.yaxis.title = '';
    layoutCopy.xaxis.showticklabels = false;
    layoutCopy.yaxis.showticklabels = false;
    layoutCopy.margin = { l: 0, r: 0, b: 0, t: 0, pad: 0 }
    dataCopy.forEach(trace => {
      if (trace.colorbar) {
        trace.showscale = false;
      }
    });

    return { dataCopy: dataCopy, layoutCopy: layoutCopy };
  }

  return {
    getParsedHBonds,
    getColorScale,
    getColorBarText,
    getHMUniqueValues,
    downSamplingAxis,
    getPlotlyForImage
  }

}