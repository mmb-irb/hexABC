export default defineNuxtPlugin(() => {
	return {
		provide: {
			shift: {
        colorscale: [
          [0, 'ffffff'],
          [0.16, 'ffffff'], // Value 0 (unimodal, -0.02±0.35)
          [0.16, 'ff0000'], 
          [0.33, 'ff0000'], // Value 1 (unimodal, < -0.02±0.35)
          [0.33, '0000ff'], 
          [0.49, '0000ff'], // Value 2 (unimodal, > -0.02±0.35)
          [0.49, 'ffffff'], 
          [0.66, 'ffffff'], // Value 3 (not unimodal, -0.02±0.35)
          [0.66, 'ffffff'], 
          [0.82, 'ffffff'], // Value 4 (not unimodal, < -0.02±0.35)
          [0.82, 'ff0000'],
          [1, 'ff0000'] // Value 5 (not unimodal, > -0.02±0.35)
        ],
        legendZ: [
          'unimodal<br>mean = -0.02 ± 0.35',
          'unimodal<br>mean < -0.02 - 0.35',
          'unimodal<br>mean > -0.02 + 0.35',
          'not unimodal<br>mean = -0.02 ± 0.35',
          'not unimodal<br>mean < -0.02 - 0.35',
          'not unimodal<br>mean > -0.02 + 0.35'
        ],
        data: (xdata, ydata, zdata, cscale, legend) => [{
          x: xdata,
          y: ydata,
          z: zdata,
          customdata: legend,
          type: 'heatmap',
          xgap : 1,
          ygap : 1,
          colorscale: cscale,
          showscale: false,
          hovertemplate: `hexamer <b>%{y}</b>` +
									`<br>tetramer <b>%{x}</b>` +
									`<extra></extra>`
        }],
        layout: {
          plot_bgcolor: "#cccccc",
          annotations: [],
          xaxis: {
            ticks: '',
            side: 'bottom',
            showgrid: false,
            zeroline:false,
            showticklabels: true
          },
          yaxis: {
            autosize: false,
            showgrid: false,
            zeroline: false
          },
          margin: {
            l: 45,
            r: 2,
            b: 45,
            t: 2,
            pad: 4
          },
        },
        config:  {
          scrollZoom: true, 
          displayModeBar: false, 
          responsive: true 
        }
			}
		}
	}
})