<template>
    <v-container>
  
      <h1>Project slfhsdfjklshfjksdf</h1>
  
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:divider>
          <v-icon icon="mdi-circle-small"></v-icon>
        </template>
      </v-breadcrumbs>
  
      
  
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
    const config = useRuntimeConfig()
  
    useHead({
      title: 'Project slfhsdfjklshfjksdf' 
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
        title: 'Project slfhsdfjklshfjksdf',
        disabled: true
      }
    ]
    
    /*const browseList = await useFetch(`${config.public.apiBase}/projects/list?limit=10&page=1`)
    
    const projects = ref(browseList.data.value.data)*/

  
  </script>
  
  <style scoped>
    
  </style>