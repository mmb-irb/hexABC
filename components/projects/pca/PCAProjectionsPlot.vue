
<template>

  <p>Select for visualizing the <strong>PCA projections</strong> in pairs of two. Currently visualizing <strong>Principal Component {{ modelProjection1 }}</strong> vs <strong>Principal Component {{ modelProjection2 }}</strong>.</p>

  <v-row>
    <v-col lg="6" md="6" sm="6" cols="12">
      <v-select
        variant="outlined"
        density="compact"
        label="Select X axis projection"
        v-model="modelProjection1"
        :items="pclist1"
        @update:modelValue="changeProjection"
      ></v-select>
    </v-col>
    <v-col lg="6" md="6" sm="6" cols="12">
      <v-select
        variant="outlined"
        density="compact"
        label="Select Y axis projection"
        v-model="modelProjection2"
        :items="pclist2"
        @update:modelValue="changeProjection"
      ></v-select>
    </v-col>
  </v-row>

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
      <v-row class="mt-2"> 
        <v-col cols="12">
          <nuxt-plotly 
            :data="plotData.val"
            :layout="plotLayout"
            :config="plotConfig"
            style="width:100%;height:470px;"
            @on-ready="myChartOnReady"
          ></nuxt-plotly>
        </v-col>
      </v-row>
      <v-row class="my-0 pa-0"> 
        <v-col cols="12" class="d-flex justify-center my-0 pa-0">
          <p>Color gradient represents the position in the dataset:</p>
        </v-col>
      </v-row>
      <v-row class="my-0"> 
        <v-col cols="12" class="d-flex justify-center my-0 pa-0">
          start <div id="gradient-positions"><div id="gp-cursor"></div></div> end
        </v-col>
      </v-row>
    </div>

  </div>

  <v-snackbar
    v-model="snackbar"
    :timeout="3000"
    color="yellow-darken-1"
    elevation="4"
  >
    {{ textSnackbar }}
  </v-snackbar>
</template>

<script setup>

  import common from '@/modules/common'

  const { id } = defineProps(['id'])
  const config = useRuntimeConfig()
  const { $pca, $sleep } = useNuxtApp()

  const { interpolateColor } = common()

  const loading = ref(true)

  let modelProjection1 = ref(1)
  let modelProjection2 = ref(2)

  // get initial data for calculating all the possible projections
  let dataInit
  const dtIn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/pca`)
  if(dtIn.status.value === 'error')  throw createError({ statusCode: dtIn.error.value.statusCode, message: dtIn.error.value.statusMessage, fatal: true })
  dataInit = ref(dtIn.data.value)
  const pclist1 = []
  const pclist2 = []
  for (let i = 1; i <= dataInit.value.eigenvalues.length; i++) {
    pclist1.push({
      title: `Principal component ${i}`,
      value: i
    })
    pclist2.push({
      title: `Principal component ${i}`,
      value: i
    })
  }

  // get initial data for the plot (1 vs 2)
  let data
  const dataAn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/pca?pc=${modelProjection1.value},${modelProjection2.value}`)
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

  let colorValues
  onMounted(async () => {
  
    // get data from REST API
    const xd = data.value.pca[0]
    const yd = data.value.pca[1]
    const positions = Array.from({length: xd.length}, (_, i) => i)
    const minValue = Math.min(...positions);
    const maxValue = Math.max(...positions);
    colorValues = positions.map(value => interpolateColor(value, minValue, maxValue));

    // load data & layout for timeseries plot
    plotData.val = $pca.plots.projections.data(xd, yd, modelProjection1.value, modelProjection2.value, colorValues)
    plotLayout = $pca.plots.projections.layout(`Principal component ${modelProjection1.value}`, `Principal component ${modelProjection2.value}`)
    plotConfig = $pca.plots.projections.config

  })

  const snackbar = ref(false)
  const textSnackbar = ref('')
  const changeProjection = async (e) => {

    if(modelProjection1.value === modelProjection2.value) {
      snackbar.value = true
      textSnackbar.value = 'Please select different Principal Components'
      return
    }

    snackbar.value = false

    // get selected projection data
    const d = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/pca?pc=${modelProjection1.value},${modelProjection2.value}`)
    if(d.status.value === 'error')  throw createError({ statusCode: d.error.value.statusCode, message: d.error.value.statusMessage, fatal: true })
    const dt = ref(d.data.value)

    // update plot data & layout
    plotData.val = $pca.plots.projections.data(dt.value.pca[0], dt.value.pca[1], modelProjection1.value, modelProjection2.value, colorValues)
    plotLayout = $pca.plots.projections.layout(`Principal component ${modelProjection1.value}`, `Principal component ${modelProjection2.value}`)
  }

  const myChartOnReady = (plotlyHTMLElement) => {

    plotlyHTMLElement.on?.('plotly_hover', function(e){
      document.querySelector('#gp-cursor').style.display = 'block'
      document.querySelector('#gp-cursor').style.left = `${e.points[0].pointNumber * (document.querySelector('#gradient-positions').clientWidth / data.value.pca[0].length)}px`
    })

    plotlyHTMLElement.on?.('plotly_unhover', function(e){
      document.querySelector('#gp-cursor').style.display = 'none'
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
  #gradient-positions {
    position: relative;
    width: 600px;
    height: 20px;
    margin:0 1rem;
    background: linear-gradient(90deg, #ffff33 0%, #ff0033 100%);
  }
  #gp-cursor {
    position: absolute;
    display: none;
    top: -4px;
    left: 0;
    width: 2px;
    height: 28px;
    background: #555;
  }
</style>
  