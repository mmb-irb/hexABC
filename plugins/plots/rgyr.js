export default defineNuxtPlugin(() => {
	return {
		provide: {
			rgyr: {
				ytitle: 'Rgyr (Å)',
				xtitle: 'Frames',
				title: 'Rgyr',
				plot: {
					data: (xdata, ydata, tracetit) => {
						return {
							x: xdata,
							y: ydata,
							type: 'scatter',
							mode: 'lines',
							name: tracetit,
							hovertemplate: `${tracetit}: %{y:.2f}Å<extra></extra>`,
							//marker: { color: '#d90429' },
						}
					},
					layout: (xtit, ytit) => {
						return {
							title: null,
							showlegend: true,
							legend: {orientation: "h"},
							autosize: true,
							hovermode: 'x unified',
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