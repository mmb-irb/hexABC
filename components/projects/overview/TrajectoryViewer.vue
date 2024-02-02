<template>
  <div id="viewport"></div>
</template>

<script setup>
	
	const config = useRuntimeConfig()

	import useStage from '@/modules/ngl/useStage'

	const { createStage } = useStage()

	const { id } = defineProps(['id'])

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
			})

		window.addEventListener("resize", () => stage.viewer.handleResize())

	})

	const addRepresentation = (type, props) => {
		const r = stage.compList[0].addRepresentation( type, props)
		return r
	}

	const removeRepresentation = (r) => {
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
    