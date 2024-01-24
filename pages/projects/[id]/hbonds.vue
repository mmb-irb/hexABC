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

            <p>Click or drag the base pairs in the sequence below to show them in the heatmap plot. </p>

            <div id="container-strands" class="px-3">
            <v-range-slider
              v-model="range"
              :min="0"
              :max="200"
              step="1"
              thumb-label="always"
              @end="handleRangeChange"
              strict
              class="mt-8"
            ></v-range-slider>

            <v-row> 
              <v-col lg="9" md="9" sm="12" xs="12">

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
                      icon="mdi-window-close"
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

            <div v-else>
              <nuxt-plotly 
                :data="plotData.val"
                :layout="plotLayout"
                :config="plotConfig"
                style="width: 100%; height: 500px;"
                @on-ready="myChartOnReady"
              ></nuxt-plotly>

              <div v-if="pngImage" class="mt-4 px-5 d-flex justify-center">
                <img :src="pngImage" alt="Plot image" style="opacity: .5;">
              </div>

            </div>

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
  import usePlotsUtils from '@/modules/analysis/usePlotsUtils' 
  import useInteractiveSequence from '@/modules/analysis/useInteractiveSequence'
  import Plotly from 'plotly.js-dist-min';

  const { id } = useRoute().params
  const config = useRuntimeConfig()
  const { $plots } = useNuxtApp()

  const { getColorScale, getColorBarText, getHMUniqueValues } = usePlotsUtils()
  const { 
      getSequenceSettings,
      addBordersToBasePairs,
      removeBordersFromBasePairs
  } = useInteractiveSequence()

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

  // parse data resulting from the REST API in a format that can be used by plotly
  const getParsedHBonds = (hbs) => {
    let b = []
    let h = []
    
    hbs.forEach((hb) => {
      b.push(hb.bp)
      h.push(Object.values(hb.hbonds))
    })
    return {b, h}
  }

  /* RANGE SLIDER */
  /* TODO: START WORKING WITH RANGE SLIDER AND RANGE SELECTOR */

  const range = ref([0, 20]);
  const maxTotalRange = 20;

  const newRange = ref([0, 20])

  // Handle range change event and update range model
  const handleRangeChange = (e) => {
    range.value = newRange.value
  };

  watch(range, (oldr, newr) => {

    // if the range is too big, adjust it to the maxTotalRange
    if ((oldr[0] !== newr[0]) && (newr[1] - newr[0] > maxTotalRange)) {
      // If min has changed, adjust the max to fit within the limit
      if (range.value[1] - range.value[0] > maxTotalRange) {
        newRange.value = [range.value[0], range.value[0] + maxTotalRange]
      }
    } else if ((oldr[1] !== newr[1]) && (newr[1] - newr[0] > maxTotalRange)) {
      // If max has changed, adjust the min to fit within the limit
      if (range.value[1] - range.value[0] > maxTotalRange) {
        newRange.value = [range.value[1] - maxTotalRange, range.value[1]]
      }
    } 

    // if the range is too small, adjust it to the newr
    if((newr[1] - newr[0] <= maxTotalRange)) {
      newRange.value = [newr[0], newr[1]]
    }

  });

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

  const pngImage = ref(null);
  let plotData = reactive({
    val: []
  })
  let plotLayout = {}
  let plotConfig = {}
  const dataLoaded = ref(false)
  let colorscale = $plots.heatmap.colorscale

  let datahb = {}
  let numframes = 0
  let downSamplingFactor = 0
  onMounted(async () => {

    // provisional connection to REST API
    datahb = await useFetch(`${config.public.apiBase}/projects/analyses/hbonds`)
    numframes = datahb.data.value.frames
    downSamplingFactor = datahb.data.value.factor
    const parsedHBonds = getParsedHBonds(datahb.data.value.hbonds)
    const hbonds = parsedHBonds.h
    const bps = parsedHBonds.b

    dataLoaded.value = true

    const uniqueValues = getHMUniqueValues(hbonds)

    let scale = getColorScale(uniqueValues, colorscale)
    let cbtxt = getColorBarText(uniqueValues)

    // TODO: put all this logic in plugins / plot.js
    plotData.val = [{
      type: 'heatmap',
      z: hbonds,
      y: bps,
      x: Array.from({length: numframes}, (_, i) => i * downSamplingFactor),
      colorscale: scale,
      colorbar:{
        autotick: false,
        tick0: 0,
        thickness: 20,
        dtick: 1,
        ticklabelposition: 'outside',
        ypad: 1,
        title: '<br>number of hydrogen bonds',
        titleside: 'right',
        tickmode:"array",
        tickvals: uniqueValues,
        ticktext: cbtxt,
        
      },
      hovertemplate: 'bp: <b>%{y}</b>' +
                      '<br>frame <b>%{x}</b>' +
                      '<br>hbonds: <b>%{z}</b>' + 
                      '<extra></extra>',
    }]

    plotLayout = {
      title: null,
      hovermode: "closest",
      hoverlabel: { bgcolor: "#f9f9f9" },
      xaxis: {
        //range: [5, 10],
        tickformat: "d",
        title: {
          text: 'frame number',
          standoff: 20
        }
      },
      yaxis: {
        title: {
          text: 'base pair',
          standoff: 10
        }
      },
      margin: {
        l: 80,
        r: 0,
        b: 50,
        t: 20,
        pad: 4
      },
      annotations: {
        arrowcolor: '#f00000',
      }
    }

    plotConfig = { 
      scrollZoom: true, 
      displayModeBar: false, 
      responsive: true 
    }

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

      if(bps_sel.length == 0) bps_sel = bps.map((item) => `bp${item}`)
      else addBordersToBasePairs(bps_sel)

      const pureBps = bps_sel.map(item => item.replace(/^bp/, ''));
      loadBP(pureBps)

    });

  })

  let imageCreated = false
  const myChartOnReady = async (plotlyHTMLElement) => {

    if(!imageCreated) {
      
      // Create a copy of your data and layout
      const dataCopy = JSON.parse(JSON.stringify(plotData.val));
      const layoutCopy = JSON.parse(JSON.stringify(plotLayout));

      layoutCopy.height = 40;
      //layoutCopy.width = document.querySelectorAll(`.js-plotly-plot`)[0].clientWidth;
      // Remove the axes labels and color scale
      layoutCopy.xaxis.title = '';
      layoutCopy.yaxis.title = '';
      layoutCopy.xaxis.showticklabels = false;
      layoutCopy.yaxis.showticklabels = false;
      layoutCopy.margin = { l: 0, r: 0, b: 0, t: 0, pad: 0 }
      dataCopy.forEach(trace => {
        if (trace.colorbar) {
          trace.showscale = false;
        }
      });

      // Generate the image with the modified data and layout
      pngImage.value = await Plotly.toImage({
        data: dataCopy,
        layout: layoutCopy,
        format: 'png'
      });

      const image = new Image();
      image.onload = function() {
        //console.log(this.width, this.height);
        // here create slider with this width!!!!!!
      };
      image.src = pngImage.value;

      imageCreated = true
    }

    plotlyHTMLElement.on?.('plotly_click', (e) => {
      console.log(e.points[0].x, e.points[0].y, e.points[0].z);
    })
  }

  const loadBP = async(bs) => {
    const filteredData = datahb.data.value.hbonds.filter(item => bs.includes(item.bp))

    const parsedHBonds = getParsedHBonds(filteredData)
    const hbonds = parsedHBonds.h
    const bps = parsedHBonds.b

    const uniqueValues = getHMUniqueValues(hbonds)

    let scale = getColorScale(uniqueValues, colorscale)
    let cbtxt = getColorBarText(uniqueValues)

    // TODO: put all the logic in plugins / plot.js
    plotData.val = [{
        z: hbonds,
        y: bps,
        x: Array.from({length: numframes}, (_, i) => i * downSamplingFactor),
        type: 'heatmap',
        colorscale: scale,
        colorbar:{
          autotick: false,
          tick0: 0,
          thickness: 20,
          dtick: 1,
          ticklabelposition: 'outside',
          ypad: 1,
          title: '<br>number of hydrogen bonds',
          titleside: 'right',
          tickvals: uniqueValues,
          //tickmode:"array",
          ticktext: cbtxt,
          
        },
        hovertemplate: 'bp: <b>%{y}</b>' +
                        '<br>frame <b>%{x}</b>' +
                        '<br>hbonds: <b>%{z}</b>' + 
                        '<extra></extra>',
      }]
  }

  // STICKY CONTAINER STRANDS 
  let sticky = ref(true)
    const onScroll = () => {
      if(sticky.value === false) return

      if(document.querySelector("#container-strands").getBoundingClientRect().y <= 65) {
        document.querySelector("#container-strands").style.position = 'sticky'
        document.querySelector("#container-strands").style.top = '65px'
        document.querySelector("#container-strands").classList.add('elevation-3')
        document.querySelector("#sticky-disable").style.display = 'block'
      } else {
        document.querySelector("#container-strands").style.position = 'relative'
        document.querySelector("#container-strands").style.top = 'inherit'
        document.querySelector("#container-strands").classList.remove('elevation-3')
        document.querySelector("#sticky-disable").style.display = 'none'
      }
    }
    window.addEventListener('scroll', onScroll)    

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll)
    })

    const controlSticky = () => {
      sticky.value = !sticky.value
      if(sticky.value === false) {
        document.querySelector("#container-strands").style.position = 'relative'
        document.querySelector("#container-strands").style.top = 'inherit'
        document.querySelector("#container-strands").classList.remove('elevation-3')
        document.querySelector("#sticky-disable").style.display = 'none'
        document.querySelector("#sticky-enable").style.display = 'block'
      } else {        
        document.querySelector("#sticky-enable").style.display = 'none'
        if(document.querySelector("#container-strands").getBoundingClientRect().y <= 65) {
          document.querySelector("#container-strands").style.position = 'sticky'
          document.querySelector("#container-strands").style.top = '65px'
          document.querySelector("#container-strands").classList.add('elevation-3')
          document.querySelector("#sticky-disable").style.display = 'block'
        }
      }
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