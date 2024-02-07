export default defineNuxtPlugin(() => {
	return {
		provide: {
			curves: {
				sel_type: ['Nucleotide', 'Base step', 'Base pair', 'Base pair step', 'Tetramer', 'Hexamer'],
				descriptions: {
					rise: {
						title: 'Rise',
						description: 'The vertical distance between consecutive base pairs along the helical axis. It represents the distance the helix moves upwards along its axis with each base pair.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Rise (Å)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					roll: {
						title: 'Roll',
						description: 'The angle between the base pair plane and a reference plane perpendicular to the helical axis. It describes the rotational displacement of one base pair with respect to the next.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Roll (Degrees)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					shift: {
						title: 'Shift',
						description: 'The horizontal displacement of one base pair relative to the next along the helical axis. It represents the sideways movement of one base pair along the helical axis.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Shift (Å)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					slide: {
						title: 'Slide',
						description: 'The lateral displacement of one base pair relative to the next along the helical axis. It represents the shift of one base pair perpendicular to the helical axis.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Slide (Å)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					tilt: {
						title: 'Tilt',
						description: 'The angle between the helical axis and the base pair plane. It indicates the inclination of the base pairs with respect to the helical axis.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Tilt (Degrees)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					twist: {
						title: 'Twist',
						description: 'The rotation angle between consecutive base pairs along the helical axis. It is usually measured in degrees.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Twist (Degrees)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					alpha: {
						title: 'Alpha (α) Torsions',
						description: 'The angle formed by the C1\'-N9 bond in a purine or C1\'-N1 bond in a pyrimidine, measured from the C1\' atom towards the N base atom.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Alpha (Degrees)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					beta: {
						title: 'Beta (β) Torsions',
						description: 'The angle formed by the N9-C1\'-N1 atoms in a purine or N1-C1\'-N3 atoms in a pyrimidine, measured from the N9 or N1 atom towards the C1\' atom.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Beta (Degrees)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					gamma: {
						title: 'Gamma (γ) Torsions',
						description: 'The angle formed by the C1\'-N1 or C1\'-N3 bonds in a purine or pyrimidine, measured from the C1\' atom towards the N base atom.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Gamma (Degrees)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					delta: {
						title: 'Delta (δ) Torsions',
						description: 'The angle formed by the N1-C1\'-N3 atoms in a purine or N3-C1\'-N1 atoms in a pyrimidine, measured from the N1 or N3 atom towards the C1\' atom.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Delta (Degrees)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					chi: {
						title: 'Chi (χ) Torsions',
						description: 'The dihedral angle involving the N1-C1\'-N9-C4 atoms in a purine or N1-C1\'-N1-C2 atoms in a pyrimidine.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Chi (Degrees)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					epsilon: {
						title: 'Epsilon (ε) Torsions',
						description: 'The dihedral angle involving the C4-C1\'-N1-C2 atoms in a pyrimidine.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Epsilon (Degrees)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					theta: {
						title: 'Theta (θ) Torsions',
						description: 'The dihedral angle involving the C2-C1\'-N1-C2 atoms in a pyrimidine.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Theta (Degrees)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					inclination: {
						title: 'Inclination',
						description: 'Tilt or slant of the entire DNA helix with respect to a reference axis, often the helical axis.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Inclination (Degrees)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					tip: {
						title: 'Tip',
						description: 'Rotation or twist of the DNA helix at its end.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Tip (Degrees)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					xdisp: {
						title: 'X-Displacement',
						description: 'The horizontal or lateral displacement of one base pair relative to the next along the helical axis.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'X-Displacement (Degrees)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					ydisp: {
						title: 'Y-Displacement',
						description: 'The vertical displacement of one base pair relative to the next along the helical axis.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Y-Displacement (Degrees)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					shear: {
						title: 'Shear',
						description: 'Refers to the lateral displacement between consecutive base pairs along the helical axis.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Shear (Å)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					stretch: {
						title: 'Stretch',
						description: 'Represents the extension or compression of the distance between base pairs along the helical axis.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Stretch (Å)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					stagger: {
						title: 'Stagger',
						description: 'It is the vertical displacement between consecutive base pairs along the helical axis.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Stagger (Å)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					buckle: {
						title: 'Buckle',
						description: 'Measures the bending or bending-unbending deformation of the base pair step.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Buckle (Degrees)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					propeller: {
						title: 'Propeller',
						description: 'Refers to the rotation of one base pair with respect to the next base pair in the same strand.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Propeller (Degrees)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					opening: {
						title: 'Opening',
						description: 'Represents the separation or angular displacement between the planes of two adjacent base pairs.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Opening (Degrees)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					majorgd: {
						title: 'Major Groove Depth',
						description: 'Refers to the distance between the two strands of the DNA double helix measured from the outer edge of one strand to the outer edge of the opposite strand within the major groove.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Major Groove Depth (Å)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					majorgw: {
						title: 'Major Groove Width',
						description: 'Refers to the separation between the two strands of the DNA double helix within the major groove.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Major Groove Width (Å)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					minorgd: {
						title: 'Minor Groove Depth',
						description: 'Refers to the distance between the two strands of the DNA double helix measured from the outer edge of one strand to the outer edge of the opposite strand within the minor groove.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Minor Groove Depth (Å)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					minorgw: {
						title: 'Minor Groove Width',
						description: 'Refers to the separation between the two strands of the DNA double helix within the minor groove.',
						plot: {
							timeseries: {
								histogram: 'Density',
								ytitle: 'Minor Groove Width (Å)',
								xtitle: 'Time (snapshots)'
							}
						}
					},
					bibiipopulation: {
						title: 'BI / BII Population',
						description: 'BI (B-form) and BII (A-form) refer to different conformations of the sugar ring in the nucleotide backbone.'
					},
					canonicalag: {
						title: 'Canonical Alpha-Gamma',
						description: 'Refers to the torsion angles around the C3\'-O3\' bond in the sugar-phosphate backbone.'
					},
					puckering: {
						title: 'Puckering',
						description: 'Refers to the deformation or distortion of the sugar ring from its ideal planar geometry.'
					}
				},
				plots: {
					timeseries: {
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
										standoff: 200
									}
								},
								yaxis: {
									title: {
										text: ytit,
										standoff: 1000
									}
								},
								margin: {
									l: 50,
									r: 0,
									b: 52,
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
					histogram: {
						data: (ydata) => [{
							y: ydata,
							type: 'histogram',
							yaxis: 'y2',
							marker: { color: '#8d1616' }
						}],
						layout: (xtit) => {
							return {
								title: null,
								xaxis: {
									title: xtit,
									showgrid: false
								},
								yaxis2: {
									tickformat: "f",
									overlaying: 'y',
									side: 'right',
									showgrid: false
								},
								margin: {
									l: 0,
									r: 20,
									b: 52,
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