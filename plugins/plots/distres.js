export default defineNuxtPlugin(() => {
	return {
		provide: {
			distres: {
				means: {
					ytitle: 'Crick strand',
					xtitle: 'Watson strand',
					title: 'Residues distances average'
				},
				stdvs: {
					ytitle: 'Crick strand',
					xtitle: 'Watson strand',
					title: 'Residues distances standard deviations (Å)'
				},
				plot: {
          data:  (xdata, ydata, zdata, colorbartit) => [{
            type: 'heatmap',
            colorscale: 'Hot',
            x: xdata,
            y: ydata,
            z: zdata,
            colorbar:{
              thickness: 20,
              ticklabelposition: 'outside',
              title: colorbartit,
              titleside: 'right',
            },
            hovertemplate: '<b>%{x}</b> - <b>%{y}</b>' +
                '<br>distance: <b>%{z:.2f}Å</b>' + 
                '<extra></extra>',
          }],
          layout: (xtit, ytit) => {
            return {
              title: null,
              hovermode: "closest",
              hoverlabel: { bgcolor: "#f9f9f9" },
              xaxis: {
                //range: [5, 10],
                tickformat: "d",
                title: {
                  text: xtit,
                  standoff: 20
                }
              },
              yaxis: {
                title: {
                  text: ytit,
                  standoff: 10
                }
              },
              margin: {
                l: 80,
                r: 0,
                b: 50,
                t: 20,
                pad: 4
              },
              annotations: {
                arrowcolor: '#f00000',
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