<template>
  <v-container>

    <h1>RMSd per residue</h1>

    <Breadcrumbs :props="{id: id, text: 'RMSd per residue', title: title}" />

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <div id="header-container">
              <div>
                <v-icon size="small" icon="mdi-chart-areaspline"></v-icon> &nbsp;RMSd PER RESIDUE
              </div>
            </div>
          </template>

          <template v-slot:text>

            <p><strong>RMSd per residue</strong> is a metric used to measure the <strong>average deviation</strong> or difference between the <strong>positions</strong> of corresponding atoms in two structures, typically a <strong>reference</strong> structure and a <strong>target</strong> structure.</p>
            
            
            <v-row class="mt-3"> 
              <v-col lg="8" md="7" sm="12" cols="12">
                <SequenceInteractive 
                  :strands="{ strand1: strand1, strand2: strand2 }" 
                  :hover="true"
                  @dsEnd="handleDsEnd" 
                  @dsStart="handleDsStart" 
                  @dsUpdate="handleDsUpdate" 
                  @nuclMouseOver="handleNuclMouseOver" 
                  @nuclMouseOut="handleNuclMouseOut" 
                />
                <ResiduesPlot :id="id" />
              </v-col>
              <v-col lg="4" md="5" sm="12" cols="12" >
                <TrajectoryViewer :id="id" :height="600" ref="trjViewerRef" />
              </v-col>
            </v-row>


          </template>
        </v-card>
      </v-col>

    </v-row>
    
  </v-container>
</template>

<script setup>

  import useInteractiveSequence from '@/modules/analysis/useInteractiveSequence'

  const { id } = useRoute().params
  const config = useRuntimeConfig()

  const { 
    getSequenceSettings
  } = useInteractiveSequence()

  const datap = await useFetch(`${config.public.apiBase}/projects/${id}`)
  if(datap.status.value === 'error')  throw createError({ statusCode: datap.error.value.statusCode, message: datap.error.value.statusMessage, fatal: true })
  const project = ref(datap.data.value)

  const title = project.value.metadata.NAME

  useHead({
    title: `RMSd per residue for ${title}`
  })

  const sequence = project.value.metadata.SEQUENCES[0]
  const { strand1, strand2 } = getSequenceSettings(sequence)

  const trjViewerRef = ref(null)

  /* HANDLE MAGIC SEQUENCE INTERACTION WITH NGL */

  const selecting = ref(false)

  let selectBP = null
  const handleDsStart = () => {
    selecting.value = true
  }

  const handleDsUpdate = (items) => {
    const residues = items.map((item) => item.id.split('-')[1] )

    if(items.length > 0) {
      trjViewerRef.value.removeRepresentation(selectBP);
      selectBP = trjViewerRef.value.addRepresentation("ball+stick", { sele: residues.join(' '), radius: .2 })
    }
  }

  const handleDsEnd = (items) => {

    if(items.length === 0) trjViewerRef.value.removeRepresentation(selectBP);
    else {
      const residues = items.map((item) => item.id.split('-')[1] )
      trjViewerRef.value.removeRepresentation(selectBP);
      selectBP = trjViewerRef.value.addRepresentation("ball+stick", { sele: residues.join(' '), radius: .2 })
    }

    selecting.value = false
  }

  let hoverBP = null
  const handleNuclMouseOver = (id) => {
    if(!selecting.value) {
      var res = id.split('-')[1];
      hoverBP = trjViewerRef.value.addRepresentation("licorice", { sele: res, radius: .4, opacity: 0.6 })
    }
  }

  const handleNuclMouseOut = (id) => {
    if(!selecting.value) {
      trjViewerRef.value.removeRepresentation(hoverBP)
    }
  }

</script>

<style scoped>

</style>