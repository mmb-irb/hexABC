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
				residues: {
					ytitle: 'RMSd (Å)',
					xtitle: 'Frames',
					title: 'RMSd per residue'
				},
				plots: {
					rmsd: {
						data: (xdata, ydata) => [{
							x: xdata,
							y: ydata,
							type: 'scatter',
							mode: 'lines',
							name: 'Linear Plot',
							marker: { color: '#d90429' },
							hovertemplate: `%{y:.2f}Å<extra></extra>`,
						}],
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
					},
					pairwise: {
						data:  (xdata, ydata, zdata) => [{
							type: 'heatmap',
							//colorscale: 'Hot',
							colorscale: [
								[0, "#fef4ef"],
								[0.25, "#fcbca2"],
								[0.5, "#fb6a4a"],
								[0.75, "#ca181c"],
								[1, "#69000e"]
								/*[0, "#69000e"],
								[0.25, "#ca181c"],
								[0.5, "#fb6a4a"],
								[0.75, "#fcbca2"],
								[1, "#fef4ef"]*/
							],
							x: xdata,
							y: ydata,
							z: zdata,
							colorbar:{
								thickness: 20,
								ticklabelposition: 'outside',
								title: 'RMSD (Å)',
								titleside: 'right',
							},
							hovertemplate: 'frames: <b>%{x:d}</b> - <b>%{y:d}</b>' +
									'<br>RMSd: <b>%{z:.2f}Å</b>' + 
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
					},
					residues: {
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
	}
})