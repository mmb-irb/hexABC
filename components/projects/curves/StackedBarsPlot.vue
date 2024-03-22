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
    <v-row> 
      <v-col cols="12">
        <nuxt-plotly 
          :data="plotData.val"
          :layout="plotLayout"
          :config="plotConfig"
          @on-ready="myChartOnReady"
        ></nuxt-plotly>
      </v-col>
    </v-row>
  </div>

  <PlotDialog v-model="dialog" ref="plotDialogRef">
    <template #viewer>
      <TrajectoryViewer :id="id" ref="trjViewerRef" />
    </template>
  </PlotDialog>

  </div>
</template>

<script setup>

  const { id, type } = defineProps(['id', 'type'])
  const config = useRuntimeConfig()
  const { $curves, $sleep } = useNuxtApp()
  
  const loading = ref(true)

  const dataAn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/average/${type}`)
  if(dataAn.status.value === 'error')  throw createError({ statusCode: dataAn.error.value.statusCode, message: dataAn.error.value.statusMessage, fatal: true })
  const data = ref(dataAn.data.value[type])

  setTimeout(() => {
    loading.value = false
  }, 500);

  let plotData = reactive({
    val: []
  })
  let plotLayout = {}
  let plotConfig = {}

  onMounted(async () => {

    // get labels from the first item
    const labels = data.value[0].labels
    // get nucleotides list
    const xd = data.value.map(item => item.nucleotide)

    const traces = []
    labels.forEach((item, index) => {
    
      // get y values for each label
      const yd = data.value.map(item => item.values[index])
      // push new trace into traces array
      const trace = $curves.plots.stacked.data(xd, yd, item, $curves.colors[index])
      traces.push(trace)

    });

    // load data & layout for stacked plot
    plotData.val = traces
    plotLayout = $curves.plots.stacked.layout($curves.descriptions[type].plot.stacked.xtitle, $curves.descriptions[type].plot.stacked.ytitle)
    plotConfig = $curves.plots.stacked.config

  })

  const dialog = ref(false)
  const trjViewerRef = ref(null)
  const plotDialogRef = ref(null);

  const myChartOnReady = (plotlyHTMLElement) => {

    let debounceTimeout
    let dclick = false
    plotlyHTMLElement.on?.('plotly_click', (e) => {
      debounceTimeout = setTimeout(async () => {
        if(!dclick) {
          dialog.value = true
          // set dialog title
          var title = `${$curves.descriptions[type].title} :: ${e.points[0].x}`
          plotDialogRef.value.updateTitle(title)
          // get residue numbers for selected nucleotides
          var residue = e.points[0].x.match(/\d+/)[0]
          // trick for avoiding problems on loading the viewer
          await $sleep(500)
          try {
            trjViewerRef.value.addRepresentation("ball+stick", { sele: residue, radius: .2 }, true)
          } catch (error) {
            await $sleep(500)
            trjViewerRef.value.addRepresentation("ball+stick", { sele: residue, radius: .2 }, true)
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
  