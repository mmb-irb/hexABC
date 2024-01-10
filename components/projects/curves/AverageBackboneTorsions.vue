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
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/backbone/BI-BII.png" alt="BI / BII Population" >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <StackedHistogramPlot id="bi-bii"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="1"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/backbone/alpha-gamma.png" alt="Canonical Alpha-Gamma"  >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <StackedHistogramPlot id="alpha-gamma"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="2"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/backbone/puckering.png" alt="Puckering"  >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
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
    justify-content: center;
  }
  .col-left img { max-width: 100%; }
  #container-window { height: 440px; }

  @media only screen and (max-width: 960px) {
    .col-left img { max-width: 80%; }
  }

  @media only screen and (max-width: 600px) {
    #container-window { height: auto; }
    .col-left { display: none; }
  }
</style>
