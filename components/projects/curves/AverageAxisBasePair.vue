<template>
  <v-tabs
    v-model="model_menu"
    show-arrows
    color="red-darken-4"
    grow
  >
    <v-tab :value="0">Inclination</v-tab>
    <v-tab :value="1">Tip</v-tab>
    <v-tab :value="2">X-Displacement</v-tab>
    <v-tab :value="3">Y-Displacement</v-tab>
  </v-tabs>

  <v-window v-model="model_menu" class="elevation-2 pa-5" id="container-window">

    <v-window-item :value="0"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/base-pair/inclination.png" alt="Inclination" >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <ErrorBarsPlot id="inclination"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="1"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/base-pair/tip.png" alt="Tip" >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <ErrorBarsPlot id="tip"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="2"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/base-pair/xdisp.png" alt="X-Displacement" >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <ErrorBarsPlot id="xdisplacement"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/base-pair/ydisp.png" alt="Y-Displacement" >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <ErrorBarsPlot id="ydisplacement"/>
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
