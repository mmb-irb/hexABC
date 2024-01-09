<template>
    <v-container>
  
      <h1>TITLE</h1>
  
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:divider>
          <v-icon icon="mdi-circle-small"></v-icon>
        </template>
      </v-breadcrumbs>
  
      <v-row> 
        <v-col cols="12">
          <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

            <template v-slot:title>
              <v-icon size="small" icon="mdi-poll"></v-icon> &nbsp;ANALYSES FOR TITLE
            </template>

            <template v-slot:text>

              <p>Using the below <strong>interactive sequence</strong>, users can select the desired <strong>nucleotides</strong> (single or grouped) in order to view the different <strong>analyses</strong>. <strong>Nucleotides</strong> can be selected <strong>individually</strong> <img src="/img/projects/analyses/curves/nucleotide.png" alt="nucleotide" style="vertical-align: middle;" /> , by <strong>base step</strong>  <img src="/img/projects/analyses/curves/base-step.png" alt="base step" style="vertical-align: middle;" /> , by <strong>base pair</strong> <img src="/img/projects/analyses/curves/base-pair.png" alt="base pair" style="vertical-align: middle;" /> , by <strong>base pair step</strong> <img src="/img/projects/analyses/curves/base-pair-step.png" alt="base pair step" style="vertical-align: middle;" /> , by <strong>tetramers</strong> <img src="/img/projects/analyses/curves/tetramer.png" alt="tetramer" style="vertical-align: middle;" />  and by <strong>hexamers</strong>  <img src="/img/projects/analyses/curves/hexamer.png" alt="hexamer" style="vertical-align: middle;" /></p>

              <v-sheet
                color="grey-lighten-4"
                class="pa-10 project-sheet"
                id="container-strands"
              >
                <v-row class="project-row" justify="center">
                  <div 
                    class="number" 
                    v-for="(item, index) in strand1"
                    :key="index"
                    :value="index"
                    > {{ index + 1 }} </div>
                </v-row>
                <v-row class="pb-1 pt-2 px-4 project-row" justify="space-around">
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
                <v-row class="pt-1 pb-2 px-4 project-row" justify="space-around">
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

              <v-row class="mt-8">

                <v-col v-if="showAlert">
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
                
                <v-col v-if="!showAlert">
                  <v-row>
                    <div v-html="message"></div>
                  </v-row>

                  <v-row justify="center" class="pt-5">

                    <v-btn-toggle
                      v-model="toggle"
                      color="primary"
                    >
                      <v-btn
                      prepend-icon="mdi-chart-bell-curve"
                      color="red-accent-4"
                      >Average Results</v-btn>
                      <v-btn prepend-icon="mdi-timer-outline"
                      color="red-accent-4"
                      >Results by Time</v-btn>
                    </v-btn-toggle>

                  </v-row>

                  <v-row justify="end" class="pt-5">
                    <v-tabs
                      v-model="tab1"
                      show-arrows
                      color="red-darken-4"
                      align-tabs="end"
                    >
                      <v-tab :value="0">Backbone Torsions</v-tab>
                      <v-tab :value="1">Axis Base pair</v-tab>
                      <v-tab :value="2">Intra-Base Pair Helical Parameters</v-tab>
                      <v-tab :value="3">Inter-Base Pair Helical Parameters</v-tab>
                      <v-tab :value="4">Grooves</v-tab>
                    </v-tabs>

                    <v-window v-model="tab1" class="elevation-2">

                      <v-window-item :value="0">
                        <v-card flat>
                          <v-card-text>
                            
                            <div class="d-flex flex-row">
                            <v-tabs
                              v-model="tab1_1"
                              direction="vertical"
                              color="primary"
                            >
                              <v-tab value="0">
                                <img src="/img/projects/analyses/curves/base-pair/inclination.png" alt="base step" style="width:50px; margin-right: 10px;" />
                                Alpha torsions
                              </v-tab>
                              <v-tab value="1">
                                <img src="/img/projects/analyses/curves/base-pair/inclination.png" alt="base step" style="width:50px; margin-right: 10px;" />
                                Beta Torsions
                              </v-tab>
                              <v-tab value="2">
                                <img src="/img/projects/analyses/curves/base-pair/inclination.png" alt="base step" style="width:50px; margin-right: 10px;" />
                                Gamma torsions
                              </v-tab>
                              <v-tab value="2">
                                <img src="/img/projects/analyses/curves/base-pair/inclination.png" alt="base step" style="width:50px; margin-right: 10px;" />
                                Epsilon torsions
                              </v-tab>
                              <v-tab value="2">
                                <img src="/img/projects/analyses/curves/base-pair/inclination.png" alt="base step" style="width:50px; margin-right: 10px;" />
                                Zeta torsions
                              </v-tab>
                              <v-tab value="2">
                                <img src="/img/projects/analyses/curves/base-pair/inclination.png" alt="base step" style="width:50px; margin-right: 10px;" />
                                Chi torsions
                              </v-tab>
                              <v-tab value="2">
                                <img src="/img/projects/analyses/curves/base-pair/inclination.png" alt="base step" style="width:50px; margin-right: 10px;" />
                                Phase torsions
                              </v-tab>
                            </v-tabs>

                            <v-window v-model="tab1_1">

                              <v-window-item :value="0">
                                <v-card flat>
                                  <v-card-text>Option 1 Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Aliquam lobortis. Aliquam lobortis. Suspendisse non nisl sit amet velit hendrerit rutrum.</v-card-text>
                                </v-card>
                              </v-window-item>

                              <v-window-item :value="1">
                                <v-card flat>
                                  <v-card-text>Option 2 Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Aliquam lobortis. Aliquam lobortis. Suspendisse non nisl sit amet velit hendrerit rutrum.</v-card-text>
                                </v-card>
                              </v-window-item>

                              <v-window-item :value="2">
                                <v-card flat>
                                  <v-card-text>Option 2 Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Aliquam lobortis. Aliquam lobortis. Suspendisse non nisl sit amet velit hendrerit rutrum.</v-card-text>
                                </v-card>
                              </v-window-item>

                            </v-window>

                          </div>

                          </v-card-text>
                        </v-card>
                      </v-window-item>

                      <v-window-item :value="1">
                        <v-card flat>
                          <v-card-text>Axis Base pair</v-card-text>
                        </v-card>
                      </v-window-item>

                      <v-window-item :value="2">
                        <v-card flat>
                          <v-card-text>Intra-Base Pair Helical Parameters</v-card-text>
                        </v-card>
                      </v-window-item>

                      <v-window-item :value="3">
                        <v-card flat>
                          <v-card-text>Inter-Base Pair Helical Parameters</v-card-text>
                        </v-card>
                      </v-window-item>

                      <v-window-item :value="4">
                        <v-card flat>
                          <v-card-text>Grooves</v-card-text>
                        </v-card>
                      </v-window-item>

                    </v-window>

                  </v-row>
                  
                </v-col>

              </v-row>

            </template>
          </v-card>
        </v-col>
      </v-row>

  
    </v-container>
  </template>
  
  <script setup>

    import DragSelect from 'dragselect'
    import useInteractiveSequence from '@/modules/analysis/useInteractiveSequence'

    const { 
      getSequenceSettings, 
      checkNucleotides,
      addBordersToNucleotides,
      removeBordersFromNucleotides } = useInteractiveSequence()

    useHead({
      title: 'TITLE',
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@200;500&display=swap' }
      ]
    })
  
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
        title: 'TITLE',
        disabled: true
      }
    ]

    let message = ref('Please start making a <strong>selection</strong> of one or more <strong>nucleotides</strong>, either clicking them one by one or selecting a group with the mouse.')
    let showAlert = ref(true)
    let alertType = ref('info')

    let toggle = ref(0)
    let tab1 = ref(0)
    let tab1_1 = ref(0)

    const tab1Items = [
      { id: 0, text: 'One Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
      { id: 1, text: 'Two Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
      { id: 2, text: 'Three Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
      { id: 3, text: 'Four Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
      { id: 4, text: 'Five Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
    ]

    /* HARDCODED WHILE NOT HAVING REST API */
    const sequence = 'GATACATACATAATACAAAC'
    const { strand1, strand2, ends1, ends2 } = getSequenceSettings(sequence)
    
    onMounted(async () => {
      const ds = new DragSelect({
        selectables: document.getElementsByClassName("nucleotide"),
        area: document.getElementById("container-strands"),
        draggability: false,
        multiSelectKeys: ['Shift']
      });

      ds.subscribe("DS:start", (e) => {
        //console.log('selection started');
        removeBordersFromNucleotides()
      });

      ds.subscribe("DS:end", ({items}) => {

        // TODO: SEE IF LOADING OF DIFFERENT COMPONENTS WORKS WITH V-IF OR NOT

        const nucleotides = items.map((item) => item.id )

        const checkNuc = checkNucleotides(nucleotides, sequence.length)

        if (checkNuc.status) {
          message.value = checkNuc.msg
          // modify styles
          //console.log('style')
          addBordersToNucleotides(nucleotides)
          //console.log(message.value)
        } else {
          message.value = checkNuc.msg
          //removeBordersFromNucleotides(nucleotides)
        }

        alertType.value = checkNuc.alert
        showAlert.value = !checkNuc.status

      });

    })

    const onScroll = () => {
      if(document.querySelector("#container-strands").getBoundingClientRect().y <= 50) {
        document.querySelector("#container-strands").style.position = 'sticky'
        document.querySelector("#container-strands").style.top = '50px'
        document.querySelector("#container-strands").classList.add('elevation-3')
      } else {
        document.querySelector("#container-strands").style.position = 'relative'
        document.querySelector("#container-strands").style.top = 'inherit'
        document.querySelector("#container-strands").classList.remove('elevation-3')
      }
    }
    window.addEventListener('scroll', onScroll)
  
  </script>
  
  <style scoped>
    #container-strands {
      position:sticky; z-index:10;
    }
    /* for making sticky working */
    .v-card {
      overflow: inherit !important;  
    }
    .nucleotide {
      font-family: 'Roboto Mono', monospace;
      font-size: 2rem;
      font-weight: 500;
      padding: .75rem 0.35rem;
      margin: 0 0.15rem;
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
    .number {
      font-family: monospace;
      font-size: .75rem;
      width: 2.22rem;
      text-align: center;
      color: var(--palette-2);
      user-select: none; 
      line-height: .2rem;
    }
    .end {
      font-family: 'Roboto Mono', monospace;
      font-size: 1.5rem;
      font-weight: 200;
      color: var(--strand-end);
      user-select: none; 
      padding: .75rem 0;
    }
    .project-sheet{ overflow: hidden;}

    @media only screen and (max-width: 1280px) {
      .nucleotide { /*padding: 0 0.35rem;*/ padding: .5rem 0.25rem; }
      .number { width: 2rem; }
      .end { padding: .5rem 0; font-size: 1.2rem; }
      .project-sheet{ overflow-x: auto;}
      .project-row { min-width: 740px; }
    }
  </style>