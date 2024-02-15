<template>
    <div id="container-plot" class="mt-6">
  
      <v-progress-circular
        :size="70"
        :width="7"
        color="red-darken-4"
        indeterminate
        id="loader-plot"
        v-if="loading"
      ></v-progress-circular>
  
      <div style="width:100%; " v-else>
        <v-row > 
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
    
    </div>
  </template>
  
  <script setup>

    const { id, type } = defineProps(['id', 'type'])
    const config = useRuntimeConfig()
    const { $rmsd, $sleep } = useNuxtApp()
    
    const loading = ref(true)
  
    /*let data
		const dataAn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/rmsd/residues`)
		if(dataAn.status.value === 'error')  throw createError({ statusCode: dataAn.error.value.statusCode, message: dataAn.error.value.statusMessage, fatal: true })
		data = ref(dataAn.data.value)*/
  
    setTimeout(() => {
      loading.value = false
    }, 500);
  
    let plotData = reactive({
      val: []
    })
    let plotLayout = {}
    let plotConfig = {}
    onMounted(async () => {
  
      // CHECK IF NO DATA AND SHOW MESSAGE INSTEAD OF EMPTY PLOT (SEE showPlot)

      // get data from REST API
      /*const yd = data.value.rmsd

      const xd = Array.from({length: yd.length}, (_, i) => i * data.value.step)
  
      // load data & layout for timeseries plot
      plotData.val = $rmsd.plots.rmsd.data(xd, yd)
      plotLayout = $rmsd.plots.rmsd.layout($rmsd.firstframe.xtitle, $rmsd.firstframe.ytitle)
      plotConfig = $rmsd.plots.rmsd.config*/
  
    })

    // EXPOSE FUNCTION TO PARENT COMPONENT FOR LOADING TRACES ACOORDING TO USER INTERACTION WITH VIEWER

    // CONNECT VIEWER AS WELL??
    
    const myChartOnReady = (plotlyHTMLElement) => {
  
      // create double click logic
      let debounceTimeout
      let dclick = false
      plotlyHTMLElement.on?.('plotly_click', (e) => {
        debounceTimeout = setTimeout(async () => {
          if(!dclick) {
            console.log('single click')
          }
          clearTimeout(debounceTimeout)
          dclick = false
        }, 300)
  
      })

			plotlyHTMLElement.on?.('plotly_doubleclick', (e) => {
				console.log('double click')
        dclick = true
				clearTimeout(debounceTimeout)
			})
    }
  
  </script>

  <style scoped>
    #container-plot { 
      width:100%; 
      height: 400px;
      position: relative;
    }
    #loader-plot {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  </style>
    