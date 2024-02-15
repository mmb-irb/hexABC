export default function mouseObserver() {

	const checkMouseSignals = (stage, updateFunction) => {

		let status = false
		let text = ''
		stage.signals.hovered.add( function(pickingProxy){ 

			if (pickingProxy && pickingProxy.atom) {
				text = `<strong>${pickingProxy.atom.resno}${pickingProxy.atom.resname.match(/[GTAC]/)[0]}</strong> ${pickingProxy.atom.atomname}`
				status = true
			}

			if (pickingProxy && pickingProxy.bond) {
				text = `<strong>${pickingProxy.bond.atom1.resno}${pickingProxy.bond.atom1.resname.match(/[GTAC]/)[0]}</strong> ${pickingProxy.bond.atom1.atomname}-${pickingProxy.bond.atom2.atomname}`
				status = true
			}

			if (!pickingProxy) {
				text = ''
				status = false
			}

			updateFunction(text, status)

		})

	}

	const checkAtomHover = (stage, updateFunction) => {

		let sele = null
		let label = null
		stage.signals.hovered.add( function(pickingProxy){ 

			if (pickingProxy && pickingProxy.atom) {
				sele = `${pickingProxy.atom.resno}.${pickingProxy.atom.atomname}`
				label = `${pickingProxy.atom.atomname} (${pickingProxy.atom.resno}${pickingProxy.atom.resname.match(/[GTAC]/)[0]})`
			}

			if (!pickingProxy) {
				sele = null
				label = null
			}

			updateFunction(sele, label)

		})

	}

	return {
		checkMouseSignals,
		checkAtomHover
	}

}