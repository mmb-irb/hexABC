<template>
  <v-container>

    <h1>Solvent Accessible Surface Area</h1>

    <Breadcrumbs :props="{id: id, text: 'SASA', title: title}" />

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <div id="header-container">
              <div>
                <v-icon size="small" icon="mdi-peanut-outline mdi-rotate-90"></v-icon> &nbsp;SASA
              </div>
            </div>
          </template>

          <template v-slot:text>

            <p><strong>Solvent Accessible Surface Area</strong> (SASA) is a used to <strong>quantify the surface area</strong> of a biomolecule (such as a nucleic acid) that is accessible to <strong>solvent molecules</strong>. SASA provides information about the <strong>exposure</strong> of a molecule to its <strong>surrounding environment</strong>, particularly <strong>water molecules</strong>.</p>
            
            <p>Using the below <strong>interactive sequence</strong>, users can select the desired <strong>nucleotides</strong> (single or grouped) in order to <strong>view</strong> them in the <strong>3D visualization</strong> at right. Selection can be performed either <strong>clicking and dragging</strong> over a <strong>group of nucleotides</strong> or <strong>clicking</strong> them individually while <strong>pressing shift / ⇧</strong> key at the same time for <strong>multiple selection</strong>.</p>

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
                <SASAPlot :id="id" ref="sasaPlotRef" />
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
  import common from '@/modules/common'

  const { id } = useRoute().params
  const config = useRuntimeConfig()
  const { $sleep } = useNuxtApp()

  const { 
    getSequenceSettings
  } = useInteractiveSequence()
  const { interpolateColor } = common()

  const datap = await useFetch(`${config.public.apiBase}/projects/${id}`)
  if(datap.status.value === 'error')  throw createError({ statusCode: datap.error.value.statusCode, message: datap.error.value.statusMessage, fatal: true })
  const project = ref(datap.data.value)

  const title = project.value.metadata.NAME

  useHead({
    title: `SASA for ${title}`
  })

  const sequence = project.value.metadata.SEQUENCES[0]
  const { strand1, strand2 } = getSequenceSettings(sequence)

  const trjViewerRef = ref(null)
  const sasaPlotRef = ref(null)

  onMounted(async () => {
    
    // color structure by average SASA
    let averages
    const dataAn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/sasa`)
    if(dataAn.status.value === 'error')  throw createError({ statusCode: dataAn.error.value.statusCode, message: dataAn.error.value.statusMessage, fatal: true })
    averages = dataAn.data.value.means
    
    // Find the minimum and maximum values in the array
    const minValue = Math.min(...averages);
    const maxValue = Math.max(...averages);

    // Map each value to its corresponding color
    const colorValues = averages.map(value => interpolateColor(value, minValue, maxValue));

    await $sleep(50)
    // add new representation for each nucleotide
    colorValues.forEach(async (color, index) => {
      try {
        trjViewerRef.value.addRepresentation("licorice", { sele: `${(index + 1)}`, color: color })
      } catch (error) {
        //console.log('Error adding representation:', error)
        await $sleep(500)
        trjViewerRef.value.addRepresentation("licorice", { sele: `${(index + 1)}`, color: color })
      }
    })

  })

  /* HANDLE MAGIC SEQUENCE INTERACTION WITH NGL AND PLOT */

  const selecting = ref(false)

  let selectBP = null
  const handleDsStart = () => {
    selecting.value = true
  }

  const handleDsUpdate = (items) => {
    // get residues list
    const residues = items.map((item) => item.id.split('-')[1] )

    if(items.length > 0) {
      // update viewer
      trjViewerRef.value.removeRepresentation(selectBP);
      selectBP = trjViewerRef.value.addRepresentation("ball+stick", { sele: residues.join(' '), radius: .2 })
    }
  }

  const handleDsEnd = (items) => {

    if(items.length === 0) {
      trjViewerRef.value.removeRepresentation(selectBP);
      sasaPlotRef.value.updatePlot([])
    } else {
      // get residues list
      const residues = items.map((item) => item.id.split('-')[1])
      const nucleotides = items.map((item) => `${item.id.split('-')[1]}${item.id.split('-')[0]}`)
      // update viewer
      trjViewerRef.value.removeRepresentation(selectBP);
      selectBP = trjViewerRef.value.addRepresentation("ball+stick", { sele: residues.join(' '), radius: .2 })
      // load traces plot
      sasaPlotRef.value.updatePlot(residues, nucleotides)
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