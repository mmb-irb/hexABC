<template>
  <div class="browse-list-item">

    <div class="browse-list-img-thumb fill-height">
      <img :src="thumb" alt="browse" />
    </div>

    <div class="browse-list-content fill-height">
      <h3 class="bl-desc"><NuxtLink :to="`/projects/${item.id}/overview`">{{ item.name }}</NuxtLink></h3>
      
      <div class="bl-anal">
        <v-row>
          <v-col cols="6">
            <h4>{{ item.sequences[0] }}</h4>
            <h4>{{ [...item.sequences[1]].reverse().join("") }}</h4>
          </v-col>
          <v-col cols="6">
            <v-select
              label="Analyses"
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
                <v-list-item class="item-v-select" v-bind="props" :title="item.raw.title" :value="item.raw.value" :prepend-icon="item.raw.icon"></v-list-item>
              </template>
            </v-select>
          </v-col>        
      </v-row>
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
            :to="`/projects/${item.id}/overview`"
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
</template>

<script setup>

  const { $globals } = useNuxtApp()
  const config = useRuntimeConfig()

  const { item } = defineProps(['item'])

  // thumbnail
  const thumb = $globals.thumbnail(config.public.externalApi, item.id)

  /* ANALYSES */
  const analyses = $globals.projects.analyses
  const itemsAnal = analyses.map(item => ({ title: item.name, value: item.id, icon: item.icon }))
  const modelAnalyses = ref(null)

  const selectAnalyses = async () => {
    console.log(`go to ${item.id} > ${modelAnalyses.value}`)
    // *******************
    // *******************
    // TODO WHEN ALL ANALYSES ARE READY
    // await navigateTo(`/projects/${item.id}/${modelAnalyses.value}`)
    // *******************
    // *******************
  }

  /* PREVIEW TRAJECTORY (TODO) */
  const previewTrajectory = () => {
    console.log('previewTrajectory')
  }

</script>

<style scoped>
.v-list-item { font-size: 14px!important; }
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
    border-bottom: solid 2px var(--palette-2);
  }
  .browse-list-img-thumb img { max-height: 100px; }
  .browse-list-content {
    align-self: self-start;
    grid-area: content;
    padding-top: .7rem;
    padding-left: 2rem;
    padding-right: .5rem;
  }
  h3 a { text-decoration: none; color: var(--palette-4); }
  h3 a:hover { color: var(--palette-6); }
  .bl-anal { margin-top: 1rem; margin-right: .5rem; border-bottom: solid 2px var(--palette-2); min-height: 54px; }
  h4 { text-transform: uppercase; font-size: 20px; color: var(--dark-text); font-weight:500; font-family: 'Roboto Mono', monospace; }
  .bl-anal p { color: var(--dark-text); font-weight:400; margin-top: .25rem; }
  .browse-list-append {
    align-self: center;
    display: flex;
    align-items: center;
    grid-area: append;
    flex-wrap: wrap;
    width: 37px;
    border-bottom: solid 2px var(--palette-2);
  }
  .browse-list-append .v-btn { margin-bottom: .5rem; }

  @media only screen and (max-width: 600px) {
    .browse-list-item { display: block; }
    .browse-list-img-thumb { justify-content: center; margin-right: 0; border-bottom: none; }
    .browse-list-img-thumb img { max-height: 180px; }
    .browse-list-content { padding-left: 0; padding-right: 0; }
    .bl-anal { margin-right: 0; border-bottom: none; } 
    .browse-list-append { width: 100%; justify-content: space-around; padding: .7rem 0;}
  }

</style>
