<template>
    
</template>
  
<script setup>

  // redirecting to /projects/:id/overview
  const { id } = useRoute().params
  await navigateTo('/projects/' + id + '/overview')

</script>

<style scoped>
  
</style>