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

  import structureSettings from '@/modules/structure/structureSettings'
  
  const { props } = defineProps(['props'])
  const { $breadcrumbs } = useNuxtApp()

  const { 
    getProperty
  } = structureSettings()

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
        var cms = getProperty('currMenuSection') ? getProperty('currMenuSection') : ['projects', 'browse']
        var pth = `/${cms.join('/')}`
        var section = cms[1].charAt(0).toUpperCase() + cms[1].slice(1)
        breadcrumbs = $breadcrumbs.analysis(section, pth, props.id, props.text, props.title)
      }
      if(routePath[0] === 'projects' && routePath[2] === 'overview') {
        var cms = getProperty('currMenuSection') ? getProperty('currMenuSection') : ['projects', 'browse']
        var pth = `/${cms.join('/')}`
        var section = cms[1].charAt(0).toUpperCase() + cms[1].slice(1)
        breadcrumbs = $breadcrumbs.overview(section, pth, props.title)
      }
      break;

  }

</script>

<style scoped>
  
</style>
