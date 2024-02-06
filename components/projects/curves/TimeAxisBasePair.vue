<template>
  <v-tabs
    v-model="model_menu"
    show-arrows
    color="red-darken-4"
    grow
  >
    <v-tab :value="0">Inclination</v-tab>
    <v-tab :value="1">Tip</v-tab>
    <v-tab :value="2">X-Displacement</v-tab>
    <v-tab :value="3">Y-Displacement</v-tab>
  </v-tabs>

  <v-window v-model="model_menu" class="elevation-2 pa-5" id="container-window">

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" id="inclination" :stype="stype" :img="inclinationImg">
          <template #plot>
            <TimeSeriesHistogramPlot id="inclination" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="1"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" id="tip" :stype="stype" :img="tipImg">
          <template #plot>
            <TimeSeriesHistogramPlot id="tip" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="2"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" id="xdisp" :stype="stype" :img="xdispImg">
          <template #plot>
            <TimeSeriesHistogramPlot id="xdisp" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" id="ydisp" :stype="stype" :img="ydispImg">
          <template #plot>
            <TimeSeriesHistogramPlot id="ydisp" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

  </v-window>
</template>

<script setup>

  // vuetify images must be imported like this (and they cannot be imported in the AnalysisButton.vue component)
  import inclinationImg from '/img/projects/analyses/curves/base-pair/inclination.png'
  import tipImg from '/img/projects/analyses/curves/base-pair/tip.png'
  import xdispImg from '/img/projects/analyses/curves/base-pair/xdisp.png'
  import ydispImg from '/img/projects/analyses/curves/base-pair/ydisp.png'
  
  const { label, stype } = defineProps(['label', 'stype'])

  // SECOND LEVEL MENU
  const model_menu = ref(0)

</script>

<style scoped>
  #container-window { height: 500px; }
</style>
