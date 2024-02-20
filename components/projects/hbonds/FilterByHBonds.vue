<template>
  <p style="font-size: .8rem;">Select base pairs by number of hbonds predominance:</p>

	<div v-bind:class="{ 'd-flex': display.sm }">
		<v-btn-toggle
			v-model="hbondsSel"
			rounded="0"
			group
			divided
			@update:modelValue="filterByHbonds"
			variant="outlined"
		>
			<v-btn icon="mdi-numeric-0-circle" color="black" class="btn-filter-bonds"></v-btn>
			<v-btn icon="mdi-numeric-1-circle" color="light-blue-darken-4" class="btn-filter-bonds"></v-btn>
			<v-btn icon="mdi-numeric-2-circle" color="green-darken-2" class="btn-filter-bonds"></v-btn>
			<v-btn icon="mdi-numeric-3-circle" color="amber-lighten-1" class="btn-filter-bonds"></v-btn>
		</v-btn-toggle>
		<v-slider
			v-model="sliderHbonds"
			class="align-center mt-3"
			:min="0"
			:max="1"
			:step="0.01"
			@end="filterByHbonds"
			color="blue-grey-lighten-1"
			hide-details
		>
			<template v-slot:append>
				<span id="hbonds-percent">{{ sliderHbonds.toFixed(2) }}</span>
			</template>
		</v-slider>
	</div>
</template>

<script setup>
	
	import { useDisplay } from 'vuetify'

	const display = ref(useDisplay())
	const emit = defineEmits(['fltrBHbs']);

	const hbondsSel = ref(null);
	const sliderHbonds = ref(0.2);

	const filterByHbonds = () => {
		emit('fltrBHbs')
	}

	defineExpose({
		hbondsSel,
		sliderHbonds
	});

</script>

<style>
  @media only screen and (max-width: 1280px) {
    .btn-filter-bonds.v-btn--icon.v-btn--density-default { width: 44px;}
  }
</style>

<style scoped>
	#hbonds-percent { font-weight: 600; font-size: .9rem;}
</style>
	