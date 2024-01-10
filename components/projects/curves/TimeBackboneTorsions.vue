<template>
  <v-tabs
    v-model="model_menu"
    show-arrows
    color="red-darken-4"
    grow
  >
    <v-tab :value="0">Alpha</v-tab>
    <v-tab :value="1">Beta</v-tab>
    <v-tab :value="2">Gamma</v-tab>
    <v-tab :value="3">Delta</v-tab>
    <v-tab :value="4">Chi</v-tab>
    <v-tab :value="5">Epsilon</v-tab>
    <v-tab :value="6">Theta</v-tab>
  </v-tabs>

  <v-window v-model="model_menu" class="elevation-2 pa-5" style="height: 440px">

    <v-window-item :value="0"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/backbone/alpha-torsions.png" alt="Alpha Torsions" style="max-width: 100%;" >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="alpha"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/backbone/beta-torsions.png" alt="Beta Torsions" style="max-width: 100%;" >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="beta"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/backbone/gamma-torsions.png" alt="Gamma Torsions" style="max-width: 100%;" >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="gamma"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/backbone/delta-torsions.png" alt="Delta Torsions" style="max-width: 100%;" >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="delta"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/backbone/chi-torsions.png" alt="Chi Torsions" style="max-width: 100%;" >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="chi"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/backbone/epsilon-torsions.png" alt="Epsilon Torsions" style="max-width: 100%;" >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="epsilon"/>
        </v-col>
      </v-row>
    </v-window-item>

    <v-window-item :value="0"> 
      <v-row>
        <v-col cols="3" class="col-left">
          <img src="/img/projects/analyses/curves/backbone/theta-torsions.png" alt="Theta Torsions" style="max-width: 100%;" >
        </v-col>
        <v-col cols="9">
          <TimeSeriesHistogramPlot id="theta"/>
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
