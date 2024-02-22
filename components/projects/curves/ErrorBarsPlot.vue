<template>
  <div id="container-plot">

  <v-progress-circular
    :size="70"
    :width="7"
    color="red-darken-4"
    indeterminate
    v-if="loading"
  ></v-progress-circular>

  <div style="width:100%; " v-else>
    <v-row v-if="showPlot"> 
      <v-col cols="12">
        <nuxt-plotly 
          :data="plotData.val"
          :layout="plotLayout"
          :config="plotConfig"
          @on-ready="myChartOnReady"
        ></nuxt-plotly>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col style="text-align: center;">no Plot yet</v-col>
    </v-row>
  </div>

  <PlotDialog v-model="dialog" ref="plotDialogRef">
    <template #viewer>
      <CommonViewer :id="id" ref="commonViewerRef" />
    </template>
  </PlotDialog>

  </div>
</template>

<script setup>

  const { id, type } = defineProps(['id', 'type'])
  const config = useRuntimeConfig()
  const { $curves, $sleep } = useNuxtApp()
  
  const loading = ref(true)

  // PROVISIONAL
  const showPlot = ref(type !== undefined && id !== undefined)

  let data, project, sequence
  // PROVISIONAL
  if(showPlot.value) {
    const dataAn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/average/${type}`)
    if(dataAn.status.value === 'error')  throw createError({ statusCode: dataAn.error.value.statusCode, message: dataAn.error.value.statusMessage, fatal: true })
    data = ref(dataAn.data.value[type])

    const datap = await useFetch(`${config.public.apiBase}/projects/${id}`)
    if(datap.status.value === 'error')  throw createError({ statusCode: datap.error.value.statusCode, message: datap.error.value.statusMessage, fatal: true })
    project = ref(datap.data.value)
    sequence = project.value.metadata.SEQUENCES[0]
  }

  setTimeout(() => {
    loading.value = false
  }, 500);

  let plotData = reactive({
    val: []
  })
  let plotLayout = {}
  let plotConfig = {}

  let labels
  onMounted(async () => {

    // PROVISIONAL
    if(showPlot.value) {
      // get list of labels
      labels = data.value.map(item => item.label)
      // get list of indexes
      const tickvals = Array.from({length: labels.length}, (_, i) => i)

      // get y values for each label
      const yd = data.value.map(item => item.value)
      const err = data.value.map(item => item.error)

      // load data & layout for stacked plot
      plotData.val = $curves.plots.error.data(yd, err)
      plotLayout = $curves.plots.error.layout($curves.descriptions[type].plot.error.xtitle, $curves.descriptions[type].plot.error.ytitle, labels, tickvals)
      plotConfig = $curves.plots.error.config
    }

  })

  const dialog = ref(false)
  const commonViewerRef = ref(null)
  const plotDialogRef = ref(null);

  const getResidueNumbers = (index, tp) => {
    const residues = tp === 'bp' ? 
      [index, sequence.length*2 - index + 1] :
      [index, index + 1, sequence.length*2 - index, sequence.length*2 - index + 1]
    return residues
  }

  const myChartOnReady = (plotlyHTMLElement) => {

    let debounceTimeout
    let dclick = false
    plotlyHTMLElement.on?.('plotly_click', (e) => {
      debounceTimeout = setTimeout(async () => {
        if(!dclick) {
          dialog.value = true

          // get index, label and type
          const index = e.points[0].x
          const label = labels[e.points[0].x]
          const tp = label.length === 2 ? 'bp' : 'bps'

          // get residues indexes
          const residues = getResidueNumbers(index + 2, tp) // +2 because of the 2-based index in the sequence
          // set dialog title
          var title = `${$curves.descriptions[type].title} :: ${index + 2}${label}`
          plotDialogRef.value.updateTitle(title)
          // trick for avoiding problems on loading the viewer
          await $sleep(500)
          try {
            commonViewerRef.value.addRepresentation(residues.join(' '))
          } catch (error) {
            await $sleep(500)
            commonViewerRef.value.addRepresentation(residues.join.join(' '))
          }
        }
        clearTimeout(debounceTimeout)
        dclick = false
      }, 300)

    })

    plotlyHTMLElement.on?.('plotly_doubleclick', (e) => {
      dclick = true
      clearTimeout(debounceTimeout)
    })

  }

</script>

<style scoped>
  #container-plot { 
    width:100%; 
    height: 470px; 
    position: relative;
    display:flex; 
    justify-content: center; 
    align-items: center;
  }
</style>
  