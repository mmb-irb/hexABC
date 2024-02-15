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
  let xd, yd
  onMounted(async () => {

    let datap
    const dataAn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/fluctuation`)
    if(dataAn.status.value === 'error')  throw createError({ statusCode: dataAn.error.value.statusCode, message: dataAn.error.value.statusMessage, fatal: true }) 
    datap = ref(dataAn.data.value)

    emit('updateTable', datap.value.average, datap.value.stdev);

    // get data from REST API
    yd = datap.value.fluctuation
    xd = datap.value.atoms.map((item) => (item.label))
    //console.log(xd, yd)
    const colors = [];

    // assign unique color to each atom
    datap.value.atoms.forEach(item => {
      colors.push($fluctuation.atoms.find((i) => (i.atom === item.atom)).color);
    });

    plotData.val = $fluctuation.plot.data(xd, yd, colors)
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

  const selectValue = (label) => {
    var idx = xd.indexOf(label)
    if(idx > -1) {
      Plotly.Fx.hover('plotContainer', [
        {curveNumber:0, pointNumber:idx }
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
  