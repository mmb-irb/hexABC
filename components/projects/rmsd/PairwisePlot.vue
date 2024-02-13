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
							style="width: 100%; height: 550px;"
              @on-ready="myChartOnReady"
            ></nuxt-plotly>
          </v-col>
        </v-row>
      </div>
  
    <PlotDialog v-model="dialog" ref="plotDialogRef">
      <template #viewer>
        <!-- TODO: modify by DoubleFrameViewer (it should show both frames) -->
        <CommonViewer :id="id" ref="tSeriesViewerRef" />
      </template>
    </PlotDialog>
  
    </div>
  </template>
  
  <script setup>

    const { id, type } = defineProps(['id'])
    const config = useRuntimeConfig()
    const { $rmsd, $sleep } = useNuxtApp()
    
    const loading = ref(true)
  
    let data
		const dataAn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/rmsd/pairwise`)
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
  
			const xd = Array.from({length: data.value.rmsd.length}, (_, i) => i * data.value.step)

      // get data from REST API
      const zd = data.value.rmsd
  
      // load data & layout for timeseries plot
      plotData.val = $rmsd.plots.pairwise.data(xd, xd, zd)
      plotLayout = $rmsd.plots.pairwise.layout($rmsd.pairwise.xtitle, $rmsd.pairwise.ytitle)
      plotConfig = $rmsd.plots.pairwise.config
  
    })
  
    const dialog = ref(false)
    const tSeriesViewerRef = ref(null)
    const plotDialogRef = ref(null);
  
    const myChartOnReady = (plotlyHTMLElement) => {
  
      // create double click logic
      let debounceTimeout
      let dclick = false
      plotlyHTMLElement.on?.('plotly_click', (e) => {
        debounceTimeout = setTimeout(async () => {
          if(!dclick) {
            dialog.value = true
            // set dialog title
            var title = `${$rmsd.pairwise.title} :: Frames ${e.points[0].x}-${e.points[0].y}`
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
  
	<style>
		#tbl-rmsd .v-table__wrapper table { table-layout: fixed; } 
	</style>

  <style scoped>
    #container-plot { 
      width:100%; 
      height: 550px; 
      position: relative;
      display:flex; 
      justify-content: center; 
      align-items: center;
    }
		
  </style>
    