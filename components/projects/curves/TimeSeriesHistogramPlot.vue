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

    </div>
</template>

<script setup>
  import { useDisplay } from 'vuetify'

  const { id, type, seq, nucl } = defineProps(['id', 'type', 'seq', 'nucl'])
  const display = ref(useDisplay())
  const config = useRuntimeConfig()
  const { $curves } = useNuxtApp()
  
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

  const myChartOnReady = (plotlyHTMLElement) => {

    plotlyHTMLElement.on?.('plotly_click', (e) => {
      console.log(e.points[0].x, e.points[0].y, nucl);
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
  