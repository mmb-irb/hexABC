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
      <v-row class="mt-4"> 
        <v-col cols="12">
          <nuxt-plotly 
            ref="myPlot"
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

  //import Plotly from 'plotly.js-dist-min';

  const { id } = defineProps(['id'])
  const config = useRuntimeConfig()
  const { $fluctuation, $sleep } = useNuxtApp()
  
  const loading = ref(true)

  let data
  const dataAn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/fluctuation`)
  if(dataAn.status.value === 'error')  throw createError({ statusCode: dataAn.error.value.statusCode, message: dataAn.error.value.statusMessage, fatal: true })
  data = ref(dataAn.data.value)

  const emit = defineEmits(['updateTable', 'hoverPlot']);

  emit('updateTable', data.value.average, data.value.stdev);

  setTimeout(() => {
    loading.value = false
  }, 500);

  let plotData = reactive({
    val: []
  })
  let plotLayout = {}
  let plotConfig = {}
  const myPlot = ref(null);
  onMounted(async () => {

    // get data from REST API
    const yd = data.value.fluctuation
    const xd = data.value.atoms.map((item) => (item.label))
    const colors = [];

    // assign unique color to each atom
    data.value.atoms.forEach(item => {
      colors.push($fluctuation.atoms.find((i) => (i.atom === item.atom)).color);
    });

    plotData.val = $fluctuation.plot.data(xd, yd, colors)
    plotLayout = $fluctuation.plot.layout($fluctuation.xtitle, $fluctuation.ytitle)
    plotConfig = $fluctuation.plot.config

    //Plotly.newPlot('myDiv', plotData.val, plotLayout, plotConfig);
    /*Plotly.Fx.hover('myDiv', [
      {curveNumber:0, pointNumber:0}
    ]);*/

  })

  const myChartOnReady = async (plotlyHTMLElement) => {

    plotlyHTMLElement.on?.('plotly_hover', (e) => {
      const a = e.points[0].x.split(' (')[0]
      const r = e.points[0].x.split(' (')[1].match(/\d+/)[0]
      emit('hoverPlot', a, r)
    })

    plotlyHTMLElement.on?.('plotly_unhover', (e) => {
      emit('hoverPlot', null)
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
  