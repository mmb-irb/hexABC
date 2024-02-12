export default defineNuxtPlugin(() => {
	return {
		provide: {
			hbonds: {
				colorscale: ['#000000', '#0224ab', '#018f12' ,'#e8cf0e'],
				data:  (zdata, ydata, xdata, cscale, cbvals, cbtxt) => [{
					type: 'heatmap',
					z: zdata,
					y: ydata,
					x: xdata,
					colorscale: cscale,
					colorbar:{
						autotick: false,
						tick0: 0,
						thickness: 20,
						dtick: 1,
						ticklabelposition: 'outside',
						ypad: 1,
						title: '<br>number of hydrogen bonds',
						titleside: 'right',
						tickmode:"array",
						tickvals: cbvals,
						ticktext: cbtxt,
					},
					hovertemplate: 'bp: <b>%{y}</b>' +
									'<br>frame <b>%{x}</b>' +
									'<br>hbonds: <b>%{z}</b>' + 
									'<extra></extra>',
				}],
        layout: {
          title: null,
          hovermode: "closest",
          hoverlabel: { bgcolor: "#f9f9f9" },
          xaxis: {
            //range: [5, 10],
            tickformat: "d",
            title: {
              text: 'frame number',
              standoff: 20
            }
          },
          yaxis: {
            title: {
              text: 'base pair',
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
        },
        config:  {
          scrollZoom: true, 
          displayModeBar: false, 
          responsive: true 
        },
        range: 25000
			}
		}
	}
})