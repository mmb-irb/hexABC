export default defineNuxtPlugin(() => {
	return {
		provide: {
			fluctuation: {
				ytitle: 'Fluctuation (Å)',
				xtitle: 'Atoms',
        atoms: [
          { atom: 'C', name: 'Carbon', color: '#aaaaaa' },
          { atom: 'H', name: 'Hydrogen', color: '#f1f1f1' },
          { atom: 'N', name: 'Nitrogen', color: '#0000cc' },
          { atom: 'O', name: 'Oxygen', color: '#ff0000' },
          { atom: 'P', name: 'Phosphorus', color: '#ffb03b' },
        ],
				plot: {
          data: (xdata, ydata, name, color) => {
            return {
            x: xdata,
            y: ydata,
            type: 'scatter',
            mode: 'markers',
            name: name,
            marker: { 
              color: color,
              line: {
                color: 'rgba(200, 200, 200, 0.4)',
                width: 1
              } 
            },
            hovertemplate: `%{x}<br>%{y:.2f}Å<extra></extra>`,
          }
          },
          layout: (xtit, ytit) => {
            return {
              title: null,
              showlegend: true,
              legend: {orientation: "h"},
              autosize: true,
              hovermode: "closest",
              hoverlabel: { bgcolor: "#f9f9f9" },
              xaxis: {
                tickformat: "d",
                showticklabels: false,
                showgrid: false,
                title: {
                  text: xtit,
                  standoff: 390
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
                b: 0,
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