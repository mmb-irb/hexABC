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

            <nuxt-plotly
              :data="heatmapPlot.data"
              :layout="heatmapPlot.layout"
              :config="heatmapPlot.config"
              style="width: 100%; height: 500px;"
              @on-ready="myChartOnReady"
            ></nuxt-plotly>

          </template>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { ref } from 'vue';

  const { id } = useRoute().params
  const config = useRuntimeConfig()

  const datap = await useFetch(`${config.public.apiBase}/projects/${id}`)
  const project = ref(datap.data.value.project)

  const title = project.value.metadata.NAME

  useHead({
    title: `HBonds for ${title}`,
  })

  // provisional connection to REST API
  const datahb = await useFetch(`${config.public.apiBase}/projects/analyses/hbonds`)
  const hbonds = datahb.data.value.hbonds
  const bps = datahb.data.value.bps

  const heatmapPlot = {

    data: reactive([{
      z: hbonds,
      y: bps,
      x: [1],
      type: 'heatmap',
      colorscale: [
        [0, '#000000'],
        [0.25, '#000000'], 
        [0.25, '#0224ab'],
        [0.5, '#0224ab'], 
        [0.5, '#018f12'],
        [0.75, '#018f12'], 
        [0.75, '#e8cf0e'],
        [1, '#e8cf0e']
      ],
      colorbar:{
        autotick: false,
        tick0: 0,
        thickness: 20,
        dtick: 1,
        ticklabelposition: 'outside',
        ypad: 1,
        title: '<br>number of hydrogen bonds',
        titleside: 'right',
        tickvals: [0 ,1, 2, 3],
        //tickmode:"array",
        ticktext: ["0<br><br><br><br><br><br><br>","1<br><br>","<br><br>2", "<br><br><br><br><br><br><br>3"],
        
      },
      hovertemplate: 'bp: <b>%{y}</b>' +
                      '<br>frame <b>%{x}</b><br>' +
                      '# of hbonds: <b>%{z}</b>' + 
                      '<extra></extra>',
    }]),

    layout: {
      title: null,
      hovermode: "closest",
      hoverlabel: { bgcolor: "#f9f9f9" },
      xaxis: {
        // review when we have a lot (try 100.000?)
        dtick: 1,
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
    },

    config: { 
      scrollZoom: true, 
      displayModeBar: false, 
      responsive: true 
    }

  }

  const myChartOnReady = (plotlyHTMLElement) => {
    plotlyHTMLElement.on?.('plotly_click', (e) => {
      console.log(e.points[0].x, e.points[0].y, e.points[0].z);
    })
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
</style>