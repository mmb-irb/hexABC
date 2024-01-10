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

  <v-window v-model="model_menu" class="elevation-2 pa-5" style="height: 440px">

    <v-window-item :value="0"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/grooves/major.png" alt="Major Groove Depth" style="max-width: 100%;" >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="major-depth"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="1"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/grooves/major.png" alt="Major Groove Width" style="max-width: 100%;"  >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="major-width"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="2"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/grooves/minor.png" alt="Minor Groove Depth" style="max-width: 100%;"  >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="minor-depth"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="3"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/grooves/minor.png" alt="Minor Groove Width" style="max-width: 100%;"  >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="minor-width"/>
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
