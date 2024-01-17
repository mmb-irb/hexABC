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

            <p>Lorem ipsum dolor <strong>Hydrogen Bonds</strong> sit amet consectetur adipisicing <strong>20mer sequence</strong> elit. Modi illo odio molestias consectetur <strong>500.000 frames</strong> odit ex aut id quidem fuga dolores.</p>

            <!--<v-btn
              color="red-accent-4"
              @click="loadBP(['1G40C'])" 
              >
              1G40C
            </v-btn>

            <v-btn
              class="ml-2"
              color="red-accent-4"
              @click="loadBP(['2C39G', '3A38T', '9G32C'])" 
              >
              2C39G 3A38T 9G32C
            </v-btn>-->

            <v-row id="container-strands"> 
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
                    <!--<div class="end"> {{ ends1[0] }} </div>-->
                    <div class="d-flex">
                      <div 
                      class="base-pair" 
                      v-for="(item, index) in strands"
                      :key="index"
                      :value="index"
                      :id="`${item[0]}-${item[1]}-${index + 1}-strand1`"
                      > <div class="flex">
                          <div>{{ item[0] }}</div> 
                          <div>{{ item[1] }}</div>
                        </div> 
                      </div>
                    </div>
                    <!--<div class="end"> {{ ends2[1] }} </div>-->
                  </v-row>
                  <v-row class="project-row" justify="center">
                    <div 
                      class="number" 
                      v-for="(item, index) in strand2"
                      :key="index"
                      :value="index"
                      > {{ strand2.length*2 - index }} </div>
                  </v-row>
                </v-sheet>

              </v-col>
            </v-row> 

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
            </div>

          </template>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { ref } from 'vue';

  import usePlotsUtils from '@/modules/analysis/usePlotsUtils' 
  import useInteractiveSequence from '@/modules/analysis/useInteractiveSequence' 

  const { id } = useRoute().params
  const config = useRuntimeConfig()
  const { $plots } = useNuxtApp()

  const { getColorScale, getColorBarText, getHMUniqueValues } = usePlotsUtils()
  const { 
      getSequenceSettings
  } = useInteractiveSequence()

  const datap = await useFetch(`${config.public.apiBase}/projects/${id}`)
  const project = ref(datap.data.value.project)

  const title = project.value.metadata.NAME

  useHead({
    title: `HBonds for ${title}`,
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

  /* MAGIC SEQUENCE */

  const sequence = project.value.metadata.SEQUENCES[0]
  const { strand1, strand2, ends1, ends2 } = getSequenceSettings(sequence)
  const strands = [];

  for (let i = 0; i < Math.min(strand1.length, strand2.length); i++) {
    strands.push([strand1[i], strand2[i]]);
  }

  /* HEATMAP */

  let plotData = reactive({
    val: []
  })
  let plotLayout = {}
  let plotConfig = {}
  const dataLoaded = ref(false)
  let colorscale = $plots.heatmap.colorscale

  let datahb = {}
  onMounted(async () => {

    // provisional connection to REST API
    datahb = await useFetch(`${config.public.apiBase}/projects/analyses/hbonds`)
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
      //x: [1],
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

  })

  const myChartOnReady = (plotlyHTMLElement) => {
    plotlyHTMLElement.on?.('plotly_click', (e) => {
      console.log(e.points[0].x, e.points[0].y, e.points[0].z);
    })
  }

  /*const loadBP = async(bs) => {
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
        x: [1],
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
  }*/

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
</style>