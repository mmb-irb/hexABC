<template>
  <v-container>

    <h1>First frame RMSd</h1>

    <Breadcrumbs :props="{id: id, text: '1st frame RMSd', title: title}" />

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <div id="header-container">
              <div>
                <v-icon size="small" icon="mdi-waveform"></v-icon> &nbsp;FIRST FRAME RMSd
              </div>
              <v-btn prepend-icon="mdi-chart-bell-curve"
                variant="outlined"
                color="red-accent-4"
                :to="`/projects/${id}/average-rmsd`"
                >Average RMSd</v-btn>
            </div>
          </template>

          <template v-slot:text>

            <p><strong>Root Mean Square deviation</strong> (RMSd) referred to the <strong>initial</strong> or <strong>reference</strong> structure, often taken as the starting point in a simulation or the <strong>first structure</strong> in a set.</p>
            
            <RMSdPlot :id="id" type="firstframe" />

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
    title: `First frame RMSd for ${title}`
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