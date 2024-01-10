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

  <v-window v-model="model_menu" class="elevation-2 pa-5" style="height: 440px">

    <v-window-item :value="0"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/inter-base-pair/rise.png" alt="Rise" style="max-width: 100%;" >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="rise"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="1"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/inter-base-pair/roll.png" alt="Roll" style="max-width: 100%;"  >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="roll"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="2"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/inter-base-pair/shift.png" alt="Shift" style="max-width: 100%;"  >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="shift"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/inter-base-pair/slide.png" alt="Slide" style="max-width: 100%;"  >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="slide"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/inter-base-pair/tilt.png" alt="Tilt" style="max-width: 100%;"  >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="tilt"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/inter-base-pair/twist.png" alt="Twist" style="max-width: 100%;"  >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="twist"/>
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
