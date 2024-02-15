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

    <div style="width:100%;">
      <v-row class="mt-4"> 
        <v-col cols="12">
          <div id="plotContainer"></div>
        </v-col>
      </v-row>
    </div>

  </div>
</template>

<script setup>

  import Plotly from 'plotly.js-dist-min';

  const { id } = defineProps(['id'])
  const config = useRuntimeConfig()
  const { $fluctuation, $sleep } = useNuxtApp()
  
  const loading = ref(true)

  const emit = defineEmits(['updateTable', 'hoverPlot']);

  setTimeout(() => {
    loading.value = false
  }, 500);

  let plotData = reactive({
    val: []
  })
  let plotLayout = {}
  let plotConfig = {}
  let labels, flucts
  onMounted(async () => {

    let data
    const dataAn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/fluctuation`)
    if(dataAn.status.value === 'error')  throw createError({ statusCode: dataAn.error.value.statusCode, message: dataAn.error.value.statusMessage, fatal: true }) 
    data = ref(dataAn.data.value)

    emit('updateTable', data.value.average, data.value.stdev);

    // get data from REST API
    flucts = data.value.fluctuation
    labels = data.value.atoms.map((item) => (item.label))
    const atoms = data.value.atoms

    const traces = []
    $fluctuation.atoms.forEach((item, index) => {
      const yd = []
      atoms.forEach((itm, idx) => {
        if(itm.atom === item.atom) {
          yd.push(flucts[idx])
        } else {
          yd.push(null)
        }
      });
      traces.push($fluctuation.plot.data(labels, yd, item.name, item.color))
    });

    //console.log(traces)

    plotData.val = traces
    plotLayout = $fluctuation.plot.layout($fluctuation.xtitle, $fluctuation.ytitle)
    plotConfig = $fluctuation.plot.config

    Plotly.newPlot('plotContainer', plotData.val, plotLayout, plotConfig);   

    var myPlot = document.getElementById('plotContainer')

    myPlot.on('plotly_hover', function(e){
      const a = e.points[0].x.split(' (')[0]
      const r = e.points[0].x.split(' (')[1].match(/\d+/)[0]
      emit('hoverPlot', a, r)
    });

    myPlot.on('plotly_unhover', function(e){
      emit('hoverPlot', null)
    });

  })

  const selectValue = (label, element) => {
    var idx = labels.indexOf(label)
    var crv = $fluctuation.atoms.findIndex((i) => (i.atom === element))
    if(idx > -1) {
      Plotly.Fx.hover('plotContainer', [
        { curveNumber: crv, pointNumber: idx }
      ]);
    } else {
      Plotly.Fx.unhover('plotContainer');
    }
  }

  defineExpose({
		selectValue
	});

</script>

<style>
  #tbl-rmsd .v-table__wrapper table { table-layout: fixed; } 
</style>

<style scoped>
  #container-plot { 
    width:100%; 
    height: 470px; 
    position: relative;
  }
  #loader-plot {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
  