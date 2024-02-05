<template>
  <v-tabs
    v-model="model_menu"
    show-arrows
    color="red-darken-4"
    grow
  >
    <v-tab :value="0">Rise</v-tab>
    <v-tab :value="1">Roll</v-tab>
    <v-tab :value="2">Shift</v-tab>
    <v-tab :value="3">Slide</v-tab>
    <v-tab :value="4">Tilt</v-tab>
    <v-tab :value="5">Twist</v-tab>
  </v-tabs>

  <v-window v-model="model_menu" class="elevation-2 pa-5" id="container-window">

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" id="rise" :stype="stype" :img="riseImg">
          <template #plot>
            <TimeSeriesHistogramPlot id="rise" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="1"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" id="roll" :stype="stype" :img="rollImg">
          <template #plot>
            <TimeSeriesHistogramPlot id="roll" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="2"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/inter-base-pair/shift.png" alt="Shift"  >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <TimeSeriesHistogramPlot id="shift"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/inter-base-pair/slide.png" alt="Slide"  >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <TimeSeriesHistogramPlot id="slide"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/inter-base-pair/tilt.png" alt="Tilt"  >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <TimeSeriesHistogramPlot id="tilt"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/inter-base-pair/twist.png" alt="Twist"  >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <TimeSeriesHistogramPlot id="twist"/>
        </v-col>
      </v-row>
    </v-window-item>

  </v-window>
</template>

<script setup>

  // vuetify images must be imported like this (and they cannot be imported in the AnalysisButton.vue component)
  import riseImg from '/img/projects/analyses/curves/inter-base-pair/rise.png'
  import rollImg from '/img/projects/analyses/curves/inter-base-pair/roll.png'

  const { label, stype } = defineProps(['label', 'stype'])

  // SECOND LEVEL MENU
  const model_menu = ref(0)

</script>

<style scoped>
  #container-window { height: 500px; }
</style>
