<template>
    <v-container>

      <h1>About {{ $globals.shortName }}</h1>

      <v-row> 
        <v-col cols="12" >
          <v-card rounded="sm" class="elevation-2 pa-4" >

            <template v-slot:title>
              <v-icon size="small" icon="mdi-information-slab-circle"></v-icon> ABOUT THIS WEBSITE
            </template>

            <template v-slot:text>
              <p>Welcome to the landing page of the <strong>{{ $globals.shortName }}</strong> project, the latest effort (2021) of the <strong>Ascona B-DNA (ABC) consortium</strong>. The study is focused on the systematic characterization of the physical properties of all <strong>2080 unique hexanucleotides</strong>, from a collection of 950, 10μs-long MD simulations.</p>

              <p>The vast simulation effort will allow the exploration of <strong>long-term dynamics of solvated duplexes</strong> to define potential frustration effects in <strong>DNA, sequence-dependent solvent</strong> and <strong>ion atmosphere, correlation and signal transfer effects</strong>, which could not be explored in previous calculations focussed in much shorter elements.</p>

              <p>The current <strong>ABC consortium</strong> is formed by <strong>thirteen groups</strong> (the most visible ones) from <strong>Europe and US</strong>.</p>

              <p><NuxtImg src="/img/home/home.png" id="home-img" alt="home image" /></p>
            </template>
          </v-card>
        </v-col>
      </v-row>

      <v-row> 
        <v-col cols="12">
          <v-card rounded="sm" class="elevation-2 pa-4">

            <v-row justify="space-around" align="center" class="py-4">

              <a 
              v-for="(partner, index) in partnersLine(partners, 0)"
              :href="partner.url" 
              target="_blank">
                <NuxtImg :src="`/img/consortium/${partner.img}`" class="logo-partner-home" :alt="partner.name" />
              </a>

            </v-row>

            <v-row justify="space-around" align="center" class="py-4">

              <a 
              v-for="(partner, index) in partnersLine(partners, 1)"
              :href="partner.url" 
              target="_blank">
                <NuxtImg :src="`/img/consortium/${partner.img}`" class="logo-partner-home" :alt="partner.name" />
              </a>

            </v-row>

          </v-card>
        </v-col>
      </v-row>

    </v-container>
      
  </template>
  
  <script setup>

    //console.log(useRoute())

    const { $globals } = useNuxtApp()

    const partners = $globals.partners

    useHead({
        title: 'About' 
    })

    const partnersLine = (partners, line) => {
      return partners.filter(item => item.line === line)
    }

  </script>


  <style scoped>
    h1 { margin-bottom: 1rem; }
    img#home-img { width: 100%; }
    .logo-partner-home { max-width:100px; }

    @media only screen and (max-width: 960px) {
      .logo-partner-home { max-width:90px; }
    }

    @media only screen and (max-width: 768px) {
      .logo-partner-home { max-width:60px; }
    }

    @media only screen and (max-width: 600px) {
      .logo-partner-home { max-width:120px; }
    }

  </style>