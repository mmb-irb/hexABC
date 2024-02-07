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
        <CurvesPlot style="z-index:2" :label="label" type="alpha" :stype="stype" :img="alphaImg">
          <template #plot>
            <!-- TODO: ADD id, seq and nucl -->
            <TimeSeriesHistogramPlot type="alpha" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" type="beta" :stype="stype" :img="betaImg">
          <template #plot>
            <!-- TODO: ADD id, seq and nucl -->
            <TimeSeriesHistogramPlot type="beta" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" type="gamma" :stype="stype" :img="gammaImg">
          <template #plot>
            <!-- TODO: ADD id, seq and nucl -->
            <TimeSeriesHistogramPlot type="gamma" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" type="delta" :stype="stype" :img="deltaImg">
          <template #plot>
            <!-- TODO: ADD id, seq and nucl -->
            <TimeSeriesHistogramPlot type="delta" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" type="chi" :stype="stype" :img="chiImg">
          <template #plot>
            <!-- TODO: ADD id, seq and nucl -->
            <TimeSeriesHistogramPlot type="chi" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" type="epsilon" :stype="stype" :img="epsilonImg">
          <template #plot>
            <!-- TODO: ADD id, seq and nucl -->
            <TimeSeriesHistogramPlot type="epsilon" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" :label="label" type="theta" :stype="stype" :img="thetaImg">
          <template #plot>
            <!-- TODO: ADD id, seq and nucl -->
            <TimeSeriesHistogramPlot type="theta" />
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
  
  const { id, label, stype, nucl } = defineProps(['id', 'label', 'stype', 'nucl'])

  // SECOND LEVEL MENU
  const model_menu = ref(0)
  
</script>

<style scoped>
  #container-window { height: 500px; }
</style>
