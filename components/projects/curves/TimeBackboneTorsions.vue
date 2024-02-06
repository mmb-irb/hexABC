<template>
  <v-tabs
    v-model="model_menu"
    show-arrows
    color="red-darken-4"
    grow
  >
    <v-tab :value="0">Alpha</v-tab>
    <v-tab :value="1">Beta</v-tab>
    <v-tab :value="2">Gamma</v-tab>
    <v-tab :value="3">Delta</v-tab>
    <v-tab :value="4">Chi</v-tab>
    <v-tab :value="5">Epsilon</v-tab>
    <v-tab :value="6">Theta</v-tab>
  </v-tabs>

  <v-window v-model="model_menu" class="elevation-2 pa-5" id="container-window">

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" id="alpha" :stype="stype" :img="alphaImg">
          <template #plot>
            <TimeSeriesHistogramPlot id="alpha" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" id="beta" :stype="stype" :img="betaImg">
          <template #plot>
            <TimeSeriesHistogramPlot id="beta" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" id="gamma" :stype="stype" :img="gammaImg">
          <template #plot>
            <TimeSeriesHistogramPlot id="gamma" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" id="delta" :stype="stype" :img="deltaImg">
          <template #plot>
            <TimeSeriesHistogramPlot id="delta" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" id="chi" :stype="stype" :img="chiImg">
          <template #plot>
            <TimeSeriesHistogramPlot id="chi" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" id="epsilon" :stype="stype" :img="epsilonImg">
          <template #plot>
            <TimeSeriesHistogramPlot id="epsilon" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" id="theta" :stype="stype" :img="thetaImg">
          <template #plot>
            <TimeSeriesHistogramPlot id="theta" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

  </v-window>
</template>

<script setup>

  // vuetify images must be imported like this (and they cannot be imported in the AnalysisButton.vue component)
  import alphaImg from '/img/projects/analyses/curves/backbone/alpha-torsions.png'
  import betaImg from '/img/projects/analyses/curves/backbone/beta-torsions.png'
  import gammaImg from '/img/projects/analyses/curves/backbone/gamma-torsions.png'
  import deltaImg from '/img/projects/analyses/curves/backbone/delta-torsions.png'
  import chiImg from '/img/projects/analyses/curves/backbone/chi-torsions.png'
  import epsilonImg from '/img/projects/analyses/curves/backbone/epsilon-torsions.png'
  import thetaImg from '/img/projects/analyses/curves/backbone/theta-torsions.png'
  
  const { label, stype } = defineProps(['label', 'stype'])

  // SECOND LEVEL MENU
  const model_menu = ref(0)
  
</script>

<style scoped>
  #container-window { height: 500px; }
</style>
