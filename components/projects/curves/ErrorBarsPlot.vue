<template>
  <div style="width:100%; height:400px; background-color:#ccc; display:flex; justify-content: center; align-items: center;">

    <v-progress-circular
      :size="70"
      :width="7"
      color="red-darken-4"
      indeterminate
      v-if="loading"
    ></v-progress-circular>

    <div v-else>
      <h2>{{ id }}</h2>

      ERROR BARS PLOT<br>
      https://plotly.com/javascript/error-bars/#basic-symmetric-error-bars (multiple data if needed)
    </div>

    </div>
</template>

<script setup>
  const { id } = defineProps(['id'])
  
  const loading = ref(true)

  setTimeout(() => {
    loading.value = false
  }, 1000);

</script>

<style scoped>

</style>
  