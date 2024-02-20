
<template>

  <p>Select for visualizing the <strong>PCA projections</strong> in pairs of two. Currently visualizing <strong>Principal Component {{ prj1 }}</strong> and <strong>Principal Component {{ prj2 }}</strong>.</p>

  <v-autocomplete
    label="Select projection"
    v-model="modelProjection"
    :items="combinations"
    @update:modelValue="changeProjection"
    class="mt-6"
  ></v-autocomplete>

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
      <v-row class="mt-6"> 
        <v-col cols="12">
          <nuxt-plotly 
            :data="plotData.val"
            :layout="plotLayout"
            :config="plotConfig"
            style="width:100%;height:470px;"
          ></nuxt-plotly>
        </v-col>
      </v-row>
    </div>

  </div>
</template>

<script setup>

  const { id } = defineProps(['id'])
  const config = useRuntimeConfig()
  const { $pca, $sleep } = useNuxtApp()

  const loading = ref(true)

  let prj1 = ref(1)
  let prj2 = ref(2)

  // get initial data for calculating all the possible projections
  let dataInit
  const dtIn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/pca`)
  if(dtIn.status.value === 'error')  throw createError({ statusCode: dtIn.error.value.statusCode, message: dtIn.error.value.statusMessage, fatal: true })
  dataInit = ref(dtIn.data.value)
  const combinations = []
  for (let i = 1; i <= dataInit.value.eigenvalues.length; i++) {
    for (let j = 1; j <= dataInit.value.eigenvalues.length; j++) {
      if (i !== j) combinations.push({
        title: `Principal component ${i} vs Principal component ${j}`,
        value: `${i},${j}`
      })
    }
  }

  // get initial data for the plot (1 vs 2)
  let data
  const dataAn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/pca?pc=${prj1.value},${prj2.value}`)
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
  
    // get data from REST API
    const xd = data.value.pca[0]
    const yd = data.value.pca[1]

    // load data & layout for timeseries plot
    plotData.val = $pca.plots.projections.data(xd, yd, prj1.value, prj2.value)
    plotLayout = $pca.plots.projections.layout(`Principal component ${prj1.value}`, `Principal component ${prj2.value}`)
    plotConfig = $pca.plots.projections.config

  })

  let modelProjection = ref('1,2')
  const changeProjection = async (e) => {
    prj1.value = e.split(',')[0]
    prj2.value = e.split(',')[1]

    // get selected projection data
    const d = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/pca?pc=${prj1.value},${prj2.value}`)
    if(d.status.value === 'error')  throw createError({ statusCode: d.error.value.statusCode, message: d.error.value.statusMessage, fatal: true })
    const dt = ref(d.data.value)

    // update plot data & layout
    plotData.val = $pca.plots.projections.data(dt.value.pca[0], dt.value.pca[1], prj1.value, prj2.value)
    plotLayout = $pca.plots.projections.layout(`Principal component ${prj1.value}`, `Principal component ${prj2.value}`)
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
</style>
  