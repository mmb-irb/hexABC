<template>
  <div style="width:100%; height:400px; background-color:#ccc; display:flex; justify-content: center; align-items: center; position:relative;">

    <v-progress-circular
      :size="70"
      :width="7"
      color="red-darken-4"
      indeterminate
      v-if="loading"
    ></v-progress-circular>

    <div style="width:100%; " v-else>
      <!--<h2>{{ id }}</h2>-->

      <nuxt-plotly 
        :data="plotData.val"
        :layout="plotLayout"
        :config="plotConfig"
        style="width: 100%; height: 500px; display: block;"
        @on-ready="myChartOnReady"
      ></nuxt-plotly>
    </div>

    </div>
</template>

<script setup>
  const { id } = defineProps(['id'])
  
  const loading = ref(true)

  setTimeout(() => {
    loading.value = false
  }, 1000);

  let plotData = reactive({
    val: []
  })
  let plotLayout = {}
  let plotConfig = {}

  //MOCK PLOT WITH 100000 xaxis
    function generateRandomArray(n) {
      const result = [];
      for (let i = 0; i < n; i++) {
        const randomNumber = Math.floor(Math.random() * 50) + 1; // generates random integers between 1 and 10
        result.push(randomNumber);
      }
      return result;
    }
  onMounted(async () => {
    
    var n = 100

    var trace2 = {
      x: Array.from({ length: n + 1 }, (_, index) => index),
      y: generateRandomArray(n),
      mode: 'lines+markers'
    };

    var trace3 = {
      x: Array.from({ length: n + 1 }, (_, index) => index),
      y: generateRandomArray(n),
      mode: 'lines+markers'
    };

    plotData.val = [ trace2, trace3 ];

    plotConfig = { 
      scrollZoom: true, 
      displayModeBar: false, 
      responsive: true 
    }

    plotLayout = {
      title: null,
      showlegend: false,
      hovermode: "closest",
      hoverlabel: { bgcolor: "#f9f9f9" },
      xaxis: {
        //range: [5, 10],
        tickformat: "d",
        title: {
          text: 'frame number',
          standoff: 20
        }
      },
      yaxis: {
        title: {
          text: 'base pair',
          standoff: 10
        }
      },
      //width: 800,
      //height: 380,
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 0
      },
      annotations: {
        arrowcolor: '#f00000',
      }
    }

    /*var data = [ trace2, trace3 ];

    var layout = {};

    Plotly.newPlot('myDiv', data, layout, {showSendToCloud: true});*/

  })

  const myChartOnReady = (plotlyHTMLElement) => {
    plotlyHTMLElement.on?.('plotly_click', (e) => {
      console.log(e.points[0].x, e.points[0].y, e.points[0].z);
    })
  }

</script>

<style scoped>

</style>
  