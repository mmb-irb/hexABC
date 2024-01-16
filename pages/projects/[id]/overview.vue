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
            <p id="sequences">
              {{ project.metadata.SEQUENCES[0] }}<br>
              {{ [...project.metadata.SEQUENCES[1]].reverse().join("") }}
            </p>

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
              <v-col lg="3" md="6" sm="6" xs="12">
                <v-hover v-slot:default="{ isHovering, props }">
                  <v-card
                    class="mx-auto"
                  >
                  <NuxtLink :to="`/projects/${id}/curves-average`"
                    v-bind="props"
                    :class="isHovering ? 'bg-link-hover' : 'bg-link'">
                    <v-img
                      :src="curvesImg"
                      height="200px"
                      cover
                      v-bind="props"
                      :class="isHovering ? 'bg-img-hover' : 'bg-img'"
                    >
                    </v-img>
                  </NuxtLink>

                  <v-card-title>
                    <NuxtLink :to="`/projects/${id}/curves-average`">Curves Analyses</NuxtLink>
                  </v-card-title>

                  </v-card>
                </v-hover>
              </v-col>

              <v-col lg="3" md="6" sm="6" xs="12">
                <v-hover v-slot:default="{ isHovering, props }">
                  <v-card
                    class="mx-auto"
                  >
                  <NuxtLink :to="`/projects/${id}/hbonds`"
                    v-bind="props"
                    :class="isHovering ? 'bg-link-hover' : 'bg-link'">
                    <v-img
                      :src="hbondsImg"
                      height="200px"
                      cover
                      v-bind="props"
                      :class="isHovering ? 'bg-img-hover' : 'bg-img'"
                    >
                    </v-img>
                  </NuxtLink>

                  <v-card-title>
                    <NuxtLink :to="`/projects/${id}/hbonds`">HBonds Analyses</NuxtLink>
                  </v-card-title>

                  </v-card>
                </v-hover>
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

  // vuetify images must be imported like this
  import curvesImg from '/img/projects/analyses/curves/curves-analyses.png'
  import hbondsImg from '/img/projects/analyses/hbonds/hbonds.png'

  const { id } = useRoute().params
  const config = useRuntimeConfig()

  const data = await useFetch(`${config.public.apiBase}/projects/${id}`)
  const project = ref(data.data.value.project)

  const title = project.value.metadata.NAME

  useHead({
    title: title,
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@200;500&display=swap' }
    ]
  })

</script>

<style scoped>
  #sequences { font-size: 25px; color: var(--dark-text); font-weight:500; line-height: 25px; font-family: 'Roboto Mono', monospace; }
  .v-card .v-card-title { border-top: 1px solid var(--grey-light); text-align: center; }
  .v-card .v-card-title a { text-decoration: none; }
  .bg-link {
    display: block;
    transition: background-color 0.3s ease;
  }
  .bg-link-hover {
    display: block;
    transition: background-color 0.3s ease;
    background-color: rgba(0, 0, 0, 0.15);
  }
  .bg-img {
    transition: transform 0.3s ease;
  }
  .bg-img-hover {
    transition: transform 0.3s ease;
    transform: scale(0.9);
  }
</style>