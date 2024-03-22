<template>
	<div style="position: relative;">
		<div id="viewport"></div>
		<LegendViewer v-model="legendText" position="tr" v-if="legend" />
		<TrajectoryPlayer position="b" :trjMeta="trjMeta" :step="step" v-if="trjMeta" />
	</div>
</template>

<script setup>
	
	const config = useRuntimeConfig()

	import useStage from '@/modules/ngl/useStage'
	import useTrajectories from '@/modules/ngl/useTrajectories'
	import mouseObserver from '@/modules/ngl/mouseObserver'

	const { $globals } = useNuxtApp()

	const { createStage } = useStage()
	const { 
		loadTrajectory,
		initLoadingTrajectory,
		stopLoadingTrajectory
    } = useTrajectories()
	const { checkMouseSignals } = mouseObserver()

	const { id, height } = defineProps(['id', 'height'])

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
		trjMeta.value = await $fetch(`${config.public.externalApi}current/projects/${id}/filenotes/trajectory.bin`)

		// get topology structure
		const topology = await useFetch(`${config.public.apiBase}/projects/${id}/structure`)
		const blob = new Blob([topology.data.value], { type: "text/plain" });

		stage.loadFile(blob, { defaultRepresentation: false, ext: 'pdb'})
			.then(async function (component) {
				// custom representation
				component.setVisibility(false)
				component.addRepresentation("licorice", { sele: "nucleic", color: '#ccc' });
				component.autoView('nucleic');
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

	const addRepresentation = (type, props) => {
		if(!stage.compList[0]) return
		const r = stage.compList[0].addRepresentation( type, props)
		return r
	}

	const removeRepresentation = (r) => {
		if(!stage.compList[0]) return
		stage.compList[0].removeRepresentation(r)
	}

	defineExpose({
		addRepresentation,
		removeRepresentation
	});

</script>

<style scoped>
	#viewport { width: 100%; height: 400px; }
</style>
    