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
				<v-row class="mt-10"> 
          <v-col cols="12">
						<v-table id="tbl-rmsd" class="bg-red-lighten-4 pa-2">
							<tr>
								<td class="text-right"><strong>mean (Å):</strong></td>
								<td class="text-left pl-2">{{ mean }}</td>
								<td class="text-right"><strong>standard deviation (Å):</strong></td>
								<td class="text-left pl-2">{{ stdev }}</td>
							</tr>
						</v-table>
					</v-col>
				</v-row>
        <v-row class="mt-4"> 
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
        <FrameViewer :id="id" :frame="selectedFrame" ref="frameViewerRef" />
      </template>
    </PlotDialog>
  
    </div>
  </template>
  
  <script setup>

    const { id, type } = defineProps(['id', 'type'])
    const config = useRuntimeConfig()
    const { $rmsd, $sleep } = useNuxtApp()
    
    const loading = ref(true)
  
    let data
		const dataAn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/rmsd/${type}`)
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
  
		const mean = data.value.mean
		const stdev = data.value.stdev

    onMounted(async () => {
  
      // get data from REST API
      const yd = data.value.rmsd

      const xd = Array.from({length: yd.length}, (_, i) => i * data.value.step)
  
      // load data & layout for timeseries plot
      plotData.val = $rmsd.plots.rmsd.data(xd, yd)
      plotLayout = $rmsd.plots.rmsd.layout($rmsd[type].xtitle, $rmsd[type].ytitle)
      plotConfig = $rmsd.plots.rmsd.config
  
    })
  
    const dialog = ref(false)
    const frameViewerRef = ref(null)
    const plotDialogRef = ref(null)
    const selectedFrame = ref(null)
  
    const myChartOnReady = (plotlyHTMLElement) => {
  
      // create double click logic
      let debounceTimeout
      let dclick = false
      plotlyHTMLElement.on?.('plotly_click', (e) => {
        debounceTimeout = setTimeout(async () => {
          if(!dclick) {
            dialog.value = true
            selectedFrame.value = e.points[0].x
            // set dialog title
            var title = `${$rmsd[type].title} :: Frame ${e.points[0].x}`
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
      height: 470px; 
      position: relative;
      display:flex; 
      justify-content: center; 
      align-items: center;
    }
  </style>
    