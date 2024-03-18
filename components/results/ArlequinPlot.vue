<template>
  <div id="container-plot">

    <v-progress-circular
      :size="70"
      :width="7"
      color="red-darken-4"
      indeterminate
      v-if="loading"
    ></v-progress-circular>

    <div style="width:100%;" v-else>
      <v-row> 
        <v-col cols="12">
          <nuxt-plotly 
            :data="plotData.val"
            :layout="plotLayout"
            :config="plotConfig"
            style="width: 100%; height: 620px;"
            @on-ready="myChartOnReady"
          ></nuxt-plotly>
        </v-col>
      </v-row>
      <v-row class="pa-0 mt-5"> 
        <v-col cols="12" class="d-flex justify-center my-0 pa-0">
          <div id="custom-colorscale">
            <div class="color" id="color1"></div>
            <div class="color" id="color2"></div>
            <div class="color" id="color3"></div>
          </div>
        </v-col>
      </v-row>
      <v-row class="pa-0 mt-4"> 
        <v-col cols="12" class="d-flex justify-center my-0 pa-0">
          <div id="custom-legend">
            <span>&lt; -0.02 - 0.35</span>
            <span>-0.02 ± 0.35</span>
            <span>&gt; -0.02 + 0.35</span>
          </div>
        </v-col>
      </v-row>
    </div>

  <PlotDialog v-model="dialog" ref="plotDialogRef">
    <template #viewer>
      <DensityPlot />
    </template>
  </PlotDialog>

  </div>
</template>

<script setup>

import useInteractiveSequence from '@/modules/analysis/useInteractiveSequence'

  const { 
    calculateComplementaryStrand
  } = useInteractiveSequence()

  const config = useRuntimeConfig()
  const { $shift, $sleep } = useNuxtApp()
  
  const loading = ref(true)

  let datap
  const dataAn = await useFetch(`${config.public.apiBase}/results/shift`)
  if(dataAn.status.value === 'error')  throw createError({ statusCode: dataAn.error.value.statusCode, message: dataAn.error.value.statusMessage, fatal: true })
  datap = ref(dataAn.data.value)

  setTimeout(() => {
    loading.value = false
  }, 500);

  let plotData = reactive({
    val: []
  })
  let plotLayout = {}
  let plotConfig = {}

  onMounted(async () => {

    var colorscaleValue = $shift.colorscale

    // load data & layout for timeseries plot
    plotData.val = $shift.data(datap.value.tetramers, datap.value.hexamers, datap.value.shift, colorscaleValue)
    plotLayout = $shift.layout
    plotConfig = $shift.config

    plotLayout.annotations = []

    for ( var i = 0; i < datap.value.hexamers.length; i++ ) {
      for ( var j = 0; j < datap.value.tetramers.length; j++ ) {

        var zval = datap.value.shift[i][j]

        let text, textColor
        switch(zval) {
          case 3: 
            text = '🔴';
            textColor = '#ff0000';
            break;
          case 4: 
            text = '🔷';
            textColor = '#0000ff';
            break;
          case 5: 
            text = '🔷';
            textColor = '#0000ff';
            break;
        }

        if(zval === 3 || zval === 4 || zval === 5) {
          var result = {
            x: j,
            y: i,
            text: text,
            showarrow: false,
            font: {
              size: 10,
              color: textColor
            }
          };
          plotLayout.annotations.push(result);
        }
      }
    }

  })

  const dialog = ref(false)
  const plotDialogRef = ref(null);

  const myChartOnReady = (plotlyHTMLElement) => {

    plotlyHTMLElement.on?.('plotly_hover', function(e){

      var legendZ = $shift.legendZ

      var x = e.points[0].x;
      var y = e.points[0].y;
      var z = e.points[0].z;

      var hex = y.replace('....', x)
      var comphex = calculateComplementaryStrand(hex.split(''))

      e.points[0].fullData.hovertemplate = `<b>${hex} / ${comphex.join('')}</b>` +
                  `<br><b>${legendZ[z]}</b>` +
									`<extra></extra>`
    })

    // create double click logic
    let debounceTimeout
    let dclick = false
    plotlyHTMLElement.on?.('plotly_click', (e) => {
      debounceTimeout = setTimeout(async () => {
        if(!dclick) {
          dialog.value = true
          // set dialog title 
          var title = `${e.points[0].y.replace('....', e.points[0].x)}`
          plotDialogRef.value.updateTitle(title)
          //console.log('single click!')
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
    height: 700px; 
    position: relative;
    display:flex; 
    justify-content: center; 
    align-items: center;
  }
  #custom-colorscale {
    width: 50%;
    border: 1px solid #ccc;
    height: 15px;
  }
  .color { 
    width: 33.3333%;
    height: 100%;
    float: left;
  }
  #color1 { background: #ff0000; }
  #color2 { background: #ffffff; }
  #color3 { background: #0000ff; }
  #custom-legend {
    width: 50%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
</style>
  