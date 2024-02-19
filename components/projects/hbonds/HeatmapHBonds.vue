<template>
  <div id="container-plot">
    <div id="loader-plot" class="d-flex justify-center align-center" v-if="changingPlot">
      <v-progress-circular
        :width="5"
        :size="80"
        color="red"
        indeterminate
      ></v-progress-circular>
    </div>
    <nuxt-plotly 
      :data="plotData.val"
      :layout="plotLayout"
      :config="plotConfig"
      style="width: 100%; height: 500px;"
      @on-ready="myChartOnReady"
    ></nuxt-plotly>
  </div>

  <v-row v-if="pngImage" class="my-6">
    <v-col lg="9" md="12" sm="12" cols="12" :style="rangeDisabled ? 'opacity:.5' : 'opacity:1'">
      <div id="rangePlot">
        <div id="rangeBg">
          <img :src="pngImage" />
        </div>
        <v-range-slider
          v-model="range"
          :min="0"
          :max="numframes"
          step="1"
          thumb-label="always"
          @start="changingPlot = true"
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
    <v-col cols="12" class="mt-4">
      <p>
        To enable <strong>big resolution zoom</strong>, click on the button above and then use the <strong>range slider</strong> to select the <strong>range of frames</strong> you want to <strong>zoom in</strong>. The plot will load again with the selected range and with a <strong>resolution of 1ps</strong> for each frame.
      </p>
    </v-col>
  </v-row>

  <PlotDialog v-model="dialog" ref="plotDialogRef">
    <template #viewer>
      <HBondsViewer :id="id" ref="hBondsViewerRef" />
    </template>
  </PlotDialog>

</template>

<script setup>

  import useHeatmapUtils from '@/modules/analysis/useHeatmapUtils' 
  import Plotly from 'plotly.js-dist-min';

  const { id, pd, nf } = defineProps(['id', 'pd', 'nf'])
  const emit = defineEmits(['callParent']);
  const { $hbonds, $sleep } = useNuxtApp()

  const { getPlotlyForImage } = useHeatmapUtils()

  const plotData = ref(pd)
  // load plot layout
  const plotLayout = $hbonds.layout
  // load plot config
  const plotConfig = $hbonds.config
  const numframes = ref(nf)

  const pngImage = ref(null);
  const imageCreated = ref(false)
  const changingPlot = ref(false)

  const dialog = ref(false)
  const hBondsViewerRef = ref(null)
  const plotDialogRef = ref(null);

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

      // *****
      // PUT IN A FUNCTION
      let sliders = document.querySelectorAll('.hm-slider.v-locale--is-ltr.v-slider.v-input--horizontal .v-slider-thumb__label');
      if (sliders[0]) {
        sliders[0].style.transform = 'translateX(-50%) translateY(-10px)';  // replace with your styles
      }
      if (sliders[1]) {
        sliders[1].style.transform = 'translateX(-50%) translateY(73px)';  // replace with your styles
      }
      let slidersb = document.querySelectorAll('.hm-slider.v-slider.v-input--horizontal .v-slider-thumb__label');
      slidersb.forEach((slider, index) => {
        slider.classList.add(`thumb-label-${index}`);
      });
      // *****
    }

    let debounceTimeout
    let dclick = false
    plotlyHTMLElement.on?.('plotly_click', (e) => {
      debounceTimeout = setTimeout(async () => {
        if(!dclick) {
          //console.log(e.points[0].x, e.points[0].y, e.points[0].z);
          dialog.value = true
          // set dialog title
          var ns = e.points[0].y.replace(/([A-Za-z])(\d+)/g, '$1 - $2');
          var title = `Hydrogen Bonds :: Frame ${e.points[0].x} :: BP ${ns}`
          plotDialogRef.value.updateTitle(title)
          // get residue numbers for selected nucleotides
          var residues = e.points[0].y.match(/\d+/g).map(Number)
          // trick for avoiding problems on loading the viewer
          await $sleep(500)
          try {
            hBondsViewerRef.value.addRepresentationHBonds(residues.join(' '))
          } catch (error) {
            //console.log('Error adding representation:', error)
            await $sleep(500)
            hBondsViewerRef.value.addRepresentationHBonds(residues.join(' '))
          }
        }
        clearTimeout(debounceTimeout)
        dclick = false
      }, 300)

    })

    plotlyHTMLElement.on?.('plotly_doubleclick', (e) => {
      dclick = true
      clearTimeout(debounceTimeout)
    })

    changingPlot.value = false

  }

  /* RANGE SLIDER */
  const rangeDisabled = ref(true);
  const range = ref([0, $hbonds.range]);
  const maxTotalRange = 25000;
  const rangeWidth = ref(500);

  const newRange = ref([0, $hbonds.range])

  // Handle range change event and update range model
  const handleRangeChange = (e) => {
    range.value = newRange.value
    // timeout to avoid ralentization of range slider
    setTimeout(() => {
      emit('callParent', range.value[0], range.value[1]);
    }, 500);
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

  /* CHANGE PLOT RESOLUTION */

  const handleZoom = () => {
    rangeDisabled.value = !rangeDisabled.value
    changingPlot.value = true
    // if rangeDisabled is false, emit the range values and load new high resolution data
    // if rangeDisabled is true, send nulls and load big picture data
    if(!rangeDisabled.value) emit('callParent', range.value[0], range.value[1]);
    else emit('callParent', null, null);
  }

</script>

<style>
  .hm-slider.v-slider.v-input--horizontal {
    margin-inline: 0;
  }
  #rangePlot { position: relative; margin: 0 auto; }
  #rangeBg { opacity: 0.6; position: absolute; left: 0; top: 0; width: 100%; height: auto; }
  .thumb-label-0::before { bottom: -0.35rem!important; }
  .thumb-label-1::before { top: -0.37rem!important; transform: scaleY(-1); }
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
  .hm-slider .v-messages { display: none; }
</style>

<style scoped>
  #container-plot { width:100%; height: 100%; position: relative; }
  #loader-plot { position: absolute; top: 0; left: 0; background: rgba(255,255,255,0.8); width: 100%; height: 100%; z-index: 1; }
  @media only screen and (max-width: 1280px) {
    .col-btn-zoom-hbonds { margin-top: 20px;  }
  }
  @media only screen and (max-width: 820px) {
    #rangePlot, #rangeBg img { width:100%!important; }
  }
</style>
    