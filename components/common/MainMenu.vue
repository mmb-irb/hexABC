
<template>
  <v-app-bar class="px-3 elevation-4" flat density="default">
    <v-container>
      <v-row style="height:64px;"> 
        <v-col lg="2" md="2" sm="6" class="py-0">
          <NuxtLink to="/" @click="toggleMenu('/')"><img src="/img/logo.png" id="main-logo" alt="main logo" /></NuxtLink>
        </v-col>

        <v-col lg="10" md="10" sm="6" class="py-0">
          <div class="float-right h-100" >
            <v-btn prepend-icon="mdi-information" rounded="0" color="primary" @click="toggleMenu('/')" to="/" class="common-menu">
              About
            </v-btn>

            <v-btn prepend-icon="mdi-account-supervisor-circle" rounded="0" @click="toggleMenu('/consortium')" color="primary" to="/consortium" class="common-menu">
              The consortium
            </v-btn>

            <v-btn prepend-icon="mdi-clipboard-text-search" rounded="0" color="primary" class="common-menu">
              Projects
              <v-menu activator="parent">
                <v-list id="submenu-search">
                  <v-list-item
                    v-for="(item, index) in projects_menu"
                    :key="index"
                    :value="index"
                    :to="item.to"
                    :prepend-icon="item.icon"
                    :title="item.title"
                    @click="toggleMenu(item.to)"
                  >
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>

            <v-btn prepend-icon="mdi-chart-box" rounded="0" color="primary" @click="toggleMenu('/results')" to="/results"  class="common-menu">
              Results
            </v-btn>

            <v-btn prepend-icon="mdi-cloud-braces" rounded="0" color="primary" @click="toggleMenu('/rest')" to="/rest" class="common-menu">
              REST API
            </v-btn>

            <v-btn prepend-icon="mdi-help-circle" rounded="0" color="primary" class="common-menu">
              Help
            </v-btn>


            <v-menu v-model="menu_resp" :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <!--<v-btn icon="mdi-menu" v-bind="props" rounded="0" class="float-right" id="responsive-menu"></v-btn>-->
                <div v-bind="props" id="responsive-menu-btn" class="float-right" @click="animateBtn">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </template>

              <v-list id="submenu-search-responsive">

                <v-list-item prepend-icon="mdi-information" title="About" to="/" @click="menu_resp = false; toggleMenu('/')"></v-list-item>

                <v-list-item prepend-icon="mdi-account-supervisor-circle" title="The consortium" to="/consortium" @click="menu_resp = false; toggleMenu('/consortium')"></v-list-item>

                <v-list-group value="Projects">
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-clipboard-text-search"
                      title="Projects"
                    ></v-list-item>
                  </template>
                  <v-list-item
                    v-for="(item, index) in projects_menu"
                    :key="index"
                    :value="index"
                    :to="item.to"
                    :prepend-icon="item.icon"
                    :title="item.title"
                    @click="menu_resp = false; toggleMenu(item.to)"
                  >
                  </v-list-item>
                </v-list-group>

                <v-list-item prepend-icon="mdi-chart-box" title="Results" to="/results" @click="menu_resp = false; toggleMenu('/results')"></v-list-item>

                <v-list-item prepend-icon="mdi-cloud-braces" title="REST API" to="/rest" @click="menu_resp = false; toggleMenu('/rest')"></v-list-item>

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
  import structureSettings from '@/modules/structure/structureSettings'

  const { 
    setProperty
  } = structureSettings()

  const projects_menu = [
    { title: 'Browse', to: '/projects/browse', icon: 'mdi-compass-outline' },
    { title: 'Advanced Search', to: '', icon: 'mdi-tune' }
        
  ]

  const menu_resp = ref(false)

  const animateBtn = () => {
    document.querySelector('#responsive-menu-btn').classList.toggle('open');
  }

  const toggleMenu = (pth) => {
    let [, ...currMenuSection] = pth.split('/')
    setProperty('currMenuSection', currMenuSection)
  }

  // control menu responsive button status via responsive menu
  watch(menu_resp, (val) => {
    if (val) document.querySelector('#responsive-menu-btn').classList.add('open');
    else document.querySelector('#responsive-menu-btn').classList.remove('open');
  })

</script>

<style scoped>
  header { z-index:10000!important; }
  #main-logo { max-height: 60px; vertical-align: bottom; }
  .v-btn { height: 100%; font-weight: 600; color: var(--palette-5)!important; }
  .v-btn--active { border-bottom: 2px solid;}

  #submenu-search .v-list-item { font-size: 12px!important; }
  #submenu-search .v-menu > .v-list-item-title { font-size: .8rem!important; }
  #submenu-search .v-list-item--density-default.v-list-item--one-line { min-height: 35px;}

  /* RESPONSIVE MENU */
  #responsive-menu-btn { display: none; }
  /*.common-menu { display: block; }*/

  #responsive-menu-btn {
    width: 45px;
    height: 50px;
    position: relative;
    margin: 15px auto;
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transition: .5s ease-in-out;
    -moz-transition: .5s ease-in-out;
    -o-transition: .5s ease-in-out;
    transition: .5s ease-in-out;
    cursor: pointer;
  }

  #responsive-menu-btn span {
    display: block;
    position: absolute;
    height: 5px;
    width: 100%;
    background: var(--palette-5);
    border-radius: 9px;
    opacity: 1;
    left: 0;
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transition: .25s ease-in-out;
    -moz-transition: .25s ease-in-out;
    -o-transition: .25s ease-in-out;
    transition: .25s ease-in-out;
  }

  #responsive-menu-btn span:nth-child(1) {
    top: 0px;
  }

  #responsive-menu-btn span:nth-child(2) {
    top: 14px;
  }

  #responsive-menu-btn span:nth-child(3) {
    top: 28px;
  }

  #responsive-menu-btn.open span:nth-child(1) {
    top: 14px;
    -webkit-transform: rotate(135deg);
    -moz-transform: rotate(135deg);
    -o-transform: rotate(135deg);
    transform: rotate(135deg);
  }

  #responsive-menu-btn.open span:nth-child(2) {
    opacity: 0;
    left: -60px;
  }

  #responsive-menu-btn.open span:nth-child(3) {
    top: 14px;
    -webkit-transform: rotate(-135deg);
    -moz-transform: rotate(-135deg);
    -o-transform: rotate(-135deg);
    transform: rotate(-135deg);
  }

  @media only screen and (max-width: 1280px) {
    .common-menu { padding:0 .8rem; letter-spacing: 1px; }
  }

  @media only screen and (max-width: 960px) {
    #responsive-menu-btn { display: block; }
    .common-menu { display: none; }
  }
</style>