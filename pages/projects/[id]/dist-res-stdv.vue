<template>
  <v-container>

    <h1>Distance per residue standard deviation</h1>

    <Breadcrumbs :props="{id: id, text: 'Dist. residue st. dev.', title: title}" />

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <div id="header-container">
              <div>
                <v-icon size="small" icon="mdi-chart-bell-curve"></v-icon> &nbsp;RESIDUES DISTANCE STANDARD DEVIATIONS
              </div>
              <v-btn prepend-icon="mdi-arrow-expand-horizontal"
                variant="outlined"
                color="red-accent-4"
                :to="`/projects/${id}/dist-res-average`"
                >AVERAGES</v-btn>
            </div>
          </template>

          <template v-slot:text>

            <p>The <strong>standard deviation</strong> of distances per residue is calculated by considering the <strong>distances</strong> between corresponding <strong>atoms</strong> in adjacent residues for <strong>each pair</strong> and then <strong>computing</strong> the standard deviation of these <strong>distance</strong> values.</p>
            
            <DistResiduePlot :id="id" type="stdvs" />

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
    title: `Distance per residue standard deviation for ${title}`
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