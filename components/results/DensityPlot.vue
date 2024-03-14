<template>
  <div style="position:relative">
		<div id="loader-dplot" class="d-flex justify-center align-center" v-if="loading">
			<v-progress-circular
				:width="5"
				:size="80"
				color="red"
				indeterminate
			></v-progress-circular>
		</div>
		<div id="container-dplot">
		  <nuxt-plotly 
        :data="plotData.val"
        :layout="plotLayout"
        :config="plotConfig"
        style="width: 100%; height: 200px;"
      ></nuxt-plotly>
    </div>
	</div>
</template>

<script setup>

  const loading = ref(true)

  setTimeout(() => {
    loading.value = false
  }, 500);

  function normal() {
      var x = 0,
          y = 0,
          rds, c;
      do {
          x = Math.random() * 2 - 1;
          y = Math.random() * 2 - 1;
          rds = x * x + y * y;
      } while (rds == 0 || rds > 1);
      c = Math.sqrt(-2 * Math.log(rds) / rds); // Box-Muller transform
      return x * c; // throw away extra sample y * c
  }

  var N = 2000,
      
    a = -1,
    b = 1.2;

  var step = (b - a) / (N - 1);
  var t = new Array(N), x = new Array(N), y = new Array(N);

  for(var i = 0; i < N; i++){
    t[i] = a + step * i;
    x[i] = (Math.pow(t[i], 3)) + (0.3 * normal() );
    y[i] = (Math.pow(t[i], 6)) + (0.3 * normal() );
  }


  var trace2 = {
    x: x,
    y: y,
    name: 'density',
    ncontours: 20,
    colorscale: 'Blues',
    reversescale: true,
    showscale: false,
    type: 'histogram2dcontour'
  };

  var data = [trace2];
  var layout = {
    showlegend: false,
    autosize: false,
    margin: {
            l: 20,
            r: 40,
            b: 30,
            t: 2,
            pad: 4
          },
    hovermode: 'closest',
    bargap: 0,
    xaxis: {
      //domain: [0, 0.85],
      showgrid: false,
      zeroline: false,
    },
    yaxis: {
      //domain: [0, 0.85],
      showgrid: false,
      zeroline: false,
    }
  };

  let plotData = reactive({
    val: []
  })
  let plotLayout = {}
  let plotConfig = {}

  onMounted(async () => {

    // load data & layout for timeseries plot
    plotData.val = data
    plotLayout = layout
    plotConfig = {
          scrollZoom: true, 
          displayModeBar: false, 
          responsive: true 
        }

  })

</script>

<style scoped>
  #loader-dplot { position: absolute; top: 0; left: 0; background: #ffffff; width: 100%; height: 450px; z-index: 1;}
	#container-dplot { width: 100%; height: 450px; }
</style>
  