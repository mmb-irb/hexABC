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
        <CurvesPlot style="z-index:2" :label="label" type="rise" :stype="stype" :img="riseImg">
          <template #plot>
            <!-- TODO: ADD id, seq and nucl -->
            <TimeSeriesHistogramPlot :id="id" type="rise" :seq="label" :nucl="nucl" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="1"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" type="roll" :stype="stype" :img="rollImg">
          <template #plot>
            <!-- TODO: ADD id, seq and nucl -->
            <TimeSeriesHistogramPlot :id="id" type="roll" :seq="label" :nucl="nucl" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="2"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" type="shift" :stype="stype" :img="shiftImg">
          <template #plot>
            <!-- TODO: ADD id, seq and nucl -->
            <TimeSeriesHistogramPlot type="shift" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="3">
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" type="slide" :stype="stype" :img="slideImg">
          <template #plot>
            <!-- TODO: ADD id, seq and nucl -->
            <TimeSeriesHistogramPlot type="slide" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="3">
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" type="tilt" :stype="stype" :img="tiltImg">
          <template #plot>
            <!-- TODO: ADD id, seq and nucl -->
            <TimeSeriesHistogramPlot type="tilt" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" type="twist" :stype="stype" :img="twistImg">
          <template #plot>
            <!-- TODO: ADD id, seq and nucl -->
            <TimeSeriesHistogramPlot type="twist" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

  </v-window>
</template>

<script setup>

  // vuetify images must be imported like this (and they cannot be imported in the AnalysisButton.vue component)
  import riseImg from '/img/projects/analyses/curves/inter-base-pair/rise.png'
  import rollImg from '/img/projects/analyses/curves/inter-base-pair/roll.png'
  import shiftImg from '/img/projects/analyses/curves/inter-base-pair/shift.png'
  import slideImg from '/img/projects/analyses/curves/inter-base-pair/slide.png'
  import tiltImg from '/img/projects/analyses/curves/inter-base-pair/tilt.png'
  import twistImg from '/img/projects/analyses/curves/inter-base-pair/twist.png'

  const { id, label, stype, nucl } = defineProps(['id', 'label', 'stype', 'nucl'])

  // SECOND LEVEL MENU
  const model_menu = ref(0)

</script>

<style scoped>
  #container-window { height: 500px; }
</style>
