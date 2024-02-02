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

                <p>Using the below <strong>interactive sequence</strong>, users can select the desired <strong>nucleotides</strong> (single or grouped) in order to <strong>view</strong> them in the <strong>3D visualization</strong> at right. Selection can be performed either <strong>clicking and dragging</strong> over a <strong>group of nucleotides</strong> or <strong>clicking</strong> them individually while <strong>pressing shift / ⇧</strong> key at the same time for <strong>multiple selection</strong>.</p>

                <SequenceInteractive 
                  :strands="{ strand1: strand1, strand2: strand2 }" 
                  type="compact"
                  :hover="true"
                  @dsEnd="handleDsEnd" 
                  @dsStart="handleDsStart" 
                  @dsUpdate="handleDsUpdate" 
                  @nuclMouseOver="handleNuclMouseOver" 
                  @nuclMouseOut="handleNuclMouseOut" 
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
  const { strand1, strand2 } = getSequenceSettings(sequence)

  let stage = null
  onMounted(async () => {

    stage = createStage("viewport", true)
    stage.setParameters({ backgroundColor: '#dedede' });

    const topology = await useFetch(`${config.public.apiBase}/projects/${id}/topology`)
    const blob = new Blob([topology.data.value], { type: "text/plain" });

    stage.loadFile(blob, { defaultRepresentation: false, ext: 'pdb'})
      .then(async function (component) {
        /*component.addRepresentation("cartoon");
        component.addRepresentation("base");*/
        component.addRepresentation("licorice", { sele: "nucleic", color: '#ccc' });
        component.autoView('nucleic');
      })

    window.addEventListener("resize", () => stage.viewer.handleResize())

  })

  /* HANDLE MAGIC SEQUENCE */

  const selecting = ref(false)

  let selectBP = null
  const handleDsStart = () => {
    console.log('selection started');
    selecting.value = true
  }

  const handleDsUpdate = (items) => {
    console.log('selection updated', items.length);
    const residues = items.map((item) => item.id.split('-')[1] )

    if(items.length > 0) {
      stage.compList[0].removeRepresentation(selectBP);
      selectBP = stage.compList[0].addRepresentation( "ball+stick", {
        sele: residues.join(' '), radius: .2
      } );
    }
  }

  const handleDsEnd = (items) => {

    if(items.length === 0) stage.compList[0].removeRepresentation(selectBP);
    else {
      const residues = items.map((item) => item.id.split('-')[1] )
      stage.compList[0].removeRepresentation(selectBP);
      selectBP = stage.compList[0].addRepresentation( "ball+stick", {
        sele: residues.join(' '), radius: .2
      } );
    
    }

    selecting.value = false
  }

  let hoverBP = null
  const handleNuclMouseOver = (id) => {
    if(!selecting.value) {
      var res = id.split('-')[1];
      hoverBP = stage.compList[0].addRepresentation( "licorice", {
        sele: res, radius: .4, opacity: 0.6
      } );
    }
  }

  const handleNuclMouseOut = (id) => {
    if(!selecting.value) {
      stage.compList[0].removeRepresentation(hoverBP);	
    }
  }

</script>

<style scoped> 
  #viewport { width: 100%; height: 400px; }
</style>