<template>
  <v-container>

    <h1>Curves Average Results</h1>

    <Breadcrumbs :props="{id: id, text: 'Average results ', title: title}" />

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

                <SequenceAverage :strands="{ strand1: strand1, strand2: strand2 }" :ends="{ ends1: ends1, ends2: ends2 }" ref="seqAverageRef" />

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

              <StickyDisable @cSticky="controlSticky" />
              
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

      <StickyEnable @cSticky="controlSticky" />

    </v-row>

  </v-container>
</template>

<script setup>

  import useInteractiveSequence from '@/modules/analysis/useInteractiveSequence'
  import useScroll from '@/modules/analysis/useScroll' 

  const { id } = useRoute().params
  const config = useRuntimeConfig()

  const { 
    getSequenceSettings
  } = useInteractiveSequence()
  const { scrolling, ctrlSticky } = useScroll()

  const datap = await useFetch(`${config.public.apiBase}/projects/${id}`)
  if(datap.status.value === 'error')  throw createError({ statusCode: datap.error.value.statusCode, message: datap.error.value.statusMessage, fatal: true })
  const project = ref(datap.data.value)

  const title = project.value.metadata.NAME

  useHead({
    title: `Average results for ${title}`,
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@200;500&display=swap' }
    ]
  })

  const sequence = project.value.metadata.SEQUENCES[0]
  const { strand1, strand2, ends1, ends2 } = getSequenceSettings(sequence)

  // FIRST LEVEL MENU
  const section = ref(null)
  const seqAverageRef = ref(null)

  // interaction with SequenceAverage component
  const firstLevelChange = () => {
    seqAverageRef.value.drawSequence(section.value);
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
  .v-btn-group .v-btn{
    padding: .44rem .5rem;
    justify-content: start;
    text-transform: none;
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