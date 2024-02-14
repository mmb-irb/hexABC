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
	const { checkMouseSignals } = mouseObserver()

	const { id } = defineProps(['id'])

	const legend = ref(false)
	const legendText = ref('')

	let stage = null
	onMounted(async () => {

		stage = createStage("viewport")
		stage.setParameters({ backgroundColor: '#dedede' });

		const topology = await useFetch(`${config.public.apiBase}/projects/${id}/structure`)
		const blob = new Blob([topology.data.value], { type: "text/plain" });

		stage.loadFile(blob, { defaultRepresentation: false, ext: 'pdb'})
			.then(async function (component) {
				/*component.addRepresentation("cartoon");
				component.addRepresentation("base");*/
				component.addRepresentation("ball+stick", { sele: "nucleic" });
				component.autoView('nucleic');
			})
		
		const updateLegend = (v, s) => {
			legendText.value = v
			legend.value = s
		}

		checkMouseSignals(stage, updateLegend)

		window.addEventListener("resize", () => stage.viewer.handleResize())

	})

	const addRepresentation = (type, props) => {
		console.log(type, props)
		const r = stage.compList[0].addRepresentation( type, props)
		return r
	}

	const removeRepresentation = (r) => {
		//console.log(r)
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
    