<template>
  <v-container>

    <h1>Browse {{ $globals.shortName }} Projects</h1>

    <Breadcrumbs :props="{section:'Browse'}" />

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <div id="container-header">
              <div><v-icon size="small" icon="mdi-compass"></v-icon> &nbsp;BROWSE PROJECTS</div>
              <div id="total-items">{{ (page - 1) * rows + 1 }}-{{ (page * rows) <= totalItems ? page * rows : totalItems }} of {{ totalItems }}</div>
            </div>
          </template>

          <template v-slot:text>
            
            <BrowseItem v-for="(item, index) in projects" :key="index" :item="item" />

            <v-row justify="space-between" class="pt-5 " > 
              <v-col lg="2" md="2" sm="4" xs="12">
                <v-select
                  v-model="rows"
                  label="Rows per page"
                  :items="rowsPerPage"
                  @update:modelValue="paginate"
                ></v-select>
              </v-col>
              <v-col lg="10" md="10" sm="8" xs="12">
                <v-pagination
                  v-model="page"
                  :length="totalPages"
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
    title: 'Browse collection',
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@200;500&display=swap' }
    ]
  })

  const rows = ref(10)
  const page = ref(1)
  
  /* FIRST LOAD */
  const browseList = await useFetch(`${config.public.apiBase}/projects/?limit=${rows.value}&page=${page.value}`)
  
  const totalItems = browseList.data.value.total
  const totalPages = ref(Math.ceil(browseList.data.value.total/rows.value))
  const projects = ref(browseList.data.value.projects)

  /* PAGINATION */
  const rowsPerPage = $globals.rowsPerPage

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
    const browseList = await useFetch(`${config.public.apiBase}/projects/?limit=${rows.value}&page=${page.value}`)
    projects.value = browseList.data.value.projects
    totalPages.value = Math.ceil(browseList.data.value.total/rows.value)
    if(browseList.data.value.projects.length === 0) {
      page.value = 1
      paginate()
    }
  }

</script>

<style scoped>
  #container-header { display: flex; justify-content: space-between; }
  #total-items { font-size: 0.8rem; }
</style>