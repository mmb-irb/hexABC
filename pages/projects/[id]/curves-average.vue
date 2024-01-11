<template>
    <v-container>
  
      <h1>Curves Average Results</h1>
  
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:divider>
          <v-icon icon="mdi-circle-small"></v-icon>
        </template>
      </v-breadcrumbs>
  
      <v-row> 
        <v-col cols="12">
          <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

            <template v-slot:title>
              <div id="header-container">
                <div>
                  <v-icon size="small" icon="mdi-chart-bell-curve"></v-icon> &nbsp;SEQUENCE AVERAGE RESULTS
                </div>
                <v-btn prepend-icon="mdi-timer-outline"
                  variant="outlined"
                  color="red-accent-4"
                  :to="`/projects/${id}/curves-time`"
                  >Results by Time</v-btn>
                </div>
            </template>

            <template v-slot:text>

              <p>Click on the <strong>menu</strong> right to the <strong>sequence</strong> to see all the <strong>analyses</strong> available in this section.</p>

              <v-row id="container-strands"> 
                <v-col lg="9" md="9" sm="12" xs="12">

                  <v-sheet
                    color="grey-lighten-4"
                    class="pa-10 project-sheet"
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
                        class="gr-nucl" 
                        v-for="(item, index) in strand1"
                        :key="index"
                        :value="index"
                        > 
                          <div class="nucleotide" :id="`${item}-${index + 1}-strand1`">{{ item }} </div>

                          <v-icon class="hbond" v-if="index < strand1.length - 1">
                            mdi-dots-horizontal
                          </v-icon>

                          <v-icon class="vbond" v-if="index >= 1 && index < strand1.length - 1">
                            mdi-dots-vertical
                          </v-icon>

                          <v-icon class="dbond" v-if="index >= 1 && index < strand1.length - 2">
                            mdi-window-close
                          </v-icon>
                        </div>
                      </div>
                      <div class="end"> {{ ends1[1] }} </div>
                    </v-row>
                    <v-row class="pt-0 pb-2 px-4 project-row" justify="space-around">
                      <div class="end"> {{ ends2[0] }} </div>
                      <div class="d-flex">
                        <div 
                        class="gr-nucl" 
                        v-for="(item, index) in strand2"
                        :key="index"
                        :value="index"
                        > 
                          <div class="nucleotide" :id="`${item}-${index + 1}-strand2`">{{ item }} </div> 

                          <v-icon class="hbond" v-if="index < strand1.length - 1">
                            mdi-dots-horizontal
                          </v-icon>

                        </div>
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
                    v-model="section"
                    color="red-darken-4"
                    rounded="0"
                    mandatory
                  >
                    <v-btn value="0" @click="firstLevelChange"> <v-icon> mdi-heating-coil </v-icon> &nbsp;Backbone Torsions </v-btn>
                    <v-btn value="1" @click="firstLevelChange"> <v-icon> mdi-arrow-top-right-bottom-left mdi-rotate-135 </v-icon> &nbsp;Axis Base pair </v-btn>
                    <v-btn value="2" @click="firstLevelChange"> <v-icon> mdi-arrow-expand </v-icon> &nbsp;Intra-Base Pair HP's </v-btn>
                    <v-btn value="3" @click="firstLevelChange"> <v-icon> mdi-arrow-expand-all </v-icon> &nbsp;Inter-Base Pair HP's </v-btn>
                    <v-btn value="4" @click="firstLevelChange"> <v-icon style="transform: scaleX(-1);"> mdi-set-square mdi-rotate-45 </v-icon> &nbsp;Grooves </v-btn>
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

              <v-row justify="end" v-if="section">
                <v-col cols="12">
                  <AverageBackboneTorsions v-if="section === '0'" />
                  <AverageAxisBasePair v-if="section === '1'" />
                  <AverageIntraBasePair v-if="section === '2'" />
                  <AverageInterBasePair v-if="section === '3'" />
                  <AverageGrooves v-if="section === '4'" />
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

    import useInteractiveSequence from '@/modules/analysis/useInteractiveSequence'

    const { id } = useRoute().params
    const config = useRuntimeConfig()

    const { 
      getSequenceSettings
    } = useInteractiveSequence()

    const data = await useFetch(`${config.public.apiBase}/projects/${id}`)
    const project = ref(data.data.value.project)

    const title = project.value.metadata.NAME

    useHead({
      title: `Average results for ${title}`,
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@200;500&display=swap' }
      ]
    })

    /* HARDCODED WHILE NOT HAVING REST API */
    const sequence = 'GATACATACATAATACAAAC'
    const { strand1, strand2, ends1, ends2 } = getSequenceSettings(sequence)

    // FIRST LEVEL MENU
    const section = ref(null)

    const firstLevelChange = () => {
      
      switch(section.value) {
        case '0':
          document.querySelectorAll(`.hbond`).forEach(item => item.classList.add('bond-highlighted'))
          document.querySelectorAll(`.vbond`).forEach(item => item.classList.remove('bond-highlighted'))
          document.querySelectorAll(`.dbond`).forEach(item => item.classList.remove('bond-highlighted'))
          document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.add('nucl-highlighted'))
          break;
        case '1':
          document.querySelectorAll(`.vbond`).forEach(item => item.classList.add('bond-highlighted'))
          document.querySelectorAll(`.hbond`).forEach(item => item.classList.remove('bond-highlighted'))
          document.querySelectorAll(`.dbond`).forEach(item => item.classList.remove('bond-highlighted'))
          document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('nucl-highlighted'))
          document.querySelectorAll(`.nucleotide`).forEach(item => {
            var idx = parseInt(item.attributes.id.value.split('-')[1])
            if(idx > 1 && idx < strand1.length) item.classList.add('nucl-highlighted')
          })
          break;
        case '2':
          document.querySelectorAll(`.vbond`).forEach(item => item.classList.add('bond-highlighted'))
          document.querySelectorAll(`.hbond`).forEach(item => item.classList.remove('bond-highlighted'))
          document.querySelectorAll(`.dbond`).forEach(item => item.classList.remove('bond-highlighted'))
          document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('nucl-highlighted'))
          document.querySelectorAll(`.nucleotide`).forEach(item => {
            var idx = parseInt(item.attributes.id.value.split('-')[1])
            if(idx > 1 && idx < strand1.length) item.classList.add('nucl-highlighted')
          })
          break;
        case '3':
          document.querySelectorAll(`.dbond`).forEach(item => item.classList.add('bond-highlighted'))
          document.querySelectorAll(`.hbond`).forEach(item => item.classList.remove('bond-highlighted'))
          document.querySelectorAll(`.vbond`).forEach(item => item.classList.remove('bond-highlighted'))
          document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('nucl-highlighted'))
          document.querySelectorAll(`.nucleotide`).forEach(item => {
            var idx = parseInt(item.attributes.id.value.split('-')[1])
            if(idx > 1 && idx < strand1.length) item.classList.add('nucl-highlighted')
          })
          break;
        case '4':
          document.querySelectorAll(`.dbond`).forEach(item => item.classList.remove('bond-highlighted'))
          document.querySelectorAll(`.hbond`).forEach(item => item.classList.remove('bond-highlighted'))
          document.querySelectorAll(`.vbond`).forEach(item => item.classList.remove('bond-highlighted'))
          //document.querySelectorAll(`.nucleotide`).forEach(item => item.classList.remove('nucl-highlighted'))
          document.querySelectorAll(`.nucleotide`).forEach(item => {
            /*var idx = parseInt(item.attributes.id.value.split('-')[1])
            if(idx > 1 && idx < strand1.length) item.classList.add('nucl-highlighted')*/
            item.classList.add('nucl-highlighted')
          })
          break;
      }

    }

    // STICKY CONTAINER STRANDS 
    let sticky = ref(true)
    const onScroll = () => {
      //console.log(sticky.value)
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

    const breadcrumbs =  [
      {
        title: 'About',
        disabled: false,
        to: '/',
      },
      {
        title: 'Projects',
        disabled: true
      },
      {
        title: 'Overview',
        disabled: false,
        to: `/projects/${id}/overview`,
      },
      {
        title: `Average results for ${title}`,
        disabled: true
      }
    ]
  
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
    .gr-nucl {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      /*background-color: red;*/
    }
    .nucleotide {
      font-family: 'Roboto Mono', monospace;
      font-size: 1.5rem;
      font-weight: 500;
      padding: .5rem 0.35rem;
      margin: 0 0.15rem;
      color: var(--nucl-dis);
      user-select: none; 
    }
    .hbond {
      position: absolute;
      top: 1rem;
      left: 1.4rem;
      font-size: 1rem;
      color: var(--bond-dis);
      z-index: 2;
    }
    .vbond {
      position: absolute;
      top: 2.15rem;
      left: .35rem;
      font-size: 1.2rem;
      color: var(--bond-dis);
      z-index: 2;
    }
    .dbond {
      position: absolute;
      top: 2.15rem;
      left: 1.3rem;
      color: var(--bond-dis);
      z-index: 2;
    }
    .bond-highlighted { color: var(--palette-5); }
    .nucl-highlighted{ background-color: var(--light-text); color: var(--palette-4); }

    .v-btn-group {
      flex-direction: column;
      overflow: inherit !important;
      width: 100%;
    }
    .v-btn-group .v-btn{
      padding: .44rem .5rem;
      justify-content: start;
      text-transform: none;
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
      .nucleotide { padding: .3rem 0.25rem; }
      .hbond { top: .8rem; left: 1.3rem; font-size:.8rem; }
      .vbond { top: 1.7rem; left: .4rem; font-size:1rem;  }
      .dbond { top: 1.8rem; left: 1.2rem; font-size: 1rem; }
      .number { width: 1.72rem; }
      .end { padding: .5rem 0; font-size: 1.2rem; }
      .project-sheet{ overflow-x: auto;}
      .project-row { min-width: 630px; }
    }

    @media only screen and (max-width: 960px) {
      .v-btn-group {
        flex-direction: inherit;
        overflow: scroll !important;
      }
    }

    @media only screen and (max-width: 600px) {
      #header-container {
        flex-direction: column;
      }
      #header-container .v-btn {  margin-top: 1rem; }
    }
  </style>