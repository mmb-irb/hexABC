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
      <v-row> 
        <v-col cols="12">
          <nuxt-plotly 
            :data="plotData.val"
            :layout="plotLayout"
            :config="plotConfig"
            style="width: 100%; height: 550px;"
            @on-ready="myChartOnReady"
          ></nuxt-plotly>
        </v-col>
      </v-row>
    </div>

  <PlotDialog v-model="dialog" ref="plotDialogRef">
    <template #viewer>
      <CommonViewer :id="id" ref="commonViewerRef" />
    </template>
  </PlotDialog>

  </div>
</template>

<script setup>

  const { id, type } = defineProps(['id', 'type'])
  const config = useRuntimeConfig()
  const { $distres, $sleep } = useNuxtApp()
  
  const loading = ref(true)

  let data
  const dataAn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/dist-res/${type}`)
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

    //const xd = Array.from({length: data.value.rmsd.length}, (_, i) => i * data.value.step)
    const xd = data.value.strand1
    const yd = [...data.value.strand2].reverse()

    // get data from REST API
    const zd = [...data.value.data].reverse()

    // load data & layout for timeseries plot
    plotData.val = $distres.plot.data(xd, yd, zd, $distres[type].title)
    plotLayout = $distres.plot.layout($distres[type].xtitle, $distres[type].ytitle)
    plotConfig = $distres.plot.config

  })

  const dialog = ref(false)
  const commonViewerRef = ref(null)
  const plotDialogRef = ref(null);

  const myChartOnReady = (plotlyHTMLElement) => {

    // create double click logic
    let debounceTimeout
    let dclick = false
    plotlyHTMLElement.on?.('plotly_click', (e) => {
      debounceTimeout = setTimeout(async () => {
        if(!dclick) {
          dialog.value = true
          // set dialog title
          var title = `${$distres[type].title} :: Nucleotides ${e.points[0].x}-${e.points[0].y}`
          plotDialogRef.value.updateTitle(title)
          var ns = [e.points[0].x, e.points[0].y];
          // get residue numbers for selected nucleotides
          var residues = ns.map(item => item.replace(/\D/g, ''));
          // trick for avoiding problems on loading the viewer
          await $sleep(500)
          try {
            commonViewerRef.value.addRepresentation(residues.join(' '))
          } catch (error) {
            //console.log('Error adding representation:', error)
            await $sleep(500)
            commonViewerRef.value.addRepresentation(residues.join(' '))
          }
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
    height: 550px; 
    position: relative;
    display:flex; 
    justify-content: center; 
    align-items: center;
  }
  
</style>
  