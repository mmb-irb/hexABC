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

  <v-window v-model="model_menu" class="elevation-2 pa-5" style="height: 440px">

    <v-window-item :value="0"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/backbone/BI-BII.png" alt="BI / BII Population" style="max-width: 100%;" >
        </v-col>
        <v-col cols="9">
          <StackedHistogramPlot id="bi-bii"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="1"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/backbone/alpha-gamma.png" alt="Canonical Alpha-Gamma" width="200px" >
        </v-col>
        <v-col cols="9">
          <StackedHistogramPlot id="alpha-gamma"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="2"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/backbone/puckering.png" alt="Puckering" width="200px" >
        </v-col>
        <v-col cols="9">
          <StackedHistogramPlot id="puckering"/>
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
  }
</style>
