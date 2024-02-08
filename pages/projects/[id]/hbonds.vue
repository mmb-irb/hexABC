<template>
  <v-container>

    <h1>Hydrogen Bonds</h1>

    <Breadcrumbs :props="{id: id, text: 'HBonds analyses', title: title}" />

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <div class="mdi-combined">
              <div class="mdi mdi-vector-line mdi-rotate-45 top">
              </div>
              <div class="mdi mdi-vector-line mdi-rotate-45 bottom">
              </div>
            </div>
            HYDROGEN BONDS
          </template>

          <template v-slot:text>

            <p><strong>Click or drag the base pairs</strong> in the sequence below to show them in the <strong>heatmap plot</strong>. Additionally, base pairs can be <strong>filtered by bonds</strong>, selecting <strong>number of bonds</strong> and <strong>percentage</strong> of this number in each <strong>base pair</strong>. The initial plot is a <strong>downsampled version</strong> of the original one showing one frame each <strong>1000ps</strong> for the sake of showing a <strong>big picture</strong> of the whole analysis. To browse through the plot <strong>in depth</strong> (seeing <strong>all the frames</strong> one by one), go below and <strong>enable the big resolution</strong> button.</p>

            <div id="container-strands" class="px-3">

              <v-row> 
                <v-col lg="9" md="9" sm="12" xs="12">

                  <SequenceInteractiveBps 
                    :strandsObj="{ strands: strands, strand1: strand1, strand2: strand2 }" 
                    :ends="{ ends1: ends1, ends2: ends2 }" 
                    :sequence="sequence"
                    @dsEnd="handleDsEnd" 
                    @dsStart="handleDsStart" 
                    ref="seqIntBpsRef"
                  />

                </v-col>

                <v-col lg="3" md="3" sm="12" xs="12" class="">

                  <FilterByHBonds 
                    @fltrBHbs="handleFilterByHbonds"
                    ref="filtByHBondsRef"
                  />

                </v-col>

                <StickyDisable @cSticky="controlSticky" />

              </v-row> 
            </div>

            <div v-if="!dataLoaded" style="width:100%; height:100px; display:flex; justify-content: center; align-items: center;">
              <v-progress-linear
                indeterminate
                color="red-darken-4"
              ></v-progress-linear>
            </div>

            <HeatmapHBonds v-else :pd="plotData" :nf="numframes" :id="id" @callParent="loadData" />

          </template>
        </v-card>
      </v-col>

      <StickyEnable @cSticky="controlSticky" />

    </v-row>

  </v-container>

  <v-snackbar
    v-model="snackbar"
    :timeout="3000"
    color="amber-darken-2"
    elevation="4"
  >
    {{ textSnackbar }}
  </v-snackbar>
</template>

<script setup>

  import useHeatmapUtils from '@/modules/analysis/useHeatmapUtils' 
  import useInteractiveSequence from '@/modules/analysis/useInteractiveSequence'
  import useScroll from '@/modules/analysis/useScroll' 

  const { id } = useRoute().params
  const config = useRuntimeConfig()
  const { $hbonds } = useNuxtApp()

  const { 
    getParsedHBonds,
    getColorScale, 
    getColorBarText, 
    getHMUniqueValues, 
    downSamplingAxis,
    percentageOfValueInArray,
    getPlotHbondsData
  } = useHeatmapUtils()
  const { 
      getSequenceSettings,
      addBordersToBasePairs,
      removeBordersFromBasePairs
  } = useInteractiveSequence()
  const { scrolling, ctrlSticky } = useScroll()

  const datap = await useFetch(`${config.public.apiBase}/projects/${id}`)
  if(datap.status.value === 'error')  throw createError({ statusCode: datap.error.value.statusCode, message: datap.error.value.statusMessage, fatal: true })
  const project = ref(datap.data.value)

  const title = project.value.metadata.NAME

  useHead({
    title: `HBonds for ${title}`,
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@200;500&display=swap' }
      ]
  })

  // get data from REST API
  const getHbondsData = async(from = null, to = null) => {
    let d

    if(from === null || to === null) d = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/hbonds`)
    else d = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/hbonds?from=${from}&to=${to}`)

    const nfs = d.data.value.frames
    const ds = d.data.value.factor
    const phbonds = getParsedHBonds(d.data.value.hbonds)
    const nbs = phbonds.h
    const bs = phbonds.b
    const xvls = downSamplingAxis(nfs, ds)

    return { nfs: nfs, dfs: ds, hbonds: nbs, bs: bs, xvals: xvls, rhbonds: d.data.value.hbonds }
  }

  /* MAGIC SEQUENCE */

  const sequence = project.value.metadata.SEQUENCES[0]
  const { strand1, strand2, ends1, ends2 } = getSequenceSettings(sequence)
  const strands = [];
  const seqIntBpsRef = ref(null)

  for (let i = 0; i < Math.min(strand1.length, strand2.length); i++) {
    strands.push([strand1[i], strand2[i]]);
  }

  const handleDsStart = () => {
    removeBordersFromBasePairs()
  }

  const handleDsEnd = (items) => {
    let bps_sel = items.map((item) => item.id )

    if(bps_sel.length == 0) {
      bps_sel = bps.value.map((item) => `bp${item}`)
      filteredBps.status = false
    } else {
      addBordersToBasePairs(bps_sel)
      filteredBps.status = true
    }

    hbondsSel.value = null

    const pureBps = bps_sel.map(item => item.replace(/^bp/, ''));
    filteredBps.val = pureBps

    const filteredData = rawHbonds.value.filter(item => pureBps.includes(item.bp))

    plotData.val = getPlotHbondsData(filteredData, numframes, downSamplingFactor, colorscale, $hbonds)

  }

  /* FILTER BY HBONDS */

  const snackbar = ref(false)
  const textSnackbar = ref('')
  // hbondsSel is a model inside FilterByHBonds component
  const hbondsSel = computed({
    get() {
      return filtByHBondsRef.value.hbondsSel
    },
    set(value) {
      filtByHBondsRef.value.hbondsSel = value
    }
  })
  // sliderHbonds is a model inside FilterByHBonds component
  const sliderHbonds = computed({
    get() {
      return filtByHBondsRef.value.sliderHbonds
    },
    set(value) {
      filtByHBondsRef.value.sliderHbonds = value
    }
  })
  const filtByHBondsRef = ref(null)

  const resetWhenNoResults = () => {
    snackbar.value = true
    ds.clearSelection()
    removeBordersFromBasePairs()
    filteredBps.status = false
  }

  const handleFilterByHbonds = () => {
    console.log(hbondsSel.value, sliderHbonds.value)
    let fBps = []
    let empty = false
    if(hbondsSel.value !== null && hbondsSel.value !== undefined) {
      if(sliderHbonds.value === 0) {
        fBps = rawHbonds.value.filter(item => !item.hbonds.includes(hbondsSel.value));
      } else {
        fBps = rawHbonds.value.filter(item => item.hbonds.includes(hbondsSel.value) && percentageOfValueInArray(item.hbonds, hbondsSel.value) >= sliderHbonds.value*100);
      }

      if(fBps.length === 0) {
        resetWhenNoResults()
        empty = true
        fBps = rawHbonds.value
        textSnackbar.value = 'No results for this selection'
      }

      if(fBps.length > 0) {
        
        plotData.val = getPlotHbondsData(fBps, numframes, downSamplingFactor, colorscale, $hbonds)

        if(!empty) {
          const itemsToSelect = fBps.map((item) => document.querySelector(`#bp${item.bp}`));
          
          ds.clearSelection();
          ds.addSelection(itemsToSelect);

          const bps_sel = itemsToSelect.map((item) => item.id )

          removeBordersFromBasePairs()
          addBordersToBasePairs(bps_sel)

          filteredBps.status = true

          const pureBps = bps_sel.map(item => item.replace(/^bp/, ''));
          filteredBps.val = pureBps

        }

      }

    } else {
      snackbar.value = true
      textSnackbar.value = 'Please select a number of hbonds'

      if(rawHbonds.value.length > 0) {
        resetWhenNoResults()
        empty = true
        fBps = rawHbonds.value
        plotData.val = getPlotHbondsData(fBps, numframes, downSamplingFactor, colorscale, $hbonds)
      }
    }

  }

  /* GLOBAL VARIABLES */

  let plotData = reactive({
    val: []
  })
  const dataLoaded = ref(false)
  let colorscale = $hbonds.colorscale

  let hbs = ref(null)
  let bps = ref(null)
  let numframes = ref(0)
  let downSamplingFactor = ref(0)
  let rawHbonds = ref(null)
  let filteredBps = reactive({
    status :false,
    val: null
  })
  let ds
  onMounted(async () => {

    // provisional connection to REST API
    const { nfs, dfs, hbonds, bs, xvals, rhbonds } = await getHbondsData()
    hbs.value = hbonds
    bps.value = bs
    numframes.value = nfs
    downSamplingFactor.value = dfs
    rawHbonds.value = rhbonds

    dataLoaded.value = true

    /* PLOTLY */

    // get unique values for the color bar
    const cbVals = getHMUniqueValues(hbonds)
    // get color scale and color bar text
    let cscale = getColorScale(cbVals, colorscale)
    let cbTxt = getColorBarText(cbVals)

    // load plot data
    plotData.val = $hbonds.data(hbonds, bps, xvals, cscale, cbVals, cbTxt)

    /* DRAG SELECT */

    ds = seqIntBpsRef.value.getDragSelect()

  }) 

  /* HEATMAP */

  // load data from HeatmapHBonds component with the range values
  const loadData = async (d1, d2) => {
    let d
    if(d1 === null || d2 === null) {
      d = await getHbondsData()
    } else {
      d = await getHbondsData(d1, d2)
    }

    hbs.value = d.hbonds
    bps.value = d.bs
    numframes.value = d.nfs
    downSamplingFactor.value = d.dfs
    rawHbonds.value = d.rhbonds

    // check if filtered is active and filter rawHbonds
    let loadHbonds = d.hbonds
    let loadBps = d.bs
    if(filteredBps.status) {
      const filteredData = rawHbonds.value.filter(item => filteredBps.val.includes(item.bp))

      const parsedHBonds = getParsedHBonds(filteredData)
      loadHbonds = parsedHBonds.h
      loadBps = parsedHBonds.b
    }

    dataLoaded.value = true

    // get unique values for the color bar
    const cbVals = getHMUniqueValues(loadHbonds)
    // get color scale and color bar text
    let cscale = getColorScale(cbVals, colorscale)
    let cbTxt = getColorBarText(cbVals)

    // load plot data
    plotData.val = $hbonds.data(loadHbonds, loadBps, d.xvals, cscale, cbVals, cbTxt)

  }

  // STICKY CONTAINER STRANDS 
  let sticky = ref(true)
  const onScroll = () => {
    if(sticky.value === false) return
    scrolling('#container-strands', '#sticky-disable')
  }

  window.addEventListener('scroll', onScroll)    

  onUnmounted(() => window.removeEventListener('scroll', onScroll))

  const controlSticky = () => {
    sticky.value = !sticky.value
    ctrlSticky(sticky.value, '#container-strands', '#sticky-disable', '#sticky-enable')
  }

</script>

<style>
  @media only screen and (max-width: 1280px) {
    .v-btn--icon.v-btn--density-default { width: 44px;}
  }
</style>

<style scoped>
  .v-btn-group { color:#546E7A; }
  .mdi-combined {
    position: relative;
    display: inline-block;
    width: 2rem;
    height: 2rem;
    margin-right: 0rem;
    margin-top:-1rem;
  }
  .mdi-combined .mdi.top {
    top:.3rem;
  }
  .mdi-combined .mdi.bottom{
    top:.9rem;
    color:var(--nucl-dis);
  }
  .mdi-combined .mdi {
    position: absolute;
    left: 0;
    top: 0;
    font-size:1.5rem;
  }

  #container-strands {
    position:sticky; 
    z-index:10;
    background: #fff;
  }
  /* for making sticky working */
  .v-card {
    overflow: inherit !important;  
  }

</style>