export default defineNuxtPlugin(() => {
	return {
		provide: {
			fluctuation: {
				ytitle: 'Fluctuation (Å)',
				xtitle: 'Atoms',
        atoms: [
          { atom: 'C', color: '#aaaaaa' },
          { atom: 'H', color: '#f1f1f1' },
          { atom: 'N', color: '#0000cc' },
          { atom: 'O', color: '#ff0000' },
          { atom: 'P', color: '#ffb03b' },
        ],
				plot: {
          data: (xdata, ydata, color) => [{
            x: xdata,
            y: ydata,
            type: 'scatter',
            mode: 'markers',
            name: 'Linear Plot',
            marker: { 
              color: color,
              line: {
                color: 'rgba(200, 200, 200, 0.4)',
                width: 1
              } 
            },
            hovertemplate: `%{x}<br>%{y:.2f}Å<extra></extra>`,
          }],
          layout: (xtit, ytit) => {
            return {
              title: null,
              showlegend: false,
              autosize: true,
              hovermode: "closest",
              hoverlabel: { bgcolor: "#f9f9f9" },
              xaxis: {
                tickformat: "d",
                showticklabels: false,
                showgrid: false,
                title: {
                  text: xtit,
                  standoff: 500
                },
              },
              yaxis: {
                title: {
                  text: ytit,
                  standoff: 0
                }
              },
              margin: {
                l: 40,
                r: 0,
                b: 10,
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