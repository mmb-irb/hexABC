<template>
  <v-container>

    <h1>{{ title }}</h1>

    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon icon="mdi-circle-small"></v-icon>
      </template>
    </v-breadcrumbs>

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <v-icon size="small" icon="mdi-text-box-search"></v-icon> &nbsp;OVERVIEW
          </template>

          <template v-slot:text>

            {{ project.metadata.DESCRIPTION }}

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
                      src="/img/projects/analyses/curves/curves-analyses.png"
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
            </v-row>

          </template>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { ref } from 'vue';

  const { id } = useRoute().params
  const config = useRuntimeConfig()

  const data = await useFetch(`${config.public.apiBase}/projects/${id}`)
  const project = ref(data.data.value.project)

  const title = project.value.metadata.NAME

  useHead({
    title: title
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
      title: title,
      disabled: true
    }
  ]

</script>

<style scoped>
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