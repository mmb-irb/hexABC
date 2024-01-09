<template>
  <div style="width:100%; height:400px; background-color:#ccc;">
      <h2>{{ id }}</h2>

      ERROR BARS PLOT<br>
      https://plotly.com/javascript/error-bars/#basic-symmetric-error-bars (multiple data if needed)


  </div>
</template>

<script setup>
  const { id } = defineProps(['id'])
  console.log(id) 
</script>

<style scoped>

</style>
  