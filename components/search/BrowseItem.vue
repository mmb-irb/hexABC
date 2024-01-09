<template>
  <div class="browse-list-item">

    <div class="browse-list-img-thumb fill-height">
      <img :src="thumb" alt="browse" />
    </div>

    <div class="browse-list-content fill-height">
      <h3 class="bl-desc"><NuxtLink :to="`/projects/${item.accession}/overview`">{{ item.name }}</NuxtLink></h3>
      
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
            :to="`/projects/${item.accession}/overview`"
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

  /* TODO useSettings.js WITH HISTORY */

  const { $globals } = useNuxtApp()

  const { item } = defineProps(['item'])

  // thumbnail
  const thumb = $globals.thumbnail(item.id)

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
  .bl-anal { margin-top: 1rem; margin-right: .5rem; border-bottom: solid 2px var(--palette-2); }
  h4 { text-transform: uppercase; font-size: 14px; color: var(--dark-text); font-weight:700;}
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
    .browse-list-img-thumb { justify-content: center; margin-right: 0;}
    .browse-list-img-thumb img { max-height: 180px; }
    .browse-list-content { padding-left: 0; padding-right: 0; }
    .bl-anal { margin-right: 0; } 
    .browse-list-append { width: 100%; justify-content: space-around; padding: .7rem 0;}
  }

</style>
