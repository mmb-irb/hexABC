<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon icon="mdi-circle-small"></v-icon>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script setup>

  const { props } = defineProps(['props'])

  const { $breadcrumbs } = useNuxtApp()
  const routePath = useRoute().fullPath.split('/').slice(1)
  let breadcrumbs

  switch (routePath.length) {
    case 1: breadcrumbs =  $breadcrumbs['first-level'](props.section); 
            break;
    case 2: 
      if(routePath[0] === 'search') {
        breadcrumbs = $breadcrumbs.search(props.section)
      }
      break;
    case 3: 
      if(routePath[0] === 'projects' && routePath[2] !== 'overview') {
        breadcrumbs = $breadcrumbs.analysis(props.id, props.text, props.title)
      }
      if(routePath[0] === 'projects' && routePath[2] === 'overview') {
        breadcrumbs = $breadcrumbs.overview(props.title)
      }
      break;

  }

</script>

<style scoped>
  
</style>
