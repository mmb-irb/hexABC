<template>
    <v-container>
  
      <h1>Curves Results by Time</h1>

      <Breadcrumbs :props="{id: id, text: 'Results by time', title: title}" />
  
      <v-row> 
        <v-col cols="12">
          <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

            <template v-slot:title>
              <div id="header-container">
                <div>
                  <v-icon size="small" icon="mdi-timer-outline"></v-icon> &nbsp;SEQUENCE RESULTS BY TIME
                </div>
                <v-btn prepend-icon="mdi-chart-bell-curve"
                  variant="outlined"
                  color="red-accent-4"
                  :to="`/projects/${id}/curves-average`"
                  >Average Results</v-btn>
                </div>
            </template>

            <template v-slot:text>

              <p>Using the below <strong>interactive sequence</strong>, users can select the desired <strong>nucleotides</strong> (single or grouped) in order to view the different <strong>analyses</strong>. <strong>Nucleotides</strong> can be selected <strong>individually</strong> <img src="/img/projects/analyses/curves/nucleotide.png" alt="nucleotide" style="vertical-align: middle;" /> , by <strong>base step</strong>  <img src="/img/projects/analyses/curves/base-step.png" alt="base step" style="vertical-align: middle;" /> , by <strong>base pair</strong> <img src="/img/projects/analyses/curves/base-pair.png" alt="base pair" style="vertical-align: middle;" /> , by <strong>base pair step</strong> <img src="/img/projects/analyses/curves/base-pair-step.png" alt="base pair step" style="vertical-align: middle;" /> , by <strong>tetramers</strong> <img src="/img/projects/analyses/curves/tetramer.png" alt="tetramer" style="vertical-align: middle;" />  and by <strong>hexamers</strong>  <img src="/img/projects/analyses/curves/hexamer.png" alt="hexamer" style="vertical-align: middle;" /> . Once a <strong>nucleotide</strong> or <strong>group of nucleotides</strong> has been selected, click on the <strong>menu</strong> right to the <strong>sequence</strong> to see all the <strong>analyses</strong> available in this section.</p>

              <v-row id="container-strands"> 
                <v-col lg="9" md="9" sm="12" xs="12">

                  <v-sheet
                    color="grey-lighten-4"
                    class="pa-10 project-sheet"
                    id="container-strands-sheet"
                  >
                    <v-row class="project-row" justify="center">
                      <div 
                        class="number" 
                        v-for="(item, index) in strand1"
                        :key="index"
                        :value="index"
                        > {{ index + 1 }} </div>
                    </v-row>
                    <v-row class="pb-0 pt-2 px-4 project-row" justify="space-around">
                      <div class="end"> {{ ends1[0] }} </div>
                      <div class="d-flex">
                        <div 
                        class="nucleotide" 
                        v-for="(item, index) in strand1"
                        :key="index"
                        :value="index"
                        :id="`${item}-${index + 1}-strand1`"
                        > {{ item }} </div>
                      </div>
                      <div class="end"> {{ ends1[1] }} </div>
                    </v-row>
                    <v-row class="pt-0 pb-2 px-4 project-row" justify="space-around">
                      <div class="end"> {{ ends2[0] }} </div>
                      <div class="d-flex">
                        <div 
                        class="nucleotide" 
                        v-for="(item, index) in strand2"
                        :key="index"
                        :value="index"
                        :id="`${item}-${strand2.length*2 - index}-strand2`"
                        > {{ item }} </div>
                      </div>
                      <div class="end"> {{ ends2[1] }} </div>
                    </v-row>
                    <v-row class="project-row" justify="center">
                      <div 
                        class="number" 
                        v-for="(item, index) in strand2"
                        :key="index"
                        :value="index"
                        > {{ strand2.length*2 - index }} </div>
                    </v-row>
                  </v-sheet>

                </v-col>

                <v-col lg="3" md="3" sm="12" xs="12">

                  <v-btn-toggle
                    mandatory
                    v-model="section"
                    color="red-darken-4"
                    rounded="0"
                  >
                    <v-btn value="0" @click="firstLevelChange('0')" class="btn-section disabled" id="btn-section-0"> <v-icon> mdi-heating-coil </v-icon> &nbsp;Backbone Torsions </v-btn>
                    <v-btn value="1" @click="firstLevelChange('1')" class="btn-section disabled" id="btn-section-1"> <v-icon> mdi-arrow-top-right-bottom-left mdi-rotate-135 </v-icon> &nbsp;Axis Base pair </v-btn>
                    <v-btn value="2" @click="firstLevelChange('2')" class="btn-section disabled" id="btn-section-2"> <v-icon> mdi-arrow-expand </v-icon> &nbsp;Intra-Base Pair HP's </v-btn>
                    <v-btn value="3" @click="firstLevelChange('3')" class="btn-section disabled" id="btn-section-3"> <v-icon> mdi-arrow-expand-all </v-icon> &nbsp;Inter-Base Pair HP's </v-btn>
                    <v-btn value="4" @click="firstLevelChange('4')" class="btn-section disabled" id="btn-section-4"> <v-icon style="transform: scaleX(-1);"> mdi-set-square mdi-rotate-45 </v-icon> &nbsp;Grooves </v-btn>
                  </v-btn-toggle>
                </v-col>
                <div id="sticky-disable">
                  <v-tooltip text="Disable sticky" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-btn 
                        v-bind="props" 
                        density="compact" 
                        id="btn-sticky-disable" 
                        color="blue-grey-lighten-4" 
                        variant="flat" 
                        icon="mdi-window-close"
                        @click="controlSticky"
                      ></v-btn>
                    </template>
                  </v-tooltip>
                </div>
              </v-row>

              <v-row class="mt-8" v-if="showAlert">
                <v-col>
                  <v-alert
                    icon="true"
                    :title="`${alertType === 'warning' ? 'Warning' : 'Start'}`"
                    border="start"
                    :border-color="`${alertType === 'warning' ? 'yellow-darken-3' : 'blue-grey-darken-1'}`"
                    elevation="2"
                  >
                    <template v-slot:prepend>
                      <v-icon 
                      :icon="`${alertType === 'warning' ? 'mdi-alert' : 'mdi-information'}`" 
                      :color="`${alertType === 'warning' ? 'yellow-darken-3' : 'blue-grey-darken-1'}`"></v-icon>
                    </template>
                    <template v-slot:text>
                      <p v-html="message"></p>
                    </template>
                  </v-alert>
                </v-col>
              </v-row>

              <v-row justify="end" v-if="section">
                <v-col cols="12">
                  <TimeBackboneTorsions v-if="section === '0'" />
                  <TimeAxisBasePair v-if="section === '1'" />
                  <TimeIntraBasePair v-if="section === '2'" />
                  <TimeInterBasePair v-if="section === '3'" />
                  <TimeGrooves v-if="section === '4'" />
                </v-col>
              </v-row>
  
            </template>
          </v-card>
        </v-col>

        <div id="sticky-enable">
          <v-tooltip text="Enable sticky" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn 
                v-bind="props" 
                density="compact" 
                id="btn-sticky-enable" 
                color="blue-grey-lighten-4" 
                icon="mdi-chevron-double-down"
                @click="controlSticky"
              ></v-btn>
            </template>
          </v-tooltip>
        </div>

      </v-row>

  
    </v-container>
  </template>
  
  <script setup>

    import DragSelect from 'dragselect'
    import useInteractiveSequence from '@/modules/analysis/useInteractiveSequence'

    const { id } = useRoute().params
    const config = useRuntimeConfig()

    const data = await useFetch(`${config.public.apiBase}/projects/${id}`)
    const project = ref(data.data.value.project)

    const title = project.value.metadata.NAME

    const { 
      getSequenceSettings, 
      checkNucleotides,
      addBordersToNucleotides,
      removeBordersFromNucleotides 
    } = useInteractiveSequence()

    useHead({
      title: `Results by time for ${title}`,
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@200;500&display=swap' }
      ]
    })

    let message = ref('Please start making a <strong>selection</strong> of one or more <strong>nucleotides</strong>, either clicking them one by one (pressing shift / ⇧ key at the same time) or selecting a group with the mouse.')
    let showAlert = ref(true)
    let alertType = ref('info')

    const sequence = project.value.metadata.SEQUENCES[0]
    const { strand1, strand2, ends1, ends2 } = getSequenceSettings(sequence)
    
    // FIRST LEVEL MENU
    const section = ref(null)
    let activeMenu = []

    const firstLevelChange = (v) => {

      // trick for reenabling buttons (they disable themselves when clicked)
      setTimeout(() => {
        enableSectionButtons(activeMenu)
      }, 1);
      
      /*switch(section.value) {
        case '0':
          console.log(' section 0')
          break;
        case '1':
          console.log(' section 1')
          break;
        case '2':
          console.log(' section 2')
          break;
        case '3':
          console.log(' section 3')
          break;
        case '4':
          console.log(' section 4')
          break;
      }*/

    }

    // sequence - menu relationship
    const seqmenu = [
      { sections: [0] },
      { sections: [0] },
      { sections: [1, 2] },
      { sections: [3, 4] },
      { sections: [3, 4] },
      { sections: [3, 4] }
    ]

    const disableSectionButtons = () => {
      //console.log('disableSectionButtons')
      document.querySelectorAll('.btn-section').forEach((item) => {
        item.classList.add('disabled')
      })
    }

    const enableSectionButtons = (menu) => {
      //console.log('enableSectionButtons', menu)
      setTimeout(() => {
        menu.forEach((item) => {
          document.getElementById(`btn-section-${item}`).classList.remove('disabled')
        })
      }, 1);
    }

    onMounted(async () => {
      const ds = new DragSelect({
        selectables: document.getElementsByClassName("nucleotide"),
        area: document.getElementById("container-strands-sheet"),
        draggability: false,
        multiSelectKeys: ['Shift']
      });

      ds.subscribe("DS:start", (e) => {
        //console.log('selection started');
        removeBordersFromNucleotides()
      });

      ds.subscribe("DS:end", ({items}) => {

        const nucleotides = items.map((item) => item.id )

        const checkNuc = checkNucleotides(nucleotides, sequence.length)

        disableSectionButtons()

        // reset section menu
        section.value = null

        if (checkNuc.status) {
          // get message
          message.value = checkNuc.msg
          // modify styles for selected nucleotides
          addBordersToNucleotides(nucleotides)
          // get menu
          activeMenu = seqmenu[checkNuc.type].sections
          enableSectionButtons(activeMenu)
        } else {
          // get message
          message.value = checkNuc.msg
        }

        alertType.value = checkNuc.alert
        showAlert.value = !checkNuc.status

      });

    })
  
    // STICKY CONTAINER STRANDS 
    let sticky = ref(true)
    const onScroll = () => {
      if(sticky.value === false) return

      if(document.querySelector("#container-strands").getBoundingClientRect().y <= 50) {
        document.querySelector("#container-strands").style.position = 'sticky'
        document.querySelector("#container-strands").style.top = '50px'
        document.querySelector("#container-strands").classList.add('elevation-3')
        document.querySelector("#sticky-disable").style.display = 'block'
      } else {
        document.querySelector("#container-strands").style.position = 'relative'
        document.querySelector("#container-strands").style.top = 'inherit'
        document.querySelector("#container-strands").classList.remove('elevation-3')
        document.querySelector("#sticky-disable").style.display = 'none'
      }
    }
    window.addEventListener('scroll', onScroll)    

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll)
    })

    const controlSticky = () => {
      sticky.value = !sticky.value
      if(sticky.value === false) {
        document.querySelector("#container-strands").style.position = 'relative'
        document.querySelector("#container-strands").style.top = 'inherit'
        document.querySelector("#container-strands").classList.remove('elevation-3')
        document.querySelector("#sticky-disable").style.display = 'none'
        document.querySelector("#sticky-enable").style.display = 'block'
      } else {        
        document.querySelector("#sticky-enable").style.display = 'none'
        if(document.querySelector("#container-strands").getBoundingClientRect().y <= 50) {
          document.querySelector("#container-strands").style.position = 'sticky'
          document.querySelector("#container-strands").style.top = '50px'
          document.querySelector("#container-strands").classList.add('elevation-3')
          document.querySelector("#sticky-disable").style.display = 'block'
        }
      }
    }

  </script>
  
  <style scoped>
    #header-container {
      display: flex; 
      justify-content: space-between;
    }
    #container-strands {
      position:sticky; 
      z-index:10;
      background: #fff;
    }
    /* for making sticky working */
    .v-card {
      overflow: inherit !important;  
    }
    .nucleotide {
      font-family: 'Roboto Mono', monospace;
      font-size: 1.5rem;
      line-height: 1.6rem;
      font-weight: 500;
      padding: .5rem 0.5rem;
      margin: 0;
      color: var(--palette-6);
      user-select: none; 
    }
    .nucleotide.all { box-shadow: inset 0 0 0 1px var(--palette-2); }
    .nucleotide.top-bp { box-shadow: inset 1px 0 0 var(--palette-2), inset -1px 0 0 var(--palette-2), inset 0 1px 0 var(--palette-2); }
    .nucleotide.bottom-bp { box-shadow: inset 1px 0 0 var(--palette-2), inset -1px 0 0 var(--palette-2), inset 0 -1px 0 var(--palette-2); }
    .nucleotide.left-bs { box-shadow: inset 1px 0 0 var(--palette-2), inset 0 1px 0 var(--palette-2), inset 0 -1px 0 var(--palette-2); }
    .nucleotide.right-bs { box-shadow: inset -1px 0 0 var(--palette-2), inset 0 1px 0 var(--palette-2), inset 0 -1px 0 var(--palette-2); }
    .nucleotide.top-left-bps { box-shadow: inset 1px 1px 0px 0px var(--palette-2); }
    .nucleotide.top-right-bps { box-shadow: inset -1px 1px 0px 0px var(--palette-2); }
    .nucleotide.top-bps { box-shadow: inset 0px 1px 0px 0px var(--palette-2); }
    .nucleotide.bottom-left-bps { box-shadow: inset 1px -1px 0px 0px var(--palette-2); }
    .nucleotide.bottom-right-bps { box-shadow: inset -1px -1px 0px 0px var(--palette-2); }
    .nucleotide.bottom-bps { box-shadow: inset 0px -1px 0px 0px var(--palette-2); }
    .ds-selected {
      background-color: var(--light-text);
      color: var(--palette-4);
    }

    .v-btn-group {
      flex-direction: column;
      overflow: inherit !important;
      width: 100%;
    }
    .v-btn-group .v-btn {
      padding: .44rem .5rem;
      justify-content: start;
      text-transform: none;
    }
    .v-btn-group .v-btn.disabled { 
      pointer-events: none;
      opacity: 0.25;
    }

    .number {
      font-family: monospace;
      font-size: .75rem;
      width: 1.91rem;
      text-align: center;
      color: var(--palette-2);
      user-select: none; 
      line-height: .2rem;
    }
    .end {
      font-family: 'Roboto Mono', monospace;
      font-size: 1.25rem;
      font-weight: 200;
      color: var(--strand-end);
      user-select: none; 
      padding: .75rem 0;
    }
    .project-sheet{ overflow: hidden;}

    #sticky-disable { position: absolute; right: -.8rem; bottom: -.8rem; display: none; }
    #sticky-enable { position: fixed; top: 55px; right:0px; display: none; }
    #btn-sticky-disable, #btn-sticky-enable { color: #fff!important; }

    @media only screen and (max-width: 1280px) {
      .nucleotide { padding: .3rem 0.35rem; }
      .number { width: 1.62rem; }
      .end { padding: .5rem 0; font-size: 1.2rem; }
      .project-sheet{ overflow-x: auto;}
      .project-row { min-width: 630px; }
      .v-btn-group .v-btn { padding: .44rem .2rem; }
    }

    @media only screen and (max-width: 960px) {
      .v-btn-group {
        flex-direction: inherit;
        overflow: scroll !important;
      }
      .v-btn-group .v-btn { padding: .44rem .35rem; }
    }

    @media only screen and (max-width: 600px) {
      #header-container {
        flex-direction: column;
      }
      #header-container .v-btn {  margin-top: 1rem; }
    }
  </style>