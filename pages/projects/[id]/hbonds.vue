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

            <p><strong>Click or drag the base pairs</strong> in the sequence below to show them in the <strong>heatmap plot</strong>. Additionally, base pairs can be <strong>filtered by bonds</strong>. The plot is a <strong>downsampled version</strong> of the original one showing one frame each <strong>{{ downSamplingFactor }}ps</strong> for the sake of showing a <strong>big picture</strong> of the whole analysis. To browse through the plot <strong>in depth</strong> (seeing <strong>all the frames</strong> one by one), go below and <strong>enable the big resolution</strong> button.</p>

            <div id="container-strands" class="px-3">

              <v-row> 
                <v-col lg="9" md="9" sm="12" xs="12">
                  <!-- TODO: TRY TO PUT ALL THE DIFFERENT MAGIC SEQUENCES (AND ALL THEIR LOGIC???) INTO COMPONENTS -->
                  <v-sheet
                    color="grey-lighten-4"
                    class="pa-10 project-sheet"
                    id="container-strands-sheet"
                  >
                    <v-row class="project-row" justify="center">
                      <div 
                        class="number" 
                        v-for="(item, index) in strand1"
                        :key="index"
                        :value="index"
                        > {{ index + 1 }} </div>
                    </v-row>
                    <v-row class="pb-0 pt-2 px-4 project-row" justify="space-around">
                      <div class="d-flex">
                        <div class="end" style="left: -20px;"> 
                          <div>{{ ends1[0] }}</div> 
                          <div class="mt-4">{{ ends1[1] }}</div> 
                        </div>
                        <div 
                          class="base-pair" 
                          v-for="(item, index) in strands"
                          :key="index"
                          :value="index"
                          :id="`bp${index + 1}${item[0]}${strands.length*2 - index}${item[1]}`"
                          > 
                          <div class="flex">
                            <div class="nucleotide">{{ item[0] }}</div> 
                            <div class="nucleotide">{{ item[1] }}</div>
                          </div> 
                        </div>
                        <div class="end" style="left: 20px;"> 
                          <div>{{ ends2[0] }}</div> 
                          <div class="mt-4">{{ ends2[1] }}</div> 
                        </div>
                      </div>
                    </v-row>
                    <v-row class="project-row" justify="center">
                      <div 
                        class="number mt-3" 
                        v-for="(item, index) in strand2"
                        :key="index"
                        :value="index"
                        > {{ strand2.length*2 - index }} </div>
                    </v-row>
                  </v-sheet>

                </v-col>

                <v-col lg="3" md="3" sm="12" xs="12">
                  <v-btn-toggle
                    v-model="hbondsSel"
                    rounded="0"
                    color="red-darken-4"
                    group
                    divided
                    multiple
                    variant="outlined"
                  >
                    <v-btn icon="mdi-numeric-0-circle"></v-btn>
                    <v-btn icon="mdi-numeric-1-circle"></v-btn>
                    <v-btn icon="mdi-numeric-2-circle"></v-btn>
                    <v-btn icon="mdi-numeric-3-circle"></v-btn>
                  </v-btn-toggle>
                </v-col>

                <div id="sticky-disable">
                  <v-tooltip text="Disable sticky" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-btn 
                        v-bind="props" 
                        density="compact" 
                        id="btn-sticky-disable" 
                        color="blue-grey-lighten-4" 
                        variant="flat" 
                        icon="mdi-arrow-expand-up"
                        @click="controlSticky"
                      ></v-btn>
                    </template>
                  </v-tooltip>
                </div>
              </v-row> 
            </div>

            <div v-if="!dataLoaded" style="width:100%; height:100px; display:flex; justify-content: center; align-items: center;">
              <v-progress-linear
                indeterminate
                color="red-darken-4"
              ></v-progress-linear>
            </div>

            <HeatmapHBonds v-else :pd="plotData" :nf="numframes" @callParent="loadData" />

          </template>
        </v-card>
      </v-col>

      <div id="sticky-enable">
          <v-tooltip text="Enable sticky" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn 
                v-bind="props" 
                density="compact" 
                id="btn-sticky-enable" 
                color="blue-grey-lighten-4" 
                icon="mdi-chevron-double-down"
                @click="controlSticky"
              ></v-btn>
            </template>
          </v-tooltip>
        </div>

    </v-row>

  </v-container>
</template>

<script setup>

  import DragSelect from 'dragselect'
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

  const getHbondsData = async(from = null, to = null) => {
    let d

    if(!from && !to) d = await useFetch(`${config.public.apiBase}/projects/${id}/analyses/hbonds`)
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

  for (let i = 0; i < Math.min(strand1.length, strand2.length); i++) {
    strands.push([strand1[i], strand2[i]]);
  }

  /* SELECT BY HBONDS */

  const hbondsSel = ref([0, 1, 2, 3])

  /* HEATMAP */

  let plotData = reactive({
    val: []
  })
  const dataLoaded = ref(false)
  let colorscale = $hbonds.colorscale

  //let datahb = {}
  let hbs = ref(null)
  let bps = ref(null)
  let numframes = ref(0)
  let downSamplingFactor = ref(0)
  let rawHbonds = ref(null)
  onMounted(async () => {

    // provisional connection to REST API
    const { nfs, dfs, hbonds, bs, xvals, rhbonds } = await getHbondsData()
    /*numframes = datahb.data.value.frames
    downSamplingFactor = datahb.data.value.factor
    const parsedHBonds = getParsedHBonds(datahb.data.value.hbonds)
    const hbonds = parsedHBonds.h
    const bps = parsedHBonds.b
    const xvals = downSamplingAxis(numframes, downSamplingFactor)*/
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

    const ds = new DragSelect({
      selectables: document.getElementsByClassName("base-pair"),
      area: document.getElementById("container-strands-sheet"),
      draggability: false,
      multiSelectKeys: ['Shift']
    });

    ds.subscribe("DS:start", (e) => {
      console.log('selection started');
      removeBordersFromBasePairs()
    });

    ds.subscribe("DS:end", ({items}) => {
     
      let bps_sel = items.map((item) => item.id )

      if(bps_sel.length == 0) bps_sel = bps.value.map((item) => `bp${item}`)
      else addBordersToBasePairs(bps_sel)

      const pureBps = bps_sel.map(item => item.replace(/^bp/, ''));
      loadBP(pureBps)

    });

  })

  const loadBP = async(bs) => {
    const filteredData = rawHbonds.value.filter(item => bs.includes(item.bp))

    const parsedHBonds = getParsedHBonds(filteredData)
    const hbonds = parsedHBonds.h
    const bps = parsedHBonds.b
    const xvals = downSamplingAxis(numframes.value, downSamplingFactor.value)

    // get unique values for the color bar
    const cbVals = getHMUniqueValues(hbonds)
    // get color scale and color bar text
    let cscale = getColorScale(cbVals, colorscale)
    let cbTxt = getColorBarText(cbVals)

    plotData.val = $hbonds.data(hbonds, bps, xvals, cscale, cbVals, cbTxt)
  }


  /************** */
  // take a look to fix that a little bit
  // TODO: loadData taking into account the selectes base pairs in the magic sequence
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

    dataLoaded.value = true

    // get unique values for the color bar
    const cbVals = getHMUniqueValues(d.hbonds)
    // get color scale and color bar text
    let cscale = getColorScale(cbVals, colorscale)
    let cbTxt = getColorBarText(cbVals)

    // load plot data
    plotData.val = $hbonds.data(d.hbonds, bps, d.xvals, cscale, cbVals, cbTxt)
    //console.log('plotData', plotData.val)

  }
  /************** */

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

<style scoped>
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
  .base-pair {
    color: var(--palette-6);
    margin-right: 1px;
  }
  .nucleotide {
    font-family: 'Roboto Mono', monospace;
    font-size: 1.5rem;
    line-height: 1.6rem;
    font-weight: 500;
    padding: .5rem .5rem;
    margin: 0;
    /*color: var(--palette-6);*/
    user-select: none; 
  }
  .number {
    font-family: monospace;
    font-size: .75rem;
    width: 1.98rem;
    text-align: center;
    color: var(--palette-2);
    user-select: none; 
    line-height: .2rem;
  }
  .end {
    display:flex; 
    flex-direction: column;
    font-family: 'Roboto Mono', monospace;
    font-size: 1.25rem;
    font-weight: 200;
    color: var(--strand-end);
    user-select: none; 
    padding: .75rem 0;
    position: relative;
  }
  .base-pair.selected { box-shadow: inset 0 0 0 1px var(--palette-2); }
  .ds-selected {
      background-color: var(--light-text);
      color: var(--palette-4);
    }
  .project-sheet{ overflow: hidden;}

  #sticky-disable { position: absolute; right: -.8rem; bottom: -.8rem; display: none; }
  #sticky-enable { position: fixed; top: 55px; right:0px; display: none; }
  #btn-sticky-disable, #btn-sticky-enable { color: #fff!important; }
  #btn-sticky-disable { font-size: 12px!important; }

  @media only screen and (max-width: 1280px) {
    .nucleotide { padding: .3rem 0.35rem; }
    .number { width: 1.68rem; }
    .end { padding: .5rem 0; font-size: 1.2rem; }
    .project-sheet{ overflow-x: auto;}
    .project-row { min-width: 630px; }
    /*.v-btn-group .v-btn { padding: .44rem .2rem; }*/
  }

  @media only screen and (max-width: 960px) {
    /*.v-btn-group {
      flex-direction: inherit;
      overflow: scroll !important;
    }
    .v-btn-group .v-btn { padding: .44rem .35rem; }*/
  }
</style>