<template>
  <v-tabs
    v-model="model_menu"
    show-arrows
    color="red-darken-4"
    grow
  >
    <v-tab :value="0">Shear</v-tab>
    <v-tab :value="1">Stretch</v-tab>
    <v-tab :value="2">Stagger</v-tab>
    <v-tab :value="3">Buckle</v-tab>
    <v-tab :value="4">Propeller</v-tab>
    <v-tab :value="5">Opening</v-tab>
  </v-tabs>

  <v-window v-model="model_menu" class="elevation-2 pa-5" id="container-window">

    <v-window-item :value="0"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" type="shear" :img="shearImg">
          <template #plot>
            <ErrorBarsPlot type="shear" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="1"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" type="stretch" :img="stretchImg">
          <template #plot>
            <ErrorBarsPlot type="stretch" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="2"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" type="stagger" :img="staggerImg">
          <template #plot>
            <ErrorBarsPlot type="stagger" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" type="buckle" :img="buckleImg">
          <template #plot>
            <ErrorBarsPlot type="buckle" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" type="propeller" :img="propellerImg">
          <template #plot>
            <ErrorBarsPlot type="propeller" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row class="pa-2">
        <CurvesPlot style="z-index:2" type="opening" :img="openingImg">
          <template #plot>
            <ErrorBarsPlot type="opening" />
          </template>
        </CurvesPlot>
      </v-row>
    </v-window-item>

  </v-window>
</template>

<script setup>

  // vuetify images must be imported like this (and they cannot be imported in the AnalysisButton.vue component)
  import shearImg from '/img/projects/analyses/curves/intra-base-pair/shear.png'
  import stretchImg from '/img/projects/analyses/curves/intra-base-pair/stretch.png'
  import staggerImg from '/img/projects/analyses/curves/intra-base-pair/stagger.png'
  import buckleImg from '/img/projects/analyses/curves/intra-base-pair/buckle.png'
  import propellerImg from '/img/projects/analyses/curves/intra-base-pair/propeller.png'
  import openingImg from '/img/projects/analyses/curves/intra-base-pair/opening.png'

  const { id } = defineProps(['id'])

  // SECOND LEVEL MENU
  const model_menu = ref(0)

</script>

<style scoped>
  #container-window { height: 500px; }
</style>
