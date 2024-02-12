export default defineNuxtPlugin(() => {
	return {
		provide: {
			rmsd: {
				firstframe: {
					ytitle: 'RMSd (Å)',
					xtitle: 'Time (ns)',
					title: 'First frame RMSd'
				},
				average: {
					ytitle: 'RMSd (Å)',
					xtitle: 'Time (ns)',
					title: 'Average RMSd'
				},
				pairwise: {
					ytitle: 'Frames',
					xtitle: 'Frames',
					title: 'RMSd pairwise'
				},
				plots: {
					rmsd: {
						data: (ydata) => [{
							y: ydata,
							type: 'scatter',
							mode: 'lines',
							name: 'Linear Plot',
							marker: { color: '#d90429' },
						}],
						layout: (xtit, ytit) => {
							return {
								title: null,
								showlegend: false,
								hovermode: "closest",
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
					},
					pairwise: {
						data:  (xdata, ydata, zdata) => [{
							type: 'heatmap',
							colorscale: 'Hot',
							x: xdata,
							y: ydata,
							z: zdata,
							colorbar:{
								thickness: 20,
								ticklabelposition: 'outside',
								title: 'RMSD (Å)',
								titleside: 'right',
							},
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
	}
})