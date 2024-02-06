export default defineNuxtPlugin(() => {
	return {
		provide: {
			curves: {
				type: ['Nucleotide', 'Base step', 'Base pair', 'Base pair step', 'Tetramer', 'Hexamer'],
				rise: {
					title: 'Rise',
					description: 'The vertical distance between consecutive base pairs along the helical axis. It represents the distance the helix moves upwards along its axis with each base pair.'
				},
				roll: {
					title: 'Roll',
					description: 'The angle between the base pair plane and a reference plane perpendicular to the helical axis. It describes the rotational displacement of one base pair with respect to the next.'
				},
				shift: {
					title: 'Shift',
					description: 'The horizontal displacement of one base pair relative to the next along the helical axis. It represents the sideways movement of one base pair along the helical axis.'
				},
				slide: {
					title: 'Slide',
					description: 'The lateral displacement of one base pair relative to the next along the helical axis. It represents the shift of one base pair perpendicular to the helical axis.'
				},
				tilt: {
					title: 'Tilt',
					description: 'The angle between the helical axis and the base pair plane. It indicates the inclination of the base pairs with respect to the helical axis.'
				},
				twist: {
					title: 'Twist',
					description: 'The rotation angle between consecutive base pairs along the helical axis. It is usually measured in degrees.'
				},
				alpha: {
					title: 'Alpha (α) Torsions',
					description: 'The angle formed by the C1\'-N9 bond in a purine or C1\'-N1 bond in a pyrimidine, measured from the C1\' atom towards the N base atom.'
				},
				beta: {
					title: 'Beta (β) Torsions',
					description: 'The angle formed by the N9-C1\'-N1 atoms in a purine or N1-C1\'-N3 atoms in a pyrimidine, measured from the N9 or N1 atom towards the C1\' atom.'
				},
				gamma: {
					title: 'Gamma (γ) Torsions',
					description: 'The angle formed by the C1\'-N1 or C1\'-N3 bonds in a purine or pyrimidine, measured from the C1\' atom towards the N base atom.'
				},
				delta: {
					title: 'Delta (δ) Torsions',
					description: 'The angle formed by the N1-C1\'-N3 atoms in a purine or N3-C1\'-N1 atoms in a pyrimidine, measured from the N1 or N3 atom towards the C1\' atom.'
				},
				chi: {
					title: 'Chi (χ) Torsions',
					description: 'The dihedral angle involving the N1-C1\'-N9-C4 atoms in a purine or N1-C1\'-N1-C2 atoms in a pyrimidine.'
				},
				epsilon: {
					title: 'Epsilon (ε) Torsions',
					description: 'The dihedral angle involving the C4-C1\'-N1-C2 atoms in a pyrimidine.'
				},
				theta: {
					title: 'Theta (θ) Torsions',
					description: 'The dihedral angle involving the C2-C1\'-N1-C2 atoms in a pyrimidine.'
				},
				inclination: {
					title: 'Inclination',
					description: 'Tilt or slant of the entire DNA helix with respect to a reference axis, often the helical axis.'
				},
				tip: {
					title: 'Tip',
					description: 'Rotation or twist of the DNA helix at its end.'
				},
				xdisp: {
					title: 'X-Displacement',
					description: 'The horizontal or lateral displacement of one base pair relative to the next along the helical axis.'
				},
				ydisp: {
					title: 'Y-Displacement',
					description: 'The vertical displacement of one base pair relative to the next along the helical axis.'
				},
				shear: {
					title: 'Shear',
					description: 'Refers to the lateral displacement between consecutive base pairs along the helical axis.'
				},
				stretch: {
					title: 'Stretch',
					description: 'Represents the extension or compression of the distance between base pairs along the helical axis.'
				},
				stagger: {
					title: 'Stagger',
					description: 'It is the vertical displacement between consecutive base pairs along the helical axis.'
				},
				buckle: {
					title: 'Buckle',
					description: 'Measures the bending or bending-unbending deformation of the base pair step.'
				},
				propeller: {
					title: 'Propeller',
					description: 'Refers to the rotation of one base pair with respect to the next base pair in the same strand.'
				},
				opening: {
					title: 'Opening',
					description: 'Represents the separation or angular displacement between the planes of two adjacent base pairs.'
				},
				majorgd: {
					title: 'Major Groove Depth',
					description: 'Refers to the distance between the two strands of the DNA double helix measured from the outer edge of one strand to the outer edge of the opposite strand within the major groove.'
				},
				majorgw: {
					title: 'Major Groove Width',
					description: 'Refers to the separation between the two strands of the DNA double helix within the major groove.'
				},
				minorgd: {
					title: 'Minor Groove Depth',
					description: 'Refers to the distance between the two strands of the DNA double helix measured from the outer edge of one strand to the outer edge of the opposite strand within the minor groove.'
				},
				minorgw: {
					title: 'Minor Groove Width',
					description: 'Refers to the separation between the two strands of the DNA double helix within the minor groove.'
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
				},
			}
		}
	}
})