
import type { set } from 'nuxt/dist/app/compat/capi';
<template>
  <v-app-bar class="px-3 elevation-4" flat density="default">
    <v-container>
      <v-row style="height:64px;"> 
        <v-col lg="2" md="2" sm="6" class="py-0">
          <NuxtLink to="/"><img src="/img/logo.png" id="main-logo" alt="main logo" /></NuxtLink>
        </v-col>

        <v-col lg="10" md="10" sm="6" class="py-0">
          <div class="float-right h-100">
            <v-btn prepend-icon="mdi-information" rounded="0" color="primary" to="/" class="common-menu">
              About
            </v-btn>

            <v-btn prepend-icon="mdi-account-supervisor-circle" rounded="0" color="primary" to="/consortium" class="common-menu">
              The consortium
            </v-btn>

            <v-btn prepend-icon="mdi-card-search" rounded="0" color="primary" class="common-menu">
              Search
              <v-menu activator="parent">
                <v-list id="submenu-search">
                  <v-list-item
                    v-for="(item, index) in search_menu"
                    :key="index"
                    :value="index"
                    :to="item.to"
                    :prepend-icon="item.icon"
                    :title="item.title"
                  >
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>

            <v-btn prepend-icon="mdi-cloud-braces" rounded="0" color="primary" class="common-menu">
              REST API
            </v-btn>

            <v-btn prepend-icon="mdi-help-circle" rounded="0" color="primary" class="common-menu">
              Help
            </v-btn>


            <v-menu v-model="menu_resp" :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-menu" v-bind="props" rounded="0" class="float-right" id="responsive-menu"></v-btn>
              </template>

              <v-list id="submenu-search-responsive">
                <v-list-item prepend-icon="mdi-information" title="About" to="/" @click="menu_resp = false"></v-list-item>
                <v-list-item prepend-icon="mdi-account-supervisor-circle" title="The consortium" to="/consortium" @click="menu_resp = false"></v-list-item>

                <v-list-group value="Search">
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-card-search"
                      title="Search"
                    ></v-list-item>
                  </template>
                  <v-list-item
                    v-for="(item, index) in search_menu"
                    :key="index"
                    :value="index"
                    :to="item.to"
                    :prepend-icon="item.icon"
                    :title="item.title"
                    @click="menu_resp = false"
                  >
                  </v-list-item>
                </v-list-group>

                <v-list-item prepend-icon="mdi-cloud-braces" title="REST API" to="" @click="menu_resp = false"></v-list-item>
                <v-list-item prepend-icon="mdi-help-circle" title="Help"  to="" @click="menu_resp = false"></v-list-item>

              </v-list>

            </v-menu>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup>

  import { ref } from 'vue'

  const search_menu = [
        { title: 'Plain Search', to: '', icon: 'mdi-magnify' },
        { title: 'Advanced Search', to: '', icon: 'mdi-tune' },
        { title: 'Browse', to: '/search/browse', icon: 'mdi-compass-outline' },
  ]

  const menu_resp = ref(false)

</script>

<style scoped>
  #main-logo { max-height: 60px; vertical-align: bottom; }
  .v-btn { height: 100%; font-weight: 600; color: var(--palette-5)!important; }
  .v-btn--active { border-bottom: 2px solid;}

  #submenu-search .v-list-item { font-size: 12px!important; }
  #submenu-search .v-menu > .v-list-item-title { font-size: .8rem!important; }
  #submenu-search .v-list-item--density-default.v-list-item--one-line { min-height: 35px;}

  /* RESPONSIVE MENU */
  #responsive-menu { display: none; }
  /*.common-menu { display: block; }*/

  @media only screen and (max-width: 960px) {
    #responsive-menu { display: block; }
    .common-menu { display: none; }
  }
</style>