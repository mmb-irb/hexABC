<template>
  <div style="width:100%; height:400px; background-color:#ccc;">
      <h2>{{ id }}</h2>

      STACKED HISTOGRAM PLOT<br>
      https://plotly.com/javascript/histograms/#stacked-histograms


  </div>
</template>

<script setup>
  const { id } = defineProps(['id'])
  console.log(id) 
</script>

<style scoped>

</style>
  