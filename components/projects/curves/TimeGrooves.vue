<template>
  <v-tabs
    v-model="model_menu"
    show-arrows
    color="red-darken-4"
    grow
  >
    <v-tab :value="0">Major Groove Depth</v-tab>
    <v-tab :value="1">Major Groove Width</v-tab>
    <v-tab :value="2">Minor Groove Depth</v-tab>
    <v-tab :value="3">Minor Groove Width</v-tab>
  </v-tabs>

  <v-window v-model="model_menu" class="elevation-2 pa-5" id="container-window">

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" id="majorgd" :stype="stype" :img="majorImg">
          <template #plot>
            <TimeSeriesHistogramPlot id="majorgd" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="1"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" id="majorgw" :stype="stype" :img="majorImg">
          <template #plot>
            <TimeSeriesHistogramPlot id="majorgw" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="2"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" id="minorgd" :stype="stype" :img="minorImg">
          <template #plot>
            <TimeSeriesHistogramPlot id="minorgd" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" id="minorgw" :stype="stype" :img="minorImg">
          <template #plot>
            <TimeSeriesHistogramPlot id="minorgw" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

  </v-window>
</template>

<script setup>

  // vuetify images must be imported like this (and they cannot be imported in the AnalysisButton.vue component)
  import majorImg from '/img/projects/analyses/curves/grooves/major.png'
  import minorImg from '/img/projects/analyses/curves/grooves/minor.png'

  const { label, stype } = defineProps(['label', 'stype'])

  // SECOND LEVEL MENU
  const model_menu = ref(0)

</script>

<style scoped>
  #container-window { height: 500px; }
</style>
