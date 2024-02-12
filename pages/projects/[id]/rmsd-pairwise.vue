<template>
  <v-container>

    <h1>RMSd pairwise</h1>

    <Breadcrumbs :props="{id: id, text: 'RMSd pairwise', title: title}" />

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <div id="header-container">
              <div>
                <v-icon size="small" icon="mdi-data-matrix"></v-icon> &nbsp;RMSd PAIRWISE
              </div>
            </div>
          </template>

          <template v-slot:text>

            <p><strong>Pairwise RMSd</strong> (Root Mean Square deviation) is a measure used to compare the <strong>structural similarity</strong> between <strong>pairs of structures</strong> in a set.</p>
            
            <PairwisePlot :id="id" />

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
    title: `RMSd pairwise for ${title}`
  })

</script>

<style scoped>

</style>