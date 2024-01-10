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
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/inter-base-pair/rise.png" alt="Rise" >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <ErrorBarsPlot id="rise"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="1"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/inter-base-pair/roll.png" alt="Roll"  >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <ErrorBarsPlot id="roll"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="2"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/inter-base-pair/shift.png" alt="Shift"  >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <ErrorBarsPlot id="shift"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/inter-base-pair/slide.png" alt="Slide"  >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <ErrorBarsPlot id="slide"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/inter-base-pair/tilt.png" alt="Tilt"  >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <ErrorBarsPlot id="tilt"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/inter-base-pair/twist.png" alt="Twist"  >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <ErrorBarsPlot id="twist"/>
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
