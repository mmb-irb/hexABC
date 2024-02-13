<template>
  <v-container>

    <h1>Radius of gyration</h1>

    <Breadcrumbs :props="{id: id, text: 'Rgyr', title: title}" />

    <v-row> 
      <v-col cols="12">
        <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

          <template v-slot:title>
            <div id="header-container">
              <div>
                <v-icon size="small" icon="mdi-axis-y-rotate-clockwise"></v-icon> &nbsp;RGYR
              </div>
            </div>
          </template>

          <template v-slot:text>

            <p>The <strong>radius of gyration</strong> (Rgyr) is a <strong>measure</strong> of the spatial distribution of a <strong>set of atoms</strong> within a molecule. It provides insights into the compactness or the overall shape of a <strong>molecular structure</strong>.</p>
            
            <RgyrPlot :id="id" />

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
    title: `Rgyr for ${title}`
  })

</script>

<style scoped>

</style>