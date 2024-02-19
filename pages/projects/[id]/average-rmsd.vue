<template>
  <v-container>

    <h1>RMSd against average structure</h1>

    <Breadcrumbs :props="{id: id, text: 'Average RMSd', title: title}" />

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <div id="header-container">
              <div>
                <v-icon size="small" icon="mdi-chart-bell-curve"></v-icon> &nbsp;RMSD AGAINST AVERAGE
              </div>
              <v-btn prepend-icon="mdi-waveform"
                variant="outlined"
                color="red-accent-4"
                :to="`/projects/${id}/first-rmsd`"
                >RMSd against First frame </v-btn>
            </div>
          </template>

          <template v-slot:text>

            <p><strong>Root Mean Square deviation</strong> (RMSd) average.</p>
            
            <RMSdPlot :id="id" type="average" />

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
    title: `RMSd against average structure ${title}`
  })

</script>

<style scoped>
  #header-container {
    display: flex; 
    justify-content: space-between;
  }

  @media only screen and (max-width: 600px) {
    #header-container {
      flex-direction: column;
    }
    #header-container .v-btn {  margin-top: 1rem; }
  }
</style>