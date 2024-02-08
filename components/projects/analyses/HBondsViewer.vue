<template>
	<div style="position:relative">
		<div id="loader-viewer" class="d-flex justify-center align-center" v-if="loading">
			<v-progress-circular
				:width="5"
				:size="80"
				color="red"
				indeterminate
			></v-progress-circular>
		</div>
		<div id="viewport"></div>
		<!-- TODO LEGEND!!!! -->
	</div>
</template>
  
<script setup>
	
	const config = useRuntimeConfig()

	import useStage from '@/modules/ngl/useStage'

	const { createStage } = useStage()

	const { id } = defineProps(['id'])

	const loading = ref(true)
	let stage = null
	onMounted(async () => {

		stage = createStage("viewport", true)
		stage.setParameters({ backgroundColor: '#dedede' });

		const topology = await useFetch(`${config.public.apiBase}/projects/${id}/topology`)
		const blob = new Blob([topology.data.value], { type: "text/plain" });

		stage.loadFile(blob, { defaultRepresentation: false, ext: 'pdb'})
			.then(async function (component) {
				/*component.addRepresentation("cartoon");
				component.addRepresentation("base");*/
				component.addRepresentation("licorice", { sele: "nucleic", color: '#ccc' });
				component.autoView('nucleic');

				setTimeout(async () => {
					stage.viewer.handleResize()
					loading.value = false
				}, 50)
			})

		window.addEventListener("resize", () => stage.viewer.handleResize())

	})

	const addRepresentationHBonds = (sele) => {
		// TO MODIFY FOR REPRESENTING THE HBONDS VIA DISTANCES!!!
		const r = stage.compList[0].addRepresentation( "ball+stick", { sele: sele, radius: .2 })
		stage.compList[0].autoView(sele, 500);
		return r
	}

	defineExpose({
		addRepresentationHBonds
	});

</script>

<style scoped>
	#loader-viewer { position: absolute; top: 0; left: 0; background: #dedede; width: 100%; height: 450px; z-index: 1;}
	#viewport { width: 100%; height: 450px; background-color: #dedede; }
</style>
  