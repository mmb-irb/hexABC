<template>
    <div id="container-plot" class="mt-6">
  
      <div v-if="showPlot">
    
        <div style="width:100%;">
          <v-row > 
            <v-col cols="12">
              <nuxt-plotly 
                :data="plotData.val"
                :layout="plotLayout"
                :config="plotConfig"
              ></nuxt-plotly>
            </v-col>
          </v-row>
        </div>

      </div>

      <div style="height: 100%;" class="d-flex align-center justify-center" v-else>
        Please select one or more nucleotides above for visualizing their SASA
      </div>
    
    </div>
  </template>
  
  <script setup>

    const { id, type } = defineProps(['id', 'type'])
    const config = useRuntimeConfig()
    const { $sasa, $sleep } = useNuxtApp()

    const showPlot = computed(() => plotData.val.length > 0)
  
    let plotData = reactive({
      val: []
    })
    let plotLayout = {}
    let plotConfig = {}

    const updatePlot = async (residues, nucleotides = []) => {

      if(residues.length === 0) {
        plotData.val = []
        plotLayout = {}
        plotConfig = {}
        return
      }

      let data
      const dataAn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/sasa?res=${residues.join(',')}`)
      if(dataAn.status.value === 'error')  throw createError({ statusCode: dataAn.error.value.statusCode, message: dataAn.error.value.statusMessage, fatal: true })
      data = ref(dataAn.data.value)

      const traces = []
      data.value.sasa.forEach((item, index) => {
        const xd = Array.from({length: item.length}, (_, i) => i * data.value.step)
        const yd = item
        traces.push($sasa.plot.data(xd, yd, nucleotides[index]))
      });

      plotData.val = traces
      plotLayout = $sasa.plot.layout($sasa.xtitle, $sasa.ytitle)
      plotConfig = $sasa.plot.config

    }

    defineExpose({
      updatePlot
    })
  
  </script>

  <style scoped>
    #container-plot { 
      width:100%; 
      height: 400px;
      position: relative;
    }
    /*#loader-plot {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }*/
  </style>
    