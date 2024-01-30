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
              <v-col lg="8" md="8" sm="8" cols="12" class="px-0 py-1">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  label="Search by sequence"
                  single-line
                  clearable
                  :rules="[validateSequence]"
                  v-model="seqSearch"
                  @input="checkSeqSearch"
                  @click:clear="clearValidation"
                  ref="searchSeqFieldRef"
                ></v-text-field>
              </v-col>
              <v-col lg="4" md="4" sm="4" cols="12" class="pe-0 py-1" v-bind:class="{ 'ps-0': display.smAndDown, 'ps-2': display.smAndUp }">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  label="Search by sequence id"
                  single-line
                  clearable
                  :rules="[validateSeqName]"
                  v-model="seqNameSearch"
                  @input="checkSeqName"
                  @click:clear="clearValidation"
                  ref="searchNameFieldRef"
                ></v-text-field>
              </v-col>
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
  import { useDisplay } from 'vuetify'
  //import { ref } from 'vue';

  const { $globals } = useNuxtApp()
  const config = useRuntimeConfig()
  const display = ref(useDisplay())

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
  if(browseList.status.value === 'error')  throw createError({ statusCode: browseList.error.value.statusCode, message: browseList.error.value.statusMessage, fatal: true })
  
  let totalItems = ref(browseList.data.value.total)
  let totalPages = ref(Math.ceil(browseList.data.value.total/rows.value))
  let projects = ref(browseList.data.value.projects)

  /* SEARCH BY SEQUENCE */
  
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
    const regex = /^[GATC]{2,20}$/;

    // if empty, remove error validation
    if(value === '' || value === null) return true;

    // Check if the value matches the pattern
    if (!regex.test(value)) {
      seqValid.value = false
      return 'Must be a valid DNA sequence: GATC in uppercase, between 2 and 20 nucleotides';
    }

    // Return true if the value is valid
    seqValid.value = true
    return true;
  }

  const checkSeqSearch = async (e) => {
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

  /* SEARCH BY SEQUENCE NAME */

  const seqNameSearch = ref('')
  const seqNameValid = ref(false)
  const validateSeqName = (value) => {
    // Define your regular expression pattern
    const regex = /^(0{1,3}|0{0,3}[1-9]|0{0,2}[1-9]\d{1,2}|1\d{2,3}|20[0-7]\d|2080)$/;

    // if empty, remove error validation
    if(value === '' || value === null) return true;

    // Check if the value matches the pattern
    if (!regex.test(value)) {
      seqNameValid.value = false
      return 'Any number between 0 and 2080';
    }

    // Return true if the value is valid
    seqNameValid.value = true
    return true;
  }

  const checkSeqName = async (e) => {
    page.value = 1
    if(seqNameSearch.value && seqNameValid.value) {
      const seqList = await useFetch(`${config.public.apiBase}/projects/sequence?seqname=${seqNameSearch.value}&limit=${rows.value}`)
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

  // trick to clear search input text when clicking on clear button
  const searchSeqFieldRef = ref(null)
  const searchNameFieldRef = ref(null)
  const clearValidation = async () => {
    if (searchSeqFieldRef.value) {
      searchSeqFieldRef.value.resetValidation();
      const browseList = await useFetch(`${config.public.apiBase}/projects/?limit=${rows.value}&page=${page.value}`)
      totalItems.value = browseList.data.value.total
      totalPages.value = Math.ceil(browseList.data.value.total/rows.value)
      projects.value = browseList.data.value.projects
    }
    if(searchNameFieldRef.value) {
      searchNameFieldRef.value.resetValidation();
      const browseList = await useFetch(`${config.public.apiBase}/projects/?limit=${rows.value}&page=${page.value}`)
      totalItems.value = browseList.data.value.total
      totalPages.value = Math.ceil(browseList.data.value.total/rows.value)
      projects.value = browseList.data.value.projects
    }
  }

  /* PAGINATION */
  const rowsPerPage = $globals.rowsPerPage

  const totalVisible = ref(9)
  const calculateTotalVisible = () => {
    if(window.innerWidth > 960) totalVisible.value = 9
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
    } else if(seqNameSearch.value && seqNameValid.value) {
      prjList = await useFetch(`${config.public.apiBase}/projects/sequence?seqname=${seqNameSearch.value}&limit=${rows.value}&page=${page.value}`)
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