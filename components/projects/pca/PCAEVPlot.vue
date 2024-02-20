
<template>
  <div id="container-plot">

    <v-progress-circular
      :size="70"
      :width="7"
      color="red-darken-4"
      indeterminate
      id="loader-plot"
      v-if="loading"
    ></v-progress-circular>
  
    <div style="width:100%; ">
      <v-row class="mt-6"> 
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
        <CommonViewer :id="id" ref="commonViewerRef" />
      </template>
    </PlotDialog>

  </div>
</template>

<script setup>

  const { id } = defineProps(['id'])
  const config = useRuntimeConfig()
  const { $pca, $sleep } = useNuxtApp()

  const loading = ref(true)

  let data
  const dataAn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/pca`)
  if(dataAn.status.value === 'error')  throw createError({ statusCode: dataAn.error.value.statusCode, message: dataAn.error.value.statusMessage, fatal: true })
  data = ref(dataAn.data.value)

  setTimeout(() => {
    loading.value = false
  }, 500);

  let plotData = reactive({
    val: []
  })
  let plotLayout = {}
  let plotConfig = {}

  onMounted(async () => {
  
    // get data from REST API
    const evyd = data.value.eigenvalues.map(item => item.ev)
    let sum = 0
    const varyd = data.value.eigenvalues.map(item => {
      sum += item.var
      return sum;
    })
    const xd = Array.from({length: evyd.length}, (_, i) => i + 1)

    // load data & layout for timeseries plot
    plotData.val = [$pca.plots.eigenvalues.vardata(xd, varyd), $pca.plots.eigenvalues.evdata(xd, evyd)]
    plotLayout = $pca.plots.eigenvalues.layout($pca.eigenvalues.xtitle, $pca.eigenvalues.ytitle, $pca.eigenvalues.ytitle2)
    plotConfig = $pca.plots.eigenvalues.config

  })

  const dialog = ref(false)
  const commonViewerRef = ref(null)
  const plotDialogRef = ref(null)

  const myChartOnReady = (plotlyHTMLElement) => {

    // create double click logic
    let debounceTimeout
    let dclick = false
    plotlyHTMLElement.on?.('plotly_click', (e) => {
      debounceTimeout = setTimeout(async () => {
        if(!dclick) {
          dialog.value = true
          // set dialog title
          var title = `Principal Component ${e.points[0].x}`
          plotDialogRef.value.updateTitle(title)
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
    min-height: 420px;
    /*height: 420px; */
    position: relative;
    /*display:flex; 
    justify-content: center; 
    align-items: center;*/
  }
  #loader-plot {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
  