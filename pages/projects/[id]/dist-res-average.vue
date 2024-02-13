<template>
  <v-container>

    <h1>Distance per residue average</h1>

    <Breadcrumbs :props="{id: id, text: 'Dist. residue average', title: title}" />

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <div id="header-container">
              <div>
                <v-icon size="small" icon="mdi-arrow-expand-horizontal"></v-icon> &nbsp;RESIDUES DISTANCE AVERAGES
              </div>
              <v-btn prepend-icon="mdi-chart-bell-curve"
                variant="outlined"
                color="red-accent-4"
                :to="`/projects/${id}/dist-res-stdv`"
                >STANDARD DEVIATIONS</v-btn>
            </div>
          </template>

          <template v-slot:text>

            <p>The <strong>average distance</strong> between DNA <strong>residues</strong> refers to the <strong>average spatial separation</strong> between specific atoms in the <strong>DNA</strong> molecules.</p>
            
            <DistResiduePlot :id="id" type="means" />

          </template>
        </v-card>
      </v-col>

    </v-row>
    
  </v-container>
</template>

<script setup>

  const { id } = useRoute().params

  const config = useRuntimeConfig()

  const datap = await useFetch(`${config.public.apiBase}/projects/${id}`)
  if(datap.status.value === 'error')  throw createError({ statusCode: datap.error.value.statusCode, message: datap.error.value.statusMessage, fatal: true })
  const project = ref(datap.data.value)

  const title = project.value.metadata.NAME

  useHead({
    title: `Distance per residue average for ${title}`
  })

</script>

<style scoped>
  #header-container {
    display: flex; 
    justify-content: space-between;
  }

  @media only screen and (max-width: 600px) {
    #header-container {
      flex-direction: column;
    }
    #header-container .v-btn {  margin-top: 1rem; }
  }
</style>