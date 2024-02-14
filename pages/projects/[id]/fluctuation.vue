<template>
  <v-container>

    <h1>Fluctuation</h1>

    <Breadcrumbs :props="{id: id, text: 'Fluctuation', title: title}" />

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <div id="header-container">
              <div>
                <v-icon size="small" icon="mdi-sine-wave"></v-icon> &nbsp;FLUCTUATION
              </div>
            </div>
          </template>

          <template v-slot:text>

            <p>Molecular Dynamics atomic fluctuation.</p>

            <FluctuationTable ref="flcTableRef" />
            
            <v-row class="mt-3"> 
              <v-col lg="8" md="7" sm="12" cols="12">
                <FluctuationPlot :id="id" @updateTable="handleUpdateTable" @hoverPlot="handleHoverPlot" />
              </v-col>
              <v-col lg="4" md="5" sm="12" cols="12" >
                <FluctuationViewer :id="id" ref="flcViewerRef" />
              </v-col>
            </v-row>

          </template>
        </v-card>
      </v-col>

    </v-row>
    
  </v-container>
</template>

<script setup>

  const { id } = useRoute().params

  const config = useRuntimeConfig()
  const { $sleep } = useNuxtApp()

  const datap = await useFetch(`${config.public.apiBase}/projects/${id}`)
  if(datap.status.value === 'error')  throw createError({ statusCode: datap.error.value.statusCode, message: datap.error.value.statusMessage, fatal: true })
  const project = ref(datap.data.value)

  const title = project.value.metadata.NAME

  useHead({
    title: `Fluctuation for ${title}`
  })

  const flcTableRef = ref(null)
  const flcViewerRef = ref(null) 

  const handleUpdateTable = async (mean, stdev) => {
    await $sleep(10)
    flcTableRef.value.updateData(mean, stdev)
  }

  const atomR = ref(null)
  const handleHoverPlot = (atom) => {
    //console.log(atom)
    // NOT WORKING
    flcViewerRef.value.removeRepresentation(atomR.value)
    // TODO: ADD NUCLEOTIDE FOR HOVERED ATOM
    if(atom)
      atomR.value = flcViewerRef.value.addRepresentation("spacefill", { sele: `.${atom}` })
    //else
      //flcViewerRef.value.removeRepresentation(atomR.value)
  }

</script>

<style>
  #tbl-fluct .v-table__wrapper table { table-layout: fixed; } 
</style>

<style scoped>

</style>