<template>
  <v-tabs
    v-model="model_menu"
    show-arrows
    color="red-darken-4"
    grow
  >
    <v-tab :value="0">BI / BII Population</v-tab>
    <v-tab :value="1">Canonical Alpha-Gamma</v-tab>
    <v-tab :value="2">Puckering</v-tab>
  </v-tabs>

  <v-window v-model="model_menu" class="elevation-2 pa-5" id="container-window">

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" id="bibiipopulation" :img="bibiipopulationImg">
          <template #plot>
            <StackedHistogramPlot id="bibiipopulation"/>
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="1"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" id="canonicalag" :img="canonicalagImg">
          <template #plot>
            <StackedHistogramPlot id="canonicalag"/>
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="2"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" id="puckering" :img="puckeringImg">
          <template #plot>
            <StackedHistogramPlot id="puckering"/>
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

  </v-window>
</template>

<script setup>

  // vuetify images must be imported like this (and they cannot be imported in the AnalysisButton.vue component)
  import bibiipopulationImg from '/img/projects/analyses/curves/backbone/BI-BII.png'
  import canonicalagImg from '/img/projects/analyses/curves/backbone/alpha-gamma.png'
  import puckeringImg from '/img/projects/analyses/curves/backbone/puckering.png'

  // SECOND LEVEL MENU
  const model_menu = ref(0)

</script>

<style scoped>
  #container-window { height: 500px; }
</style>
