<template>
	<div :class="`legend ${props.position}`" v-html="legend"></div>
</template>

<script setup>

	const props = defineProps({
    modelValue: String,
		position: { type: String, default: 'tl' }
  })

	const legend = computed(() => props.modelValue)

</script>

<style>
	.legend {
		position: absolute;
		top: 0;
		right: 0;
		background-color: #ffffffcc;
		padding: 10px;
		z-index: 2;
	}
	.legend.tl { bottom: auto; right: auto; top: 0; left: 0; }
	.legend.tr { bottom: auto; left: auto; top: 0; right: 0; }
	.legend.bl { top: auto; right: auto; bottom: 0; left: 0; }
	.legend.br { top: auto; left: auto; bottom: 0; right: 0; }
</style>
