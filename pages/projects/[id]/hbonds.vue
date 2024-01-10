<template>
  <v-container>

    <h1>Hydrogen Bonds</h1>

    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon icon="mdi-circle-small"></v-icon>
      </template>
    </v-breadcrumbs>

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <v-icon size="small" icon="mdi-transit-connection-horizontal mdi-rotate-135"></v-icon> &nbsp;HYDROGEN BONDS
          </template>

          <template v-slot:text>

            HEATMAP PLOOOOT

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
    title: `HBonds for ${title}`,
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
        title: 'Overview',
        disabled: false,
        to: `/projects/${id}/overview`,
      },
      {
        title: `HBonds analyses for ${title}`,
        disabled: true
      }
    ]

</script>

<style scoped>

</style>