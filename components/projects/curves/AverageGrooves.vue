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
        <CurvesPlot style="z-index:2" id="majorgd" :img="majorImg">
          <template #plot>
            <ErrorBarsPlot id="majorgd" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="1"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" id="majorgw" :img="majorImg">
          <template #plot>
            <ErrorBarsPlot id="majorgw" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="2"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" id="minorgd" :img="minorImg">
          <template #plot>
            <ErrorBarsPlot id="minorgd" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" id="minorgw" :img="minorImg">
          <template #plot>
            <ErrorBarsPlot id="minorgw" />
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

  // SECOND LEVEL MENU
  const model_menu = ref(0)

</script>

<style scoped>
  #container-window { height: 500px; }
</style>
