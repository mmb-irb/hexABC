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
		<FramePlayer position="b" :trjMeta="trjMeta" :frame="frameToLoad" @updateFrame="handleUpdateFrame" v-if="trjMeta" />
	</div>
</template>

<script setup>
	
	const config = useRuntimeConfig()

	import common from '@/modules/common'
	import useStage from '@/modules/ngl/useStage'
	import useTrajectories from '@/modules/ngl/useTrajectories'
	import mouseObserver from '@/modules/ngl/mouseObserver'

	const { calculateDistances } = common()
	const { createStage } = useStage()
	const { 
		loadFrame
    } = useTrajectories()
	const { checkMouseSignals } = mouseObserver()

	const { id, frame, height } = defineProps(['id', 'frame', 'height'])
	
	const frameToLoad = frame < 1 ? ref(1) : ref(frame)

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

		stage.loadFile(blob, { defaultRepresentation: false, ext: 'pdb'})
			.then(async function (component) {
				// custom representation
				component.setVisibility(false)
				component.addRepresentation("licorice", { sele: "nucleic", color: '#ccc' });
				component.autoView('nucleic');

				setTimeout(async () => {
					stage.viewer.handleResize()
				}, 50)

				// load frame
				const numAtoms = trjMeta.value.metadata.atoms
				await loadFrame(`${config.public.externalApi}current/projects/${id}/files/trajectory?frames=${frameToLoad.value}`, numAtoms, component)

				loading.value = false
			})
		
		const updateLegend = (v, s) => {
			legendText.value = v
			legend.value = s
		}

		checkMouseSignals(stage, updateLegend)

		window.addEventListener("resize", () => stage.viewer.handleResize())

	})

	const addRepresentation = (type, props, av = false) => {
		if(!stage.compList[0]) return
		const r = stage.compList[0].addRepresentation( type, props)
		if(av) stage.compList[0].autoView(props.sele, 500);
		return r
	}

	const drawDistances = (dists, color, label) => {
		dists.forEach(async (item) => {
			stage.compList[0].addRepresentation("distance", { atomPair: [[item.a1, item.a2]], /*labelSize: label ? 2 : 0*/ labelSize: 2, labelColor: '#fff', labelBorder: true, labelBorderColor: '#555', labelBorderWidth: .5, color: color });
		});
		//console.log(stage.compList[0])
	}

	const addDistancesHBonds = (nucs, bonds) => {
		if(!stage.compList[0]) return
		const distances = calculateDistances(stage.compList[0], nucs)
		console.log(distances)

		switch(bonds) {
			/*case 0:
				//console.log(bonds);
				drawDistances(distances, "#f00", false);
				break;*/
			case 1:
			case 2:
				//console.log(bonds);
				distances.sort((a, b) => a.d - b.d);
				var hbs = distances.slice(0, bonds);
				drawDistances(hbs, "#fff", true);
				//var nhbs = distances.slice(bonds, 3);
				//drawDistances(nhbs, "#f00", false);
				break;
			case 3:
				//console.log(bonds);
				drawDistances(distances, "#fff", true);
				break;
		}
	}

	const removeRepresentation = (r) => {
		if(!stage.compList[0]) return
		stage.compList[0].removeRepresentation(r)
	}

	const handleUpdateFrame	= async (f) => {
		//loading.value = true
		await loadFrame(`${config.public.externalApi}current/projects/${id}/files/trajectory?frames=${f}`, trjMeta.value.metadata.atoms, stage.compList[0])

		// TODO!!! REDRAW DISTANCES!!!!! NOT SURE HOW TO DO IT (HOW TO GET THE CORRESPONDING HBONDS FOR THE NEW FRAME, MAYBE ASK DANI NEW ENDOPOINT FOR THAT)
		//loading.value = false
	}

	defineExpose({
		addRepresentation,
		addDistancesHBonds,
		removeRepresentation
	});

</script>

<style scoped>
	#loader-viewer { position: absolute; top: 0; left: 0; background: #dedede; width: 100%; height: 450px; z-index: 1;}
	#viewport { width: 100%; height: 450px; background-color: #dedede; }
</style>
    