<template>
  <v-container>

    <h1>Principal Component Analysis</h1>

    <Breadcrumbs :props="{id: id, text: 'PCA', title: title}" />

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <div id="header-container">
              <div>
                <v-icon size="small" icon="mdi-chart-bar"></v-icon> &nbsp;PCA
              </div>
            </div>
          </template>

          <template v-slot:text>

            <p><strong>Principal Component Analysis</strong> (PCA) is a <strong>dimensionality reduction</strong> technique used in machine learning and statistics. It is commonly applied to high-dimensional datasets to <strong>identify patterns</strong>, <strong>reduce noise</strong>, and facilitate <strong>data analysis</strong>. PCA transforms the <strong>original features</strong> into a new set of <strong>orthogonal features</strong>, called <strong>principal components</strong>, which capture the maximum variance in the data. <strong>Click</strong> on each Principal Component on the <strong>plot</strong> below to see in a a <strong>3D structure visualizer</strong>.</p>

            <PCAEVPlot :id="id" />

            <PCAProjectionsPlot :id="id" />

          </template>
        </v-card>
      </v-col>

    </v-row>
    
  </v-container>
</template>

<script setup>

  const { id } = useRoute().params
  const config = useRuntimeConfig()

  const datap = await useFetch(`${config.public.apiBase}/projects/${id}`)
  if(datap.status.value === 'error')  throw createError({ statusCode: datap.error.value.statusCode, message: datap.error.value.statusMessage, fatal: true })
  const project = ref(datap.data.value)

  const title = project.value.metadata.NAME

  useHead({
    title: `PCA for ${title}`
  })

</script>

<style scoped>

</style>