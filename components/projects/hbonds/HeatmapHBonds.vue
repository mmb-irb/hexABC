<template>
  <nuxt-plotly 
    :data="plotData.val"
    :layout="plotLayout"
    :config="plotConfig"
    style="width: 100%; height: 500px;"
    @on-ready="myChartOnReady"
   ></nuxt-plotly>

  <v-row v-if="pngImage" class="my-4">
    <v-col lg="9" md="12" sm="12" cols="12" :style="rangeDisabled ? 'opacity:.5' : 'opacity:1'">
      <div id="rangePlot">
        <div id="rangeBg">
          <img :src="pngImage" />
        </div>
        <v-range-slider
          v-model="range"
          :min="0"
          :max="200"
          step="1"
          thumb-label="always"
          @end="handleRangeChange"
          strict
          :disabled="rangeDisabled"
          :style="`width:100%;`"
          class="**mt-6 hm-slider"
        ></v-range-slider>
      </div>
    </v-col>
    <v-col lg="3" md="12" sm="12" cols="12" class="d-flex justify-center col-btn-zoom-hbonds">
      <v-btn
        :prepend-icon="rangeDisabled ? `mdi-magnify-plus` : `mdi-magnify-minus`"
        :color="'red-accent-4'"
        :variant="rangeDisabled ? 'flat' : 'outlined'"
        @click="handleZoom" 
        >
          {{ rangeDisabled ? 'Enable Zoom' : 'Disable Zoom' }}
        </v-btn>
    </v-col>
  </v-row>
</template>

<script setup>

  import useHeatmapUtils from '@/modules/analysis/useHeatmapUtils' 
  import Plotly from 'plotly.js-dist-min';

  const { pd } = defineProps(['pd'])
  const { $hbonds } = useNuxtApp()

  const { getPlotlyForImage } = useHeatmapUtils()

  const plotData = ref(pd)
  // load plot layout
  const plotLayout = $hbonds.layout
  // load plot config
  const plotConfig = $hbonds.config

  const pngImage = ref(null);
  const imageCreated = ref(false)

  const myChartOnReady = async (plotlyHTMLElement) => {
    if(!imageCreated.value) {
      
      const { dataCopy, layoutCopy} = getPlotlyForImage(plotData.value.val, plotLayout)

      // Generate the image with the modified data and layout
      pngImage.value = await Plotly.toImage({
        data: dataCopy,
        layout: layoutCopy,
        format: 'png'
      });

      const image = new Image();
      image.onload = function() {
        // update slider width
        rangeWidth.value = this.width
        document.querySelector('#rangePlot').style.width = `${this.width}px`
        document.querySelector('#rangePlot').style.height = `${this.height}px`
      };
      image.src = pngImage.value;

      imageCreated.value = true
    }

    plotlyHTMLElement.on?.('plotly_click', (e) => {
      console.log(e.points[0].x, e.points[0].y, e.points[0].z);
    })

  }

  /* RANGE SLIDER */
  /* TODO: START WORKING WITH RANGE SLIDER AND RANGE SELECTOR */

  const rangeDisabled = ref(true);
  const range = ref([0, 20]);
  const maxTotalRange = 20;
  const rangeWidth = ref(500);

  const newRange = ref([0, 20])

  // Handle range change event and update range model
  const handleRangeChange = (e) => {
    range.value = newRange.value
  };

  watch(range, (oldr, newr) => {

    // if the range is too big, adjust it to the maxTotalRange
    if ((oldr[0] !== newr[0]) && (newr[1] - newr[0] > maxTotalRange)) {
      // If min has changed, adjust the max to fit within the limit
      if (range.value[1] - range.value[0] > maxTotalRange) {
        newRange.value = [range.value[0], range.value[0] + maxTotalRange]
      }
    } else if ((oldr[1] !== newr[1]) && (newr[1] - newr[0] > maxTotalRange)) {
      // If max has changed, adjust the min to fit within the limit
      if (range.value[1] - range.value[0] > maxTotalRange) {
        newRange.value = [range.value[1] - maxTotalRange, range.value[1]]
      }
    } 

    // if the range is too small, adjust it to the newr
    if((newr[1] - newr[0] <= maxTotalRange)) {
      newRange.value = [newr[0], newr[1]]
    }

  });

  /* TO FINIIIIIIIIISH */
  const emit = defineEmits(['customEvent']);

  const handleZoom = () => {
    rangeDisabled.value = !rangeDisabled.value
    emit('customEvent', 0, 1);
  }

</script>

<style>
  .hm-slider.v-slider.v-input--horizontal {
    margin-inline: 0;
  }
  #rangePlot { position: relative; margin: 0 auto; }
  #rangeBg { opacity: 0.7; position: absolute; left: 0; top: 0; width: 100%; height: auto; }
  .hm-slider.v-locale--is-ltr.v-slider.v-input--horizontal .v-slider-thumb__label, .v-locale--is-ltr .v-slider.v-input--horizontal .v-slider-thumb__label {
    transform: translateX(-50%) translateY(73px)!important;
  }
  .hm-slider.v-slider.v-input--horizontal .v-slider-thumb__label::before {
    top: -6px;
    transform: scaleY(-1);
  }
  .hm-slider.v-slider.v-input--horizontal .v-slider-track {
    height: 41px!important;
  }
  .hm-slider .v-slider-track__background--opacity { opacity: 0!important; }
  .hm-slider .v-slider-track__fill { 
    background: rgba(255, 255, 255, 0.3)!important;
    border-radius: 0!important; 
    border-left: solid 4px #fff;
    border-right: solid 4px #fff;
  }
  .hm-slider .v-slider-thumb__surface { opacity: 0; }
</style>

<style scoped>
  @media only screen and (max-width: 1280px) {
    .col-btn-zoom-hbonds { margin-top: 20px;  }
  }
  @media only screen and (max-width: 820px) {
    #rangePlot, #rangeBg img { width:100%!important; }
  }
</style>
    