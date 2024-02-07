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

                <SequenceInteractive 
                  :strands="{ strand1: strand1, strand2: strand2 }" 
                  :ends="{ ends1: ends1, ends2: ends2 }" 
                  @dsEnd="handleDsEnd" 
                  @dsStart="handleDsStart" 
                />

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
              
              <StickyDisable @cSticky="controlSticky" />

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
                <TimeBackboneTorsions v-if="section === '0'" :label="seqLabel" :stype="seqType" :nucl="selNucl" :id="id" />
                <TimeAxisBasePair v-if="section === '1'" :label="seqLabel" :stype="seqType" :nucl="selNucl" :id="id" />
                <TimeIntraBasePair v-if="section === '2'" :label="seqLabel" :stype="seqType" :nucl="selNucl" :id="id" />
                <TimeInterBasePair v-if="section === '3'" :label="seqLabel" :stype="seqType" :nucl="selNucl" :id="id" />
                <TimeGrooves v-if="section === '4'" :label="seqLabel" :stype="seqType" :nucl="selNucl" :id="id" />
              </v-col>
            </v-row>

          </template>
        </v-card>
      </v-col>

      <StickyEnable @cSticky="controlSticky" />

    </v-row>
    
  </v-container>
</template>

<script setup>

  import useInteractiveSequence from '@/modules/analysis/useInteractiveSequence'
  import useScroll from '@/modules/analysis/useScroll' 

  const { id } = useRoute().params
  const config = useRuntimeConfig()

  const datap = await useFetch(`${config.public.apiBase}/projects/${id}`)
  if(datap.status.value === 'error')  throw createError({ statusCode: datap.error.value.statusCode, message: datap.error.value.statusMessage, fatal: true })
  const project = ref(datap.data.value)

  const title = project.value.metadata.NAME

  const { 
    getSequenceSettings, 
    checkNucleotides,
    addBordersToNucleotides,
    removeBordersFromNucleotides
  } = useInteractiveSequence()
  const { scrolling, ctrlSticky } = useScroll()

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
  
  const selNucl = ref('')
  const seqLabel = ref('')
  const seqType = ref('')

  // FIRST LEVEL MENU
  const section = ref(null)
  let activeMenu = []

  const firstLevelChange = (v) => {

    // trick for reenabling buttons (they disable themselves when clicked)
    setTimeout(() => {
      enableSectionButtons(activeMenu)
    }, 1);

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

  /* HANDLE MAGIC SEQUENCE */

  const handleDsStart = () => {
    //console.log('selection started');
    removeBordersFromNucleotides()
  }

  const handleDsEnd = (items) => {
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
      // update nucleotides, label & type
      selNucl.value = checkNuc.nucleotides
      seqLabel.value = checkNuc.label
      seqType.value = checkNuc.type
    } else {
      // get message
      message.value = checkNuc.msg
    }

    alertType.value = checkNuc.alert
    showAlert.value = !checkNuc.status
  }

  // STICKY CONTAINER STRANDS 
  let sticky = ref(true)
  const onScroll = () => {
    if(sticky.value === false) return
    scrolling('#container-strands', '#sticky-disable')
  }
  
  window.addEventListener('scroll', onScroll)    

  onUnmounted(() => window.removeEventListener('scroll', onScroll))

  const controlSticky = () => {
    sticky.value = !sticky.value
    ctrlSticky(sticky.value, '#container-strands', '#sticky-disable', '#sticky-enable')
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

  @media only screen and (max-width: 1280px) {
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