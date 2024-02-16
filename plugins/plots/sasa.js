export default defineNuxtPlugin(() => {
	return {
		provide: {
			sasa: {
				ytitle: 'Relative SAS (Å²)',
				xtitle: 'Frames',
				title: 'SASA',
				plot: {
					data: (xdata, ydata, tracetit) => {
            return {
              x: xdata,
              y: ydata,
              type: 'scatter',
              mode: 'lines',
              name: tracetit,
              //marker: { color: '#d90429' },
              hovertemplate: `<b>${tracetit}</b> %{y:.2f}Å<extra></extra>`
            }
          },
          layout: (xtit, ytit) => {
            return {
              title: null,
              showlegend: false,
              hovermode: "x",
              hoverlabel: { bgcolor: "#f9f9f9" },
              xaxis: {
                tickformat: "d",
                title: {
                  text: xtit,
                  standoff: 10
                }
              },
              yaxis: {
                title: {
                  text: ytit,
                  standoff: 0
                }
              },
              margin: {
                l: 50,
                r: 0,
                b: 80,
                t: 0,
                pad: 0
              }
            }
          },
          config: {
            scrollZoom: true, 
            displayModeBar: false, 
            responsive: true 
          }
				}
			}
		}
	}
})