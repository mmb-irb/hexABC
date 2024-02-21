export default defineNuxtPlugin(() => {
	return {
		provide: {
			pca: {
        eigenvalues: {
          ytitle: 'Eigenvalue',
          ytitle2: 'Cumulative variance (%)',
          xtitle: 'Principal Component',
        },
				plots: {
          eigenvalues: {
            evdata: (xdata, ydata) => {
              return {
                x: xdata,
                y: ydata,
                type: 'bar',
                name: 'Eigenvalue',
                marker: { color: '#d90429' },
                hovertemplate: `<b>%{x}</b> %{y:.2f}`
              }
            },
            vardata: (xdata, ydata) => {
              return {
                x: xdata,
                y: ydata,
                type: 'scatter',
                mode: 'lines',
                name: 'Cumulative variance',
                marker: { color: '#ff7885' },
                yaxis: 'y2',
                fill: 'tonexty',
                hovertemplate: `<b>%{x}</b> %{y:.2f}%`
              }
            },
            layout: (xtit, ytit, ytit2) => {
              return {
                title: null,
                showlegend: false,
                hovermode: "x unified",
                hoverlabel: { bgcolor: "#f9f9f9" },
                xaxis: {
                  tickmode: 'linear',
                  dtick: 1,
                  tickformat: "d",
                  title: {
                    text: xtit,
                    standoff: 10
                  }
                },
                yaxis: {
                  title: {
                    text: ytit,
                    standoff: 10
                  },
                },
                yaxis2: {
                  title: ytit2,
                  overlaying: 'y',
                  side: 'right',
                  showgrid: false
                },
                margin: {
                  l: 50,
                  r: 40,
                  b: 80,
                  t: 0,
                  pad: 0
                }
              }
            },
            config: {
              scrollZoom: false, 
              displayModeBar: false, 
              responsive: true 
            }
          },
          projections: {
            data: (xdata, ydata, prj1, prj2, colors) => [{
                x: xdata,
                y: ydata,
                type: 'scatter',
                mode: 'markers',
                name: 'projections',
                marker: { color: colors },
                hovertemplate: `<b>PC${prj1}:</b> %{x:.2f} <b>PC${prj2}:</b> %{y:.2f}<extra></extra>`
            }],
            layout: (xtit, ytit) => {
              return {
                title: null,
                showlegend: false,
                hovermode: "closest",
                hoverlabel: { bgcolor: "#f9f9f9" },
                xaxis: {
                  /*tickmode: 'linear',
                  dtick: 1,*/
                  //tickformat: "d",
                  title: {
                    text: xtit,
                    standoff: 10
                  }
                },
                yaxis: {
                  title: {
                    text: ytit,
                    standoff: 10
                  },
                },
                margin: {
                  l: 50,
                  r: 40,
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
	}
})