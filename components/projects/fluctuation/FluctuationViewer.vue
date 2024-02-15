<template>
	<div style="position: relative;">
		<div id="viewport"></div>
		<LegendViewer v-model="legendText" position="tr" v-if="legend" />
	</div>
</template>

<script setup>
	
	const config = useRuntimeConfig()

	import useStage from '@/modules/ngl/useStage'
	import mouseObserver from '@/modules/ngl/mouseObserver'

	const { createStage } = useStage()
	const { checkMouseSignals, checkAtomHover } = mouseObserver()

	const { id } = defineProps(['id'])

	const emit = defineEmits(['hoverViewer']);

	const legend = ref(false)
	const legendText = ref('')

	let stage = null
	let mainR = null
	let atomR = null
	onMounted(async () => {

		stage = createStage("viewport")
		stage.setParameters({ backgroundColor: '#dedede' });

		const topology = await useFetch(`${config.public.apiBase}/projects/${id}/structure`)
		const blob = new Blob([topology.data.value], { type: "text/plain" });

		stage.loadFile(blob, { defaultRepresentation: false, ext: 'pdb'})
			.then(async function (component) {
				mainR = component.addRepresentation("ball+stick", { sele: "nucleic", radius:.1 });
				component.autoView('nucleic');
			})
		
		const updateLegend = (v, s) => {
			legendText.value = v
			legend.value = s
		}

		const atomHover = (sele, label) => {
			stage.compList[0].removeRepresentation(atomR)
			if(sele) atomR = stage.compList[0].addRepresentation("spacefill", { sele, opacity: .5 })
			emit('hoverViewer', label);
		}

		checkMouseSignals(stage, updateLegend)
		checkAtomHover(stage, atomHover)

		window.addEventListener("resize", () => stage.viewer.handleResize())

	})

	const addRepresentation = (type, props) => {
		mainR = stage.compList[0].addRepresentation("licorice", { sele: "nucleic", radius:.1, color: '#cccccc' });
		const r = stage.compList[0].addRepresentation( type, props)
		return r
	}

	const initRepresentation = () => {
		mainR = stage.compList[0].addRepresentation("ball+stick", { sele: "nucleic", radius:.1 });
	}

	const autoview = (sele, duration) => {
		stage.compList[0].autoView(sele, duration)
	}

	const removeRepresentation = (r) => {
		stage.compList[0].removeRepresentation(mainR)
		stage.compList[0].removeRepresentation(r)
	}

	defineExpose({
		addRepresentation,
		initRepresentation,
		autoview,
		removeRepresentation,
	});

</script>

<style scoped>
	#viewport { width: 100%; height: 470px; }
</style>
    