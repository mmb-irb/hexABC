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
        <TimeSeriesViewer :id="id" ref="tSeriesViewerRef" />
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
  
      // load data & layout for timeseries plot
      plotData.val = $rmsd.plot.data(yd)
      plotLayout = $rmsd.plot.layout($rmsd.xtitle, $rmsd.ytitle)
      plotConfig = $rmsd.plot.config
  
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
      let debounceTimeout
      let dclick = false
      plotlyHTMLElement.on?.('plotly_click', (e) => {
        debounceTimeout = setTimeout(async () => {
          if(!dclick) {
            dialog.value = true
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
    