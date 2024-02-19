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
              <v-col lg="8" md="6" sm="12" cols="12">

                <p>Using the below <strong>interactive sequence</strong>, users can select the desired <strong>nucleotides</strong> (single or grouped) in order to <strong>view</strong> them in the <strong>3D visualization</strong> at right. Selection can be performed either <strong>clicking and dragging</strong> over a <strong>group of nucleotides</strong> or <strong>clicking</strong> them individually while <strong>pressing shift / ⇧</strong> key at the same time for <strong>multiple selection</strong>.</p>

                <SequenceInteractive 
                  :strands="{ strand1: strand1, strand2: strand2 }" 
                  type="common"
                  :hover="true"
                  @dsEnd="handleDsEnd" 
                  @dsStart="handleDsStart" 
                  @dsUpdate="handleDsUpdate" 
                  @nuclMouseOver="handleNuclMouseOver" 
                  @nuclMouseOut="handleNuclMouseOut" 
                  ref="seqInteractiveRef"
                />

                <HexamersSelector 
                  :strands="{ strand1: strand1, strand2: strand2 }" 
                  @selectHexamer="selectHexamer"
                  ref="hexSelectorRef"
                />

              </v-col>
              <v-col lg="4" md="6" sm="12" cols="12" >
                <TrajectoryViewer :id="id" ref="trjViewerRef" />
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
            <v-icon size="small" icon="mdi-chart-box-multiple-outline"></v-icon> &nbsp;QUALITY CONTROL ANALYSES
          </template>

          <template v-slot:text>

            <v-row>
                <v-col cols="12">
                  <v-select
                    label="Select Analysis"
                    v-model="modelAnalyses"
                    :items="itemsAnal"
                    variant="outlined"
                    density="compact"
                    @update:modelValue="selectAnalyses"
                  >
                    <template v-slot:selection="{ item, index }">
                      {{ item.raw.title }}                  
                      </template>
                    <template v-slot:item="{ props, item }">
                      <v-list-item 
                        class="item-v-select" 
                        v-bind="props" 
                        :title="item.raw.title" 
                        :value="item.raw.value" 
                        :prepend-icon="item.raw.icon" 
                        :disabled="item.raw.value === 'section'"
                      ></v-list-item>
                    </template>
                  </v-select>
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
            <v-icon size="small" icon="mdi-rotate-orbit"></v-icon> &nbsp;HELICAL PARAMETERS ANALYSES
          </template>

          <template v-slot:text>

            <v-row> 
              <v-col lg="3" md="4" sm="6" xs="12">
                <AnalysisButton 
                  :id="id"
                  :image="avgImg"
                  slug="curves-average"
                  title="Average Results"
                />
              </v-col>

              <v-col lg="3" md="4" sm="6" xs="12">
                <AnalysisButton 
                  :id="id"
                  :image="timeImg"
                  slug="curves-time"
                  title="Results by Time"
                />
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
            <v-icon size="small" icon="mdi-dots-grid"></v-icon> &nbsp;INTERACTIONS ANALYSES
          </template>

          <template v-slot:text>

            <v-row> 
              <v-col lg="3" md="4" sm="6" xs="12">
                <AnalysisButton 
                  :id="id"
                  :image="hbondsImg"
                  slug="hbonds"
                  title="Hydrogen Bonds"
                />
              </v-col>
              <v-col lg="3" md="4" sm="6" xs="12">
                <AnalysisButton 
                  :id="id"
                  :image="distImg"
                  slug="dist-res-average"
                  title="Distance per residue"
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
  import avgImg from '/img/projects/analyses/curves/curves-average.png'
  import timeImg from '/img/projects/analyses/curves/curves-time.png'
  import hbondsImg from '/img/projects/analyses/hbonds/hbonds.png'
  import distImg from '/img/projects/analyses/distance/distance.png'

  import useInteractiveSequence from '@/modules/analysis/useInteractiveSequence'

  const { id } = useRoute().params
  const config = useRuntimeConfig()
  const { $globals } = useNuxtApp()

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

  /* QUALITY CONTROL */
  const analyses = $globals.projects.analyses
  const itemsAnal = analyses.filter(item => item.section === 'qc').map(item => ({ title: item.name, value: item.id, icon: item.icon }))
  const modelAnalyses = ref(null)

  const selectAnalyses = async () => {
    await navigateTo(`/projects/${id}/${modelAnalyses.value}`)
  }

  /* SEQUENCE */
  const sequence = project.value.metadata.SEQUENCES[0]
  const { strand1, strand2 } = getSequenceSettings(sequence)

  const trjViewerRef = ref(null)

  /* HANDLE MAGIC SEQUENCE INTERACTION WITH NGL */

  const selecting = ref(false)
  const seqInteractiveRef = ref(null)

  let selectBP = null
  const handleDsStart = () => {
    hexSelectorRef.value.resetSelector()
    selecting.value = true
  }

  const handleDsUpdate = (items) => {
    const residues = items.map((item) => item.id.split('-')[1] )

    if(items.length > 0) {
      trjViewerRef.value.removeRepresentation(selectBP);
      selectBP = trjViewerRef.value.addRepresentation("ball+stick", { sele: residues.join(' '), radius: .2 })
    }
  }

  const handleDsEnd = (items) => {

    if(items.length === 0) trjViewerRef.value.removeRepresentation(selectBP);
    else {
      const residues = items.map((item) => item.id.split('-')[1] )
      trjViewerRef.value.removeRepresentation(selectBP);
      selectBP = trjViewerRef.value.addRepresentation("ball+stick", { sele: residues.join(' '), radius: .2 })
    }

    selecting.value = false
  }

  let hoverBP = null
  const handleNuclMouseOver = (id) => {
    if(!selecting.value) {
      var res = id.split('-')[1];
      hoverBP = trjViewerRef.value.addRepresentation("licorice", { sele: res, radius: .4, opacity: 0.6 })
    }
  }

  const handleNuclMouseOut = (id) => {
    if(!selecting.value) {
      trjViewerRef.value.removeRepresentation(hoverBP)
    }
  }

  /* HEXAMER SELECTOR */

  const hexSelectorRef = ref(null)

  const selectHexamer = (hexamer1, hexamer2) => {

    // get NGL selection (only residue numbers)
    const sel1 = `${hexamer1.index}-${hexamer1.index+5}`
    // get NGL complementary selection (only residue numbers)
    const sel2 = `${sequence.length*2 - (hexamer1.index+5) + 1}-${sequence.length*2 - (hexamer1.index+5) + 6}`

    // NGL representation
    trjViewerRef.value.removeRepresentation(selectBP);
    selectBP = trjViewerRef.value.addRepresentation("ball+stick", { sele: `${sel1} ${sel2}`, radius: .2 });

    // get nucleotides with SequenceInteractive id notation for selected hexamer
    const nuclsList1 = hexamer1.string.split('')
    const nucleotides1 = nuclsList1.map((item, index) => {
      return `${item}-${hexamer1.index + index}-strand${hexamer1.strand}`
    })
    // get nucleotides with SequenceInteractive id notation for complementary hexamer
    const nuclsList2 = hexamer2.string.split('')
    const nucleotides2 = nuclsList2.map((item, index) => {
      return `${item}-${hexamer2.index + index}-strand${hexamer2.strand}`
    })

    // mix both nucleotides arrays
    const nucleotides = [...nucleotides1, ...nucleotides2];

    seqInteractiveRef.value.clearSelection();
    seqInteractiveRef.value.selectDynamic(nucleotides);

  }

</script>

<style scoped> 
  
</style>