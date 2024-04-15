<template>
	<div style="position: relative;">
		<div id="loader-viewer" class="d-flex justify-center align-center" v-if="loading">
			<v-progress-circular
				:width="5"
				:size="80"
				color="red"
				indeterminate
			></v-progress-circular>
		</div>
		<div id="viewport"></div>
		<LegendViewer v-model="legendText" position="tr" v-if="legend" />
		<TrajectoryPlayer position="b" :trjMeta="trjMeta" :step="step" :loop="false" v-if="trjMeta" />
	</div>
</template>

<script setup>
	
	const config = useRuntimeConfig()

	import common from '@/modules/common'
	import useStage from '@/modules/ngl/useStage'
	import useTrajectories from '@/modules/ngl/useTrajectories'
	import mouseObserver from '@/modules/ngl/mouseObserver'

	const { $globals } = useNuxtApp()

	const { findClosestAtom } = common()
	const { createStage, createSelection } = useStage()
	const { 
		loadTrajectory,
		initLoadingTrajectory,
		stopLoadingTrajectory
  } = useTrajectories()
	const { checkMouseSignals } = mouseObserver()

	const { id, height } = defineProps(['id', 'height'])

	const loading = ref(true)
	const legend = ref(false)
	const legendText = ref('')
	const trjMeta = ref(null)
	let step = $globals.trajectories.defaultStep

	let stage = null
	onMounted(async () => {

		if(height) {
			document.getElementById('viewport').style.height = `${height}px`
		}

		initLoadingTrajectory()

		stage = createStage("viewport")
		stage.setParameters({ backgroundColor: '#dedede' });

		// get trajectory metadata
		trjMeta.value = await $fetch(`${config.public.apiBase}/projects/${id}/filenotes/trajectory.bin`)

		// get topology structure
		const topology = await useFetch(`${config.public.apiBase}/projects/${id}/structure`)
		const blob = new Blob([topology.data.value], { type: "text/plain" });

		stage.loadFile(blob, { defaultRepresentation: false, ext: 'pdb'})
			.then(async function (component) {
				// custom representation
				component.setVisibility(false)
				component.addRepresentation("licorice", { sele: "nucleic", color: '#ccc' });
				component.autoView('nucleic');

				setTimeout(async () => {
					stage.viewer.handleResize()
					loading.value = false
				}, 50)

				// load trajectory
				const numAtoms = trjMeta.value.metadata.atoms
				const numFrames = Math.ceil(trjMeta.value.metadata.frames / step)
				const totalFrames = trjMeta.value.metadata.frames
				await loadTrajectory(`${config.public.externalApi}current/projects/${id}/files/trajectory?frames=1:${totalFrames}:${step}`, numAtoms, numFrames, component)
			})
		
		const updateLegend = (v, s) => {
			legendText.value = v
			legend.value = s
		}

		checkMouseSignals(stage, updateLegend)

		window.addEventListener("resize", () => stage.viewer.handleResize())

	})

	onBeforeUnmount (() => {
		stopLoadingTrajectory()
  })

	// standard representation
	const addRepresentation = (type, props, av = false) => {
		if(!stage.compList[0]) return
		const r = stage.compList[0].addRepresentation( type, props)
		if(av) stage.compList[0].autoView(props.sele, 500);
		return r
	}

	// distance per residue representation
	const addRepresentationDistRes = (sele, residues) => {
		if(!stage.compList[0]) return

    // add representations
		const r = stage.compList[0].addRepresentation( "ball+stick", { sele: sele, radius: .2 })
    stage.compList[0].addRepresentation( "surface", { sele: sele, surfaceType: 'ms', side: 'front', color: 'white', opacity: 0.3 })
		stage.compList[0].autoView(sele, 500);

    // get residues center
    const start = stage.compList[0].structure.getView(createSelection(residues[0])).center
    const end = stage.compList[0].structure.getView(createSelection(residues[1])).center

    // find "center" atoms for each residue
    var closestAtom1 = findClosestAtom(stage.compList[0], start);
    var closestAtom2 = findClosestAtom(stage.compList[0], end);

    // add distance representation
    stage.compList[0].addRepresentation("distance", {
      atomPair: [[closestAtom1, closestAtom2]],
      labelSize: 0,
      color: "#8d1616"
    });

    // other way: create shape from residue to residue
    /*const shape = createShape()
    shape.addCylinder(start, end, [.8,0,0], 0.2)
    console.log(shape)

    const shapeComp = stage.addComponentFromObject( shape );
    shapeComp.addRepresentation( "buffer" );*/

		return r
	}

	const removeRepresentation = (r) => {
		if(!stage.compList[0]) return
		stage.compList[0].removeRepresentation(r)
	}

	defineExpose({
		addRepresentation,
		addRepresentationDistRes,
		removeRepresentation
	});

</script>

<style scoped>
	#loader-viewer { position: absolute; top: 0; left: 0; background: #dedede; width: 100%; height: 450px; z-index: 1;}
	#viewport { width: 100%; height: 400px; background-color: #dedede; }
</style>
    