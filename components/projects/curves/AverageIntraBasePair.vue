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
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/intra-base-pair/shear.png" alt="Shear" >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <ErrorBarsPlot id="shear"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="1"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/intra-base-pair/stretch.png" alt="Stretch"  >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <ErrorBarsPlot id="stretch"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="2"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/intra-base-pair/stagger.png" alt="Stagger"  >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <ErrorBarsPlot id="stagger"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/intra-base-pair/buckle.png" alt="Buckle"  >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <ErrorBarsPlot id="buckle"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/intra-base-pair/propeller.png" alt="Propeller"  >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <ErrorBarsPlot id="propeller"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col lg="3" md="4" sm="4" xs="12" class="col-left">
          <img src="/img/projects/analyses/curves/intra-base-pair/opening.png" alt="Opening"  >
        </v-col>
        <v-col lg="9" md="8" sm="8" xs="12">
          <ErrorBarsPlot id="opening"/>
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
