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
        <v-col lg="10" md="9" cols="12">
          <nuxt-plotly 
            :data="plotData.val"
            :layout="plotLayout"
            :config="plotConfig"
            @on-ready="myChartOnReady"
          ></nuxt-plotly>
        </v-col>
        <v-col lg="2" md="3" cols="12" v-if="display.mdAndUp">
          <nuxt-plotly 
            :data="histData.val"
            :layout="histLayout"
            :config="histConfig"
          ></nuxt-plotly>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col style="text-align: center;">no Plot yet</v-col>
      </v-row>
    </div>

  <PlotDialog v-model="dialog" ref="plotDialogRef">
    <template #viewer>
      <CommonViewer :id="id" ref="tSeriesViewerRef" />
    </template>
  </PlotDialog>

  </div>
</template>

<script setup>
  import { useDisplay } from 'vuetify'

  const { id, type, seq, nucl } = defineProps(['id', 'type', 'seq', 'nucl'])
  const display = ref(useDisplay())
  const config = useRuntimeConfig()
  const { $curves, $sleep } = useNuxtApp()
  
  const loading = ref(true)

  // PROVISIONAL
  const showPlot = ref(type !== undefined && id !== undefined && seq !== undefined)

  let data
  // PROVISIONAL
  if(showPlot.value) {
    const dataAn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/time/${type}?bp=${seq}`)
    if(dataAn.status.value === 'error')  throw createError({ statusCode: dataAn.error.value.statusCode, message: dataAn.error.value.statusMessage, fatal: true })
    data = ref(dataAn.data.value[type])
  }

  setTimeout(() => {
    loading.value = false
  }, 500);

  let plotData = reactive({
    val: []
  })
  let plotLayout = {}
  let plotConfig = {}

  let histData = reactive({
    val: []
  })
  let histLayout = {}
  let histConfig = {}

  onMounted(async () => {

    // get data from REST API
    const yd = data;

    // load data & layout for timeseries plot
    plotData.val = $curves.plots.timeseries.data(yd)
    plotLayout = $curves.plots.timeseries.layout($curves.descriptions[type].plot.timeseries.xtitle, $curves.descriptions[type].plot.timeseries.ytitle)
    plotConfig = $curves.plots.timeseries.config

    // load data & layout for histogram plot
    histData.val = $curves.plots.histogram.data(yd)
    histLayout = $curves.plots.histogram.layout($curves.descriptions[type].plot.timeseries.histogram)
    histConfig = $curves.plots.histogram.config

  })

  const dialog = ref(false)
  const tSeriesViewerRef = ref(null)
  const plotDialogRef = ref(null);

  const getTypeofSelection = (nucl) => {
    var tp = ''
    switch(nucl.length) {
      case 1:
        tp = ''
        break
      case 2: 
        const numbers = nucl.map(item => Number(item.split('-')[1]));
        if (numbers.every((number, index) => index === 0 || number === numbers[index - 1] + 1)) tp = 'BS'
        else tp = 'BP'
        break
      case 4:
        tp = 'BPS'
        break
      case 8:
        tp = 'TETR'
        break
      case 12:
        tp = 'HEX'
        break
    }
    return tp
  }

  const myChartOnReady = (plotlyHTMLElement) => {

    // create double click logic
    /*plotlyHTMLElement.on?.('plotly_click', (e) => {
      console.log(e.points[0].x, e.points[0].y, nucl);
    })*/

    let debounceTimeout
    let dclick = false
    plotlyHTMLElement.on?.('plotly_click', (e) => {
      debounceTimeout = setTimeout(async () => {
        if(!dclick) {
          //console.log(e.points[0].x, e.points[0].y, e.points[0].z);
          dialog.value = true
          // set dialog title
          var ns = nucl.map(item => item.split('-').reverse().join('')).join('-')
          var tp = getTypeofSelection(nucl)
          var title = `${$curves.descriptions[type].title} :: Frame ${e.points[0].x} :: ${tp} ${ns}`
          plotDialogRef.value.updateTitle(title)
          // get residue numbers for selected nucleotides
          var residues = nucl.map(item => Number(item.match(/\d+/)[0]))
          // trick for avoiding problems on loading the viewer
          await $sleep(500)
          try {
            tSeriesViewerRef.value.addRepresentation(residues.join(' '))
          } catch (error) {
            //console.log('Error adding representation:', error)
            await $sleep(500)
            tSeriesViewerRef.value.addRepresentation(residues.join(' '))
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
  