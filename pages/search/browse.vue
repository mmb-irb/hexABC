<template>
  <v-container>

    <h1>Browse</h1>

    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon icon="mdi-circle-small"></v-icon>
      </template>
    </v-breadcrumbs>

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <v-icon size="small" icon="mdi-compass"></v-icon> &nbsp;BROWSE COLLECTION
          </template>

          <template v-slot:text>
            
            <!-- TODO PUT IN A COMPONENT -->
            <!-- TODO RESPONSIVE!!! -->
            <div 
            v-for="(item, index) in projects" 
            :key="index"
            :value="index"
            class="browse-list-item">

              <div class="browse-list-img-thumb fill-height bg-grey-lighten-3">
                <img src="https://bioexcel-cv19.bsc.es/static/media/rbd-ace2_preview.abbaa3a6db0fee81eae7.png" alt="browse" />
              </div>

              <div class="browse-list-content fill-height">
                <h3 class="bl-desc"><NuxtLink :to="`/projects/${item.accession}`">{{ item.name }}</NuxtLink></h3>
                <div class="bl-anal">
                  <h4>Analyses</h4>
                  <p>{{ printAnalyses(item.analyses) }}</p>
                </div>
              </div>

              <div class="browse-list-append fill-height">
                <v-tooltip
                  location="top"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      density="comfortable"
                      icon
                      :to="`/projects/${item.accession}`"
                      v-bind="props"
                    >
                      <v-icon color="blue-grey-darken-1">
                        mdi-clipboard-list-outline
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>View summary</span>
                </v-tooltip>

                <v-tooltip
                  location="bottom"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      density="comfortable"
                      icon
                      @click="previewTrajectory" 
                      v-bind="props"
                    >
                      <v-icon color="blue-grey-darken-1">
                        mdi-filmstrip-box
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Preview trajectory</span>
                </v-tooltip>
        
              </div>

            </div>

            <v-row justify="space-between" class="pt-5 " > 
              <v-col lg="2" md="2" sm="4" xs="12">
                <v-select
                  v-model="rows"
                  label="Rows per page"
                  :items="[5, 10, 25, 50]"
                  @update:modelValue="paginate"
                ></v-select>
              </v-col>
              <v-col lg="10" md="10" sm="8" xs="12">
                <v-pagination
                  v-model="page"
                  :length="total"
                  :total-visible="totalVisible"
                  @update:modelValue="paginate"
                ></v-pagination>
              </v-col>
            </v-row>

          </template>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { ref } from 'vue';

  const { $globals } = useNuxtApp()
  const config = useRuntimeConfig()

  useHead({
    title: 'Browse collection' 
  })

  const breadcrumbs =  [
    {
      title: 'About',
      disabled: false,
      to: '/',
    },
    {
      title: 'Search',
      disabled: true
    },
    {
      title: 'Browse',
      disabled: true
    }
  ]
  
  /* FIRST LOAD */
  const browseList = await useFetch(`${config.public.apiBase}/projects/list?limit=10&page=1`)
  const rows = ref(10)
  const total = ref(Math.ceil(browseList.data.value.total/rows.value))
  const projects = ref(browseList.data.value.projects)

  /* ANALYSES */
  const analyses = $globals.projects.analyses

  const printAnalyses = (anls) => {
    let anlsList = []
    for (const anl of anls) {
      anlsList.push(analyses.filter(item => item.id === anl)[0].name)
    }
    anlsList.sort()
    return anlsList.join(', ')
  }

  /* PREVIEW TRAJECTORY (TODO) */
  const previewTrajectory = () => {
    console.log('previewTrajectory')
  }

  /* PAGINATION */
  const page = ref(1)

  const totalVisible = ref(10)
  const calculateTotalVisible = () => {
    if(window.innerWidth > 960) totalVisible.value = 10
    else if(window.innerWidth <= 960 && window.innerWidth > 780) totalVisible.value = 6
    else if(window.innerWidth <= 780 && window.innerWidth > 600) totalVisible.value = 4
    else totalVisible.value = 3
  }
  calculateTotalVisible()
  window.addEventListener('resize', () => calculateTotalVisible())

  const paginate = async () => {
    const browseList = await useFetch(`${config.public.apiBase}/projects/list?limit=${rows.value}&page=${page.value}`)
    projects.value = browseList.data.value.projects
    total.value = Math.ceil(browseList.data.value.total/rows.value)
    if(browseList.data.value.projects.length === 0) {
      page.value = 1
      paginate()
    }
  }

</script>

<style scoped>
  .browse-list-item { 
    display: grid;
    grid-template-areas: "prepend content append";
    grid-template-columns: max-content 1fr auto;
    padding-bottom: 1rem;
  }
  .browse-list-img-thumb { 
    align-items: center;
    align-self: center;
    display: flex;
    grid-area: prepend;
    margin-right: 1rem;
    border-bottom: solid 1px var(--palette-2);
  }
  .browse-list-img-thumb img {
    max-height: 100px;
    
  }
  .browse-list-content {
    align-self: self-start;
    grid-area: content;
    padding-top: .7rem;
    padding-left: 2rem;
    padding-right: .5rem;
  }
  h3 a { text-decoration: none; color: var(--palette-4); }
  h3 a:hover { color: var(--palette-6); }
  .bl-anal { margin-top: 1rem; margin-right: .5rem; border-bottom: solid 1px var(--palette-2); }
  h4 { text-transform: uppercase; font-size: 14px; color: var(--dark-text); font-weight:700;}
  .bl-anal p { color: var(--dark-text); font-weight:400; margin-top: .25rem; }
  .browse-list-append {
    align-self: center;
    display: flex;
    align-items: center;
    grid-area: append;
    flex-wrap: wrap;
    width: 37px;
    border-bottom: solid 1px var(--palette-2);
  }
  .browse-list-append .v-btn { margin-bottom: .5rem; }
</style>