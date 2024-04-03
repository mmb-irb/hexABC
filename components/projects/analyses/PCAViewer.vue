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
		<TrajectoryPlayer position="b" :trjMeta="trjMeta" :step="step" :loop="true" v-if="trjMeta" />
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

	const { id, height, selPCA } = defineProps(['id', 'height', 'selPCA'])
	const pca = ref(selPCA.padStart(2, '0'))

	const loading = ref(true)
	const legend = ref(false)
	const legendText = ref('')
	const trjMeta = ref(null)
	let step = $globals.trajectories.pcaStep

	let stage = null
	onMounted(async () => {

		if(height) {
			document.getElementById('viewport').style.height = `${height}px`
		}

		initLoadingTrajectory()

		stage = createStage("viewport")
		stage.setParameters({ backgroundColor: '#dedede' });

		// get trajectory metadata
		trjMeta.value = await $fetch(`${config.public.externalApi}current/projects/${id}/filenotes/pca_trajectory_${pca.value}.bin`)

		// get topology structure
		const topology = await useFetch(`${config.public.apiBase}/projects/${id}/structure`)
		const blob = new Blob([topology.data.value], { type: "text/plain" });

		stage.loadFile(blob, { defaultRepresentation: false, ext: 'pdb'})
			.then(async function (component) {
				// custom representation
				component.setVisibility(false)
				component.addRepresentation("spacefill", { sele: "*", colorScheme: 'chainid' });
				component.autoView('nucleic');

				setTimeout(async () => {
					stage.viewer.handleResize()
					loading.value = false
				}, 50)

				// load trajectory
				const numAtoms = trjMeta.value.metadata.atoms
				const numFrames = Math.ceil(trjMeta.value.metadata.frames / step)
				const totalFrames = trjMeta.value.metadata.frames
				const params = { loop: true, bounce: true }
				await loadTrajectory(`${config.public.externalApi}current/projects/${id}/files/pca_trajectory_${pca.value}.bin?frames=1:${totalFrames}:${step}`, numAtoms, numFrames, component, params)
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

	const addRepresentation = (type, props, av = false) => {
		if(!stage.compList[0]) return
		const r = stage.compList[0].addRepresentation( type, props)
		if(av) stage.compList[0].autoView(props.sele, 500);
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
	#loader-viewer { position: absolute; top: 0; left: 0; background: #dedede; width: 100%; height: 450px; z-index: 1;}
	#viewport { width: 100%; height: 400px; background-color: #dedede; }
</style>
    