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
				}
			}
		}
	}
})