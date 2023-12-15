<template>
    <v-container>

      <h1>The Consortium</h1>

      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:divider>
          <v-icon icon="mdi-circle-small"></v-icon>
        </template>
      </v-breadcrumbs>

      <v-row> 
        <v-col lg="6" md="6" sm="6" xs="12">
          <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

            <template v-slot:title>
              <v-icon size="small" icon="mdi-account-group"></v-icon> &nbsp;ABC CONSORTIUM
            </template>

            <template v-slot:text>
              <p>The <strong>Ascona B-DNA Consortium (ABC)</strong>, initiative originated in 2001 at a conference in Monte Verità that involved a number of those working on methods and applications of <strong>Molecular Dynamics (MD)</strong> simulations to <strong>nucleic acids</strong>, and a second Ascona meeting was held in 2006. The original objective of the ABC project was to produce a <strong>database of state-of-the-art MD on DNA</strong> in which all <strong>136 independent tetranucleotide steps</strong> were represented, developing standards and protocols for the simulation of DNA, and obtaining information for the comprehensive study and <strong>improved understanding</strong> of base-pair sequence effects on structure and dynamics. The ABC has been <strong>active</strong> during the last <strong>20 years</strong>, involving more than <strong>40 experts from Europe</strong>, <strong>Asia</strong> and <strong>America</strong> and dozens of collaborators focused on the <strong>structure of B-DNA</strong> from electrons and up to nucleosomes.</p>
            </template>
          </v-card>
        </v-col>

        <v-col 
          lg="3" md="6" sm="6" xs="12"
          v-for="(partner, index) in partners"
          :key="index"
          >
          <v-card rounded="sm" class="elevation-2 pa-4 h-100" >

            <v-card-item>
              <div>
                <div class="text-overline mb-1">
                  {{ partner.name }}
                </div>
                <div class="text-h6 mb-1 img-container">
                  <NuxtImg :src="`/img/consortium/${partner.img}`" class="logo-partner" :alt="partner.name" />
                </div>
                <div class="text-caption">{{ partner.people.join(", ") }}</div>
              </div>
            </v-card-item>

            <v-card-actions>
              <v-btn
                prepend-icon="mdi-web"
                color="red-accent-4"
                size="small"
                :href="partner.url"
                target="_blank"
                >
                    Visit website
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        
      </v-row>

    </v-container>
      
  </template>
  
  <script setup>

    const { $globals } = useNuxtApp()

    const partners = $globals.partners

    useHead({
        title: 'The consortium' 
    })

    const breadcrumbs =  [
      {
        title: 'About',
        disabled: false,
        to: '/',
      },
      {
        title: 'The consortium',
        disabled: true
      }
    ]

  </script>

  <style scoped>
    .v-card { display: flex; flex-flow: column; }
    .v-card-actions { flex: 1 1 auto; align-items: end; }
    .img-container { display: flex; align-items: center; /*min-height: 100px;*/ justify-content: center; /*padding-top:2rem;*/ height: 120px; }
    img.logo-partner { /*width:-webkit-fill-available; max-height: 200px;*/ max-height: 100px; }
    .text-overline { line-height: 1rem; padding-bottom: .5rem; border-bottom: 1px solid var(--grey-light); min-height: 41px; }
    .text-caption {padding-top: .5rem; border-top: 1px solid var(--grey-light); }
    .v-btn  { border: solid 1px;}

    @media only screen and (max-width: 1280px) {
      .text-overline { min-height: auto; }
    }
  </style>