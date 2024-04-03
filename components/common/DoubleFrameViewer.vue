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
		<!--<FramePlayer position="b" :trjMeta="trjMeta" :frame="frameToLoad" @updateFrame="handleUpdateFrame" v-if="trjMeta" />-->
	</div>
</template>

<script setup>
	
	const config = useRuntimeConfig()

	import useStage from '@/modules/ngl/useStage'
	import useTrajectories from '@/modules/ngl/useTrajectories'
	import mouseObserver from '@/modules/ngl/mouseObserver'

	const { createStage } = useStage()
	const { 
		loadFrame
    } = useTrajectories()
	const { checkMouseSignalsDouble } = mouseObserver()

	const { id, frame0, frame1, height } = defineProps(['id', 'frame0', 'frame1', 'height'])
	
	const frame0ToLoad = frame0 < 1 ? ref(1) : ref(frame0)
	const frame1ToLoad = frame1 < 1 ? ref(1) : ref(frame1)

	const loading = ref(true)
	const legend = ref(false)
	const legendText = ref('')
	const trjMeta = ref(null)

	let stage = null
	onMounted(async () => {

		if(height) {
			document.getElementById('viewport').style.height = `${height}px`
		}

		stage = createStage("viewport")
		stage.setParameters({ backgroundColor: '#dedede' });

		// get trajectory metadata
		trjMeta.value = await $fetch(`${config.public.externalApi}current/projects/${id}/filenotes/trajectory.bin`)

		// get topology structure
		const topology = await useFetch(`${config.public.apiBase}/projects/${id}/structure`)
		const blob = new Blob([topology.data.value], { type: "text/plain" });

		stage.loadFile(blob, { defaultRepresentation: false, ext: 'pdb', name: 'str0'})
			.then(async function (component) {
				// custom representation
				component.setVisibility(false)
				component.addRepresentation("licorice", { sele: "nucleic", color: '#ccc' });
				component.autoView('nucleic');

				setTimeout(async () => {
					stage.viewer.handleResize()
				}, 50)

				// load frame0
				const numAtoms = trjMeta.value.metadata.atoms
				await loadFrame(`${config.public.externalApi}current/projects/${id}/files/trajectory?frames=${frame0ToLoad.value}`, numAtoms, component)

				//loading.value = false
		}).then(() => {
			stage.loadFile(blob, { defaultRepresentation: false, ext: 'pdb', name: 'str1'})
				.then(async function (component) {
					// custom representation
					component.setVisibility(false)
					component.addRepresentation("licorice", { sele: "nucleic", color: '#f00' });
					component.autoView('nucleic');

					// load frame1
					const numAtoms = trjMeta.value.metadata.atoms
					await loadFrame(`${config.public.externalApi}current/projects/${id}/files/trajectory?frames=${frame1ToLoad.value}`, numAtoms, component)

					loading.value = false
			})
		})

		const updateLegend = (v, s) => {
			//console.log(v, s)
			legendText.value = v
			legend.value = s
		}

		checkMouseSignalsDouble(stage, updateLegend)

		window.addEventListener("resize", () => stage.viewer.handleResize())

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

	/*const handleUpdateFrame	= async (f) => {
		//loading.value = true
		await loadFrame(`${config.public.externalApi}current/projects/${id}/files/trajectory?frames=${f}`, trjMeta.value.metadata.atoms, stage.compList[0])
		//loading.value = false
	}*/

	defineExpose({
		addRepresentation,
		removeRepresentation
	});

</script>

<style>
	span.str0 { color: #999; }
	span.str1 { color: #d00; }
</style>

<style scoped>
	#loader-viewer { position: absolute; top: 0; left: 0; background: #dedede; width: 100%; height: 450px; z-index: 1;}
	#viewport { width: 100%; height: 450px; background-color: #dedede; }
</style>
    