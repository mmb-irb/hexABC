<template>
  <v-container>

    <h1>{{ title }}</h1>

    <Breadcrumbs :props="{title: title}" />

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <v-icon size="small" icon="mdi-text-box-search"></v-icon> &nbsp;OVERVIEW
          </template>

          <template v-slot:text>

            <p>{{ project.metadata.DESCRIPTION }}</p>

          </template>
        </v-card>
      </v-col>
    </v-row>

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <v-icon size="small" icon="mdi-atom-variant"></v-icon> &nbsp;TRAJECTORY
          </template>

          <template v-slot:text>

            <v-row class="mt-3"> 
              <v-col lg="7" md="6" sm="12" cols="12">

                <p>Using the below <strong>interactive sequence</strong>, users can select the desired <strong>nucleotides</strong> (single or grouped) in order to <strong>view</strong> them in the <strong>3D visualization</strong> at right. <strong>Nucleotides</strong> can be selected <strong>individually</strong> <img src="/img/projects/analyses/curves/nucleotide.png" alt="nucleotide" style="vertical-align: middle;" /> , by <strong>base step</strong>  <img src="/img/projects/analyses/curves/base-step.png" alt="base step" style="vertical-align: middle;" /> , by <strong>base pair</strong> <img src="/img/projects/analyses/curves/base-pair.png" alt="base pair" style="vertical-align: middle;" /> , by <strong>base pair step</strong> <img src="/img/projects/analyses/curves/base-pair-step.png" alt="base pair step" style="vertical-align: middle;" /> , by <strong>tetramers</strong> <img src="/img/projects/analyses/curves/tetramer.png" alt="tetramer" style="vertical-align: middle;" />  and by <strong>hexamers</strong>  <img src="/img/projects/analyses/curves/hexamer.png" alt="hexamer" style="vertical-align: middle;" /> . </p>

                <SequenceInteractive 
                  :strands="{ strand1: strand1, strand2: strand2 }" 
                  type="compact"
                  @dsEnd="handleDsEnd" 
                  @dsStart="handleDsStart" 
                />
              </v-col>
              <v-col lg="5" md="6" sm="12" cols="12" >
                <!-- TO PUT IN A NEW COMPONENT??? -->
                <div id="viewport"></div>
              </v-col>
            </v-row>

          </template>
        </v-card>
      </v-col>
    </v-row>

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <v-icon size="small" icon="mdi-chart-box-multiple-outline"></v-icon> &nbsp;ANALYSES
          </template>

          <template v-slot:text>

            <v-row> 
              <v-col lg="3" md="4" sm="6" xs="12">
                <AnalysisButton 
                  :id="id"
                  :image="curvesImg"
                  slug="curves-average"
                  title="Curves Average"
                />
              </v-col>

              <v-col lg="3" md="4" sm="6" xs="12">
                <AnalysisButton 
                  :id="id"
                  :image="hbondsImg"
                  slug="hbonds"
                  title="HBonds Average"
                />
              </v-col>
            </v-row>

          </template>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>

  // vuetify images must be imported like this (and they cannot be imported in the AnalysisButton.vue component)
  import curvesImg from '/img/projects/analyses/curves/curves-analyses.png'
  import hbondsImg from '/img/projects/analyses/hbonds/hbonds.png'

  import useStage from '@/modules/ngl/useStage'
  import useInteractiveSequence from '@/modules/analysis/useInteractiveSequence'

  const { id } = useRoute().params
  const config = useRuntimeConfig()

  const { createStage, /*getStage, createTrajectoryPlayer*/ } = useStage()
  const { 
    getSequenceSettings
  } = useInteractiveSequence()

  const datap = await useFetch(`${config.public.apiBase}/projects/${id}`)
  if(datap.status.value === 'error')  throw createError({ statusCode: datap.error.value.statusCode, message: datap.error.value.statusMessage, fatal: true })
  const project = ref(datap.data.value)  

  const title = project.value.metadata.NAME

  useHead({
    title: title,
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@200;500&display=swap' }
    ]
  })

  const sequence = project.value.metadata.SEQUENCES[0]
  const { strand1, strand2, ends1, ends2 } = getSequenceSettings(sequence)

  onMounted(async () => {

    const stage = createStage("viewport")
    stage.setParameters({ backgroundColor: '#dedede' });

    const topology = await useFetch(`${config.public.apiBase}/projects/${id}/topology`)
    const blob = new Blob([topology.data.value], { type: "text/plain" });

    stage.loadFile(blob, { defaultRepresentation: false, ext: 'pdb'})
      .then(async function (component) {
        component.addRepresentation("cartoon");
        component.addRepresentation("base");
        component.autoView('nucleic');
      })

    window.addEventListener("resize", () => stage.viewer.handleResize())

  })

  /* HANDLE MAGIC SEQUENCE */

  const handleDsStart = () => {
    console.log('selection started');
    //removeBordersFromNucleotides()
  }

  const handleDsEnd = (items) => {
    console.log('selection ended');
    //addBordersToNucleotides(items)
  }

</script>

<style scoped> 
  #viewport { width: 100%; height: 400px; }
</style>