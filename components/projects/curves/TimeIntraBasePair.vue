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

  <v-window v-model="model_menu" class="elevation-2 pa-5" style="height: 440px">

    <v-window-item :value="0"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/intra-base-pair/shear.png" alt="Shear" style="max-width: 100%;" >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="shear"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="1"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/intra-base-pair/stretch.png" alt="Stretch" style="max-width: 100%;"  >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="stretch"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="2"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/intra-base-pair/stagger.png" alt="Stagger" style="max-width: 100%;"  >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="stagger"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/intra-base-pair/buckle.png" alt="Buckle" style="max-width: 100%;"  >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="buckle"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/intra-base-pair/propeller.png" alt="Propeller" style="max-width: 100%;"  >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="propeller"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/intra-base-pair/opening.png" alt="Opening" style="max-width: 100%;"  >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="opening"/>
        </v-col>
      </v-row>
    </v-window-item>

  </v-window>
</template>

<script setup>
    // SECOND LEVEL MENU
    const model_menu = ref(0)
</script>

<style scoped>
  .col-left {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
