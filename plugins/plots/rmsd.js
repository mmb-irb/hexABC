export default defineNuxtPlugin(() => {
	return {
		provide: {
			rmsd: {
				ytitle: 'RMSd (Å)',
				xtitle: 'Time (ns)',
				firstframe: {
					title: 'First frame RMSd'
				},
				average: {
					title: 'Average RMSd'
				},
				plot: {
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
				}
			}
		}
	}
})