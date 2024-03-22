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
      <v-row > 
        <v-col cols="12">
          <v-table id="tbl-rgyr" density="compact" class="pa-2">
            <thead>
              <tr>
                <th></th>
                <th>mean (Å)</th>
                <th>standard deviation (Å)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="even-row">
                <td><strong>Rgyr</strong></td>
                <td>{{ mean.rgyr }}</td>
                <td>{{ stdev.rgyr }}</td>
              </tr>
              <tr>
                <td><strong>RgyrX</strong></td>
                <td>{{ mean.rgyrx }}</td>
                <td>{{ stdev.rgyrx }}</td>
              </tr>
              <tr class="even-row">
                <td><strong>RgyrY</strong></td>
                <td>{{ mean.rgyry }}</td>
                <td>{{ stdev.rgyry }}</td>
              </tr>
              <tr>
                <td><strong>RgyrZ</strong></td>
                <td>{{ mean.rgyrz }}</td>
                <td>{{ stdev.rgyrz }}</td>
              </tr>
            </tbody>
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
      <FrameViewer :id="id" :frame="selectedFrame" ref="frameViewerRef" />
    </template>
  </PlotDialog>

  </div>
</template>

<script setup>

  const { id, type } = defineProps(['id', 'type'])
  const config = useRuntimeConfig()
  const { $rgyr } = useNuxtApp()
  
  const loading = ref(true)

  let data
  const dataAn = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/rgyr`)
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

  const mean = {
    rgyr: Number(data.value.data.rgyr.average.toFixed(2)),
    rgyrx: Number(data.value.data.rgyrx.average.toFixed(2)),
    rgyry: Number(data.value.data.rgyry.average.toFixed(2)),
    rgyrz: Number(data.value.data.rgyrz.average.toFixed(2))
  }
  const stdev = {
    rgyr: Number(data.value.data.rgyr.stddev.toFixed(2)),
    rgyrx: Number(data.value.data.rgyrx.stddev.toFixed(2)),
    rgyry: Number(data.value.data.rgyry.stddev.toFixed(2)),
    rgyrz: Number(data.value.data.rgyrz.stddev.toFixed(2)),
  }

  onMounted(async () => {

    // get data from REST API
    const rg = data.value.data.rgyr.data
    const rx = data.value.data.rgyrx.data
    const ry = data.value.data.rgyry.data
    const rz = data.value.data.rgyrz.data 

    const xd = Array.from({length: rg.length}, (_, i) => i * data.value.step)

    // load data & layout for timeseries plot
    plotData.val = [$rgyr.plot.data(xd, rg, 'Rgyr'), $rgyr.plot.data(xd, rx, 'RgyrX'), $rgyr.plot.data(xd, ry, 'RgyrY'), $rgyr.plot.data(xd, rz, 'RgyrZ')]
    plotLayout = $rgyr.plot.layout($rgyr.xtitle, $rgyr.ytitle)
    plotConfig = $rgyr.plot.config

  })

  const dialog = ref(false)
  const frameViewerRef = ref(null)
  const plotDialogRef = ref(null)
  const selectedFrame = ref(null)

  const myChartOnReady = (plotlyHTMLElement) => {

    // create double click logic
    let debounceTimeout
    let dclick = false
    plotlyHTMLElement.on?.('plotly_click', (e) => {
      debounceTimeout = setTimeout(async () => {
        if(!dclick) {
          dialog.value = true
          selectedFrame.value = e.points[0].x
          // set dialog title
          var title = `${$rgyr.title} :: Frame ${e.points[0].x}`
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
  #tbl-rgyr .v-table__wrapper table { table-layout: fixed; } 
</style>

<style scoped>
  #container-plot { 
    width:100%; 
    position: relative;
    display:flex; 
    justify-content: center; 
    align-items: center;
  }
  .even-row { background-color: #f5f5f5; }
</style>
  