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

  <v-window v-model="model_menu" class="elevation-2 pa-5" style="height: 440px">

    <v-window-item :value="0"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/base-pair/inclination.png" alt="Inclination" style="max-width: 100%;" >
        </v-col>
        <v-col cols="9">
          <ErrorBarsPlot id="inclination"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="1"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/base-pair/tip.png" alt="Tip" width="200px" >
        </v-col>
        <v-col cols="9">
          <ErrorBarsPlot id="tip"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="2"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/base-pair/xdisp.png" alt="X-Displacement" width="200px" >
        </v-col>
        <v-col cols="9">
          <ErrorBarsPlot id="xdisplacement"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/base-pair/ydisp.png" alt="Y-Displacement" width="200px" >
        </v-col>
        <v-col cols="9">
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
  }
</style>
