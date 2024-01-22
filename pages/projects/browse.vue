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
            
            <v-row class="flex py-2 mx-0" > 
              <v-text-field
                density="compact"
                variant="outlined"
                label="Search by sequence"
                single-line
                :rules="[validateSequence]"
                v-model="seqSearch"
                @input="checkText"
              ></v-text-field>
              <!--<v-btn
                prepend-icon="mdi-magnify"
                variant="outlined"
                color="red-accent-4"
                class="ms-2"
                style="height: 40px;"
                :disabled="!seqValid"
                @click="searchBySequence" 
                >
                    Search
                </v-btn>-->
            </v-row>

            <BrowseItem v-for="(item, index) in projects" :key="`${Math.random()}`" :item="item" :seq="seqProp" />

            <v-row justify="space-between" class="pt-5" > 
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
  
  let totalItems = ref(browseList.data.value.total)
  let totalPages = ref(Math.ceil(browseList.data.value.total/rows.value))
  let projects = ref(browseList.data.value.projects)

  /* SEARCH */
  
  /*const searchBySequence = async () => {
    if(seqSearch.value && seqValid.value) {
      //const seqList = await useFetch(`${config.public.apiBase}/projects/sequence?seq=${seqSearch.value}&limit=${rows.value}&page=${page.value}`)
      const seqList = await useFetch(`${config.public.apiBase}/projects/sequence?seq=${seqSearch.value}&limit=${rows.value}`)
      totalItems.value = seqList.data.value.total
      totalPages.value = Math.ceil(seqList.data.value.total/rows.value)
      projects.value = seqList.data.value.projects
      //console.log(projects.value)
    }
  }*/

  const seqSearch = ref('')
  const seqValid = ref(false)
  const seqProp = computed(() => {
   return {
      str: seqSearch.value,
      valid: seqValid.value
    }
  })
  const validateSequence = (value) => {
      // Define your regular expression pattern
      const regex = /^[GATC]{3,}$/;

      // Check if the value matches the pattern
      if (!regex.test(value)) {
        seqValid.value = false
        return 'Text must be a valid DNA sequence: GATC in uppercase, at least 3 nucleotides';
      }

      // Return true if the value is valid
      seqValid.value = true
      return true;
    }

  const checkText = async (e) => {
    page.value = 1
    if(seqSearch.value && seqValid.value) {
      const seqList = await useFetch(`${config.public.apiBase}/projects/sequence?seq=${seqSearch.value}&limit=${rows.value}`)
      totalItems.value = seqList.data.value.total
      totalPages.value = Math.ceil(seqList.data.value.total/rows.value)
      projects.value = seqList.data.value.projects
    } else {
      const browseList = await useFetch(`${config.public.apiBase}/projects/?limit=${rows.value}&page=${page.value}`)
      totalItems.value = browseList.data.value.total
      totalPages.value = Math.ceil(browseList.data.value.total/rows.value)
      projects.value = browseList.data.value.projects
    }
    
  }

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
    let prjList
    if(seqSearch.value && seqValid.value) {
      prjList = await useFetch(`${config.public.apiBase}/projects/sequence?seq=${seqSearch.value}&limit=${rows.value}&page=${page.value}`)
    } else {
      prjList = await useFetch(`${config.public.apiBase}/projects/?limit=${rows.value}&page=${page.value}`)
    }
    projects.value = prjList.data.value.projects
    totalPages.value = Math.ceil(prjList.data.value.total/rows.value)
    if(prjList.data.value.projects.length === 0) {
      page.value = 1
      paginate()
    }
  }

</script>

<style scoped>
  #container-header { display: flex; justify-content: space-between; }
  #total-items { font-size: 0.8rem; color: var(--palette-2); }
</style>