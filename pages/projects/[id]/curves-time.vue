<template>
    <v-container>
  
      <h1>Curves Results by Time</h1>
  
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:divider>
          <v-icon icon="mdi-circle-small"></v-icon>
        </template>
      </v-breadcrumbs>
  
      <v-row> 
        <v-col cols="12">
          <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

            <template v-slot:title>
              <div style="display: flex; justify-content: space-between;">
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

              <p>Using the below <strong>interactive sequence</strong>, users can select the desired <strong>nucleotides</strong> (single or grouped) in order to view the different <strong>analyses</strong>. <strong>Nucleotides</strong> can be selected <strong>individually</strong> <img src="/img/projects/analyses/curves/nucleotide.png" alt="nucleotide" style="vertical-align: middle;" /> , by <strong>base step</strong>  <img src="/img/projects/analyses/curves/base-step.png" alt="base step" style="vertical-align: middle;" /> , by <strong>base pair</strong> <img src="/img/projects/analyses/curves/base-pair.png" alt="base pair" style="vertical-align: middle;" /> , by <strong>base pair step</strong> <img src="/img/projects/analyses/curves/base-pair-step.png" alt="base pair step" style="vertical-align: middle;" /> , by <strong>tetramers</strong> <img src="/img/projects/analyses/curves/tetramer.png" alt="tetramer" style="vertical-align: middle;" />  and by <strong>hexamers</strong>  <img src="/img/projects/analyses/curves/hexamer.png" alt="hexamer" style="vertical-align: middle;" /></p>

              

            </template>
          </v-card>
        </v-col>
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
      removeBordersFromNucleotides } = useInteractiveSequence()

    useHead({
      title: `Results by time for ${title}`,
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
        title: 'Overview',
        disabled: false,
        to: `/projects/${id}/overview`,
      },
      {
        title: `Results by time for ${title}`,
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