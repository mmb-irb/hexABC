<template>
  <v-container>

    <h1>Results</h1>

    <Breadcrumbs :props="{section:'Results'}" />

    <BannerRESTError v-if="bannerApiError" /> 

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <v-icon size="small" icon="mdi-account-group"></v-icon> &nbsp;RESULTS
          </template>

          <template v-slot:text>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita veritatis, quod corporis explicabo fugiat voluptate, tempore molestiae aperiam consequuntur reprehenderit, maiores in porro corrupti qui quo commodi blanditiis laboriosam eligendi?</p>
          
            <ArlequinPlot />

          </template>
        </v-card>
      </v-col>

    </v-row>

  </v-container>
      
</template>
  
<script setup>

  import structureSettings from '@/modules/structure/structureSettings'

  const { getProperty } = structureSettings()

  const bannerApiError = ref(getProperty('bannerApiError'))

  useHead({
    title: 'Results' 
  })

</script>

<style scoped>

</style>